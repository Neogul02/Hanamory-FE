import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 })

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '당신은 꽃 전문가입니다.' },
      { role: 'user', content: prompt },
    ],
  })
  console.log('GPT Response:', response)

  return NextResponse.json({
    result: response.choices?.[0]?.message?.content ?? '',
  })
}
