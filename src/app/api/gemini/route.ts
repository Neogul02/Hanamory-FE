import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// 재시도 헬퍼 함수
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number = 5, initialDelay: number = 2000): Promise<T> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // 재시도 가능한 에러인지 확인 (503, 429 또는 메시지에 overloaded, UNAVAILABLE 포함)
      const errorStatus = error?.status || error?.response?.status
      const errorMessage = error?.message || ''
      const isRetryable = errorStatus === 503 || errorStatus === 429 || errorMessage.includes('503') || errorMessage.includes('429') || errorMessage.includes('overloaded') || errorMessage.includes('UNAVAILABLE')

      console.error(`🔴 시도 ${i + 1}/${maxRetries} 실패:`, {
        status: errorStatus,
        message: errorMessage.substring(0, 200),
        retryable: isRetryable,
      })

      // 재시도 불가능한 에러면 즉시 throw
      if (!isRetryable) {
        throw error
      }

      // 마지막 재시도면 throw
      if (i === maxRetries - 1) {
        console.error(`❌ ${maxRetries}회 재시도 후에도 실패했습니다.`)
        throw error
      }

      // 지수 백오프로 대기 (2초 → 4초 → 8초 → 16초 → 32초)
      const delay = initialDelay * Math.pow(2, i)
      console.log(`⏳ ${delay}ms 후 재시도합니다... (${i + 2}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found')
      return NextResponse.json({ error: 'No Google API Key' }, { status: 500 })
    }

    console.log('🤖 Gemini API 요청 시작 (프롬프트 길이:', prompt.length, ')')

    const ai = new GoogleGenAI({ apiKey })

    // 재시도 로직과 함께 Gemini API 호출 (안정적인 모델 사용)
    const result = await retryWithBackoff(
      async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp', 
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })
        return response
      },
      5, // 최대 5회 재시도
      2000 // 초기 대기 시간 2초
    )

    // 응답에서 텍스트 추출
    const text = result?.text || result?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(result)

    console.log('✅ Gemini 응답 성공 (길이:', text.length, ')')
    return NextResponse.json({ result: text })
  } catch (err: any) {
    console.error('Gemini API Error Details:', {
      message: err.message,
      status: err.status,
      response: err.response,
      stack: err.stack,
    })

    // 503 에러 처리
    const errorStatus = err?.status || err?.response?.status
    if (errorStatus === 503) {
      return NextResponse.json({ error: 'Gemini API가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.' }, { status: 503 })
    }

    // 429 에러 처리
    if (errorStatus === 429) {
      return NextResponse.json({ error: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' }, { status: 429 })
    }

    // 일반 에러
    return NextResponse.json(
      {
        error: err.message || '알 수 없는 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? err.toString() : undefined,
      },
      { status: 500 }
    )
  }
}
