// Gemini API 호출을 위한 공통 유틸리티 함수

interface GeminiFlowerResponse {
  koreanName: string
  flowerLang: string
  flowerDesc: string
}

/**
 * Gemini API를 호출하여 꽃 정보를 가져옵니다.
 * @param flowerName 영어 꽃 이름
 * @returns 꽃의 한국어 이름, 꽃말, 설명
 */
export async function fetchFlowerInfoFromGemini(flowerName: string): Promise<GeminiFlowerResponse> {
  const prompt = `다음 꽃에 대한 정보를 JSON 형식으로 제공해주세요:
꽃 이름: ${flowerName}

다음 형식으로 응답해주세요:
{
  "꽃": {
    "영어이름": "${flowerName}",
    "한국어이름": "한국어 꽃 이름",
    "꽃말": "꽃말을 한국어로",
    "설명": "꽃에 대한 설명과 꽃 관리방법을 한국어로 4-5 문장"
  }
}

응답은 반드시 JSON 형식만 제공하고, 다른 텍스트는 포함하지 마세요.`

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal: AbortSignal.timeout(30000), // 30초 타임아웃
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `API 오류: ${response.status}`)
  }

  let koreanFlowerName = flowerName
  let lang = '꽃말 정보를 찾을 수 없습니다.'
  let desc = '설명 정보를 찾을 수 없습니다.'

  try {
    let resultStr = data.result
    resultStr = resultStr.replace(/```json|```/g, '').trim()
    const json = JSON.parse(resultStr)
    const flowerObj = json.꽃 || Object.values(json)[0]
    koreanFlowerName = flowerObj?.한국어이름 || flowerObj?.이름 || flowerName
    lang = flowerObj?.꽃말 || '꽃말 정보를 찾을 수 없습니다.'
    desc = flowerObj?.설명 || '설명 정보를 찾을 수 없습니다.'
  } catch {
    // JSON 파싱 실패 시 전체 응답을 꽃말로 사용
    lang = data.result || '꽃말 정보를 찾을 수 없습니다.'
  }

  return {
    koreanName: koreanFlowerName,
    flowerLang: lang,
    flowerDesc: desc,
  }
}
