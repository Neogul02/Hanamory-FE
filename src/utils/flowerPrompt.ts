// 꽃 이름 예측 결과에서 프롬프트를 생성하는 함수
export function makeFlowerPrompt(predictions: any[]) {
  // 예측 결과에서 꽃 이름들을 추출
  const flowerList = predictions
    .filter((pred) => pred.confidence > 0.3) // 신뢰도 30% 이상만 사용
    .slice(0, 3) // 상위 3개만 사용
    .map((pred) => pred.class || pred.name || pred.label)
    .filter(Boolean)

  // 꽃 이름이 없으면 기본값 설정
  if (flowerList.length === 0) {
    flowerList.push('알 수 없는 꽃')
  }

  // Gemini API용 프롬프트 생성
  const prompt = `다음 꽃들에 대한 정보를 JSON 형식으로 제공해주세요:
꽃 이름: ${flowerList.join(', ')}

다음 형식으로 응답해주세요:
{
  "꽃": {
    "영어이름": "${flowerList[0]}",
    "한국어이름": "한국어 꽃 이름",
    "꽃말": "꽃말을 한국어로",
    "설명": "꽃에 대한 설명과 꽃 관리방법을 한국어로 4-5 문장"
  }
}

응답은 반드시 JSON 형식만 제공하고, 다른 텍스트는 포함하지 마세요.`

  return { flowerList, prompt }
}
