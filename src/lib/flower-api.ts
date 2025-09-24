import axios from 'axios'

export interface FlowerPrediction {
  class: string
  confidence: number
}

export interface FlowerInfo {
  name: string
  meaning: string
  description: string
}

// predict-json에서 class만 추출해 프롬프트 생성
export function makeFlowerPrompt(predictions: FlowerPrediction[]) {
  const flowerSet = new Set(predictions.map((p) => p.class))
  const flowerList = Array.from(flowerSet)
  return {
    flowerList,
    prompt: `아래 꽃들의 꽃말과 정보를 json 형식으로 알려줘. 중복된 꽃은 하나만 알려주면 돼, 
    예시 {꽃 : {이름: "해바라기", 꽃말: "움직임, 추억", 설명: "해바라기는 태양을 따라 움직이는 특성으로 인해 긍정적인 상징을 가지고 있습니다. 주로 여름에 피며, 관리 방법"}}\n[${flowerList.join(', ')}]`,
  }
}

// 꽃 이름 예측
export async function predictFlower(file: File): Promise<FlowerPrediction[]> {
  const formData = new FormData()
  formData.append('image', file)
  const res = await axios.post('/api/predict-json', formData)
  const data = res.data

  if (!data.predictions || !Array.isArray(data.predictions)) {
    throw new Error('예측 결과가 올바르지 않습니다.')
  }

  return data.predictions
}

// 꽃말 및 설명 가져오기
export async function getFlowerInfo(prompt: string): Promise<FlowerInfo> {
  const APIRequest = await axios.post('/api/gemini', { prompt })

  let name = ''
  let meaning = ''
  let description = ''

  try {
    let resultStr = APIRequest.data.result
    resultStr = resultStr.replace(/```json|```/g, '').trim()
    const json = JSON.parse(resultStr)
    const flowerObj = json.꽃 || Object.values(json)[0]
    name = flowerObj.이름 || ''
    meaning = flowerObj.꽃말 || ''
    description = flowerObj.설명 || ''
  } catch {
    // 파싱 실패 시 전체 텍스트로 대체
    console.log('JSON 파싱 실패, 전체 텍스트 사용')
    meaning = APIRequest.data.result
  }

  return { name, meaning, description }
}
