'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [flowerNames, setFlowerNames] = useState<string[]>([])
  const [flowerLang, setFlowerLang] = useState<string | null>(null)
  const [flowerDesc, setFlowerDesc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 파일 선택
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setFlowerNames([])
      setFlowerLang(null)
      setFlowerDesc(null)
      setError(null)
    }
  }

  // predict-json에서 class만 추출해 프롬프트 생성
  function makeFlowerPrompt(predictions: any[]) {
    const flowerSet = new Set(predictions.map((p) => p.class))
    const flowerList = Array.from(flowerSet)
    return {
      flowerList,
      prompt: `아래 꽃들의 꽃말과 정보를 json 형식으로 알려줘. 중복된 꽃은 하나만 알려주면 돼, 
      예시 {꽃 : {이름: "해바라기", 꽃말: "움직임, 추억", 설명: "해바라기는 태양을 따라 움직이는 특성으로 인해 긍정적인 상징을 가지고 있습니다. 주로 여름에 피며, 식용유를 만드는 데도 사용됩니다."}}\n[${flowerList.join(
        ', '
      )}]`,
    }
  }

  // 꽃 이름 예측 및 꽃말 요청
  const handlePredict = async () => {
    if (!selectedFile) {
      setError('이미지를 선택해주세요.')
      return
    }
    setLoading(true)
    setError(null)
    setFlowerNames([])
    setFlowerLang(null)
    setFlowerDesc(null)
    try {
      // 1. 꽃 이름 예측
      const formData = new FormData()
      formData.append('image', selectedFile)
      const res = await axios.post('/api/predict-json', formData)
      const data = res.data
      if (!data.predictions || !Array.isArray(data.predictions)) throw new Error('예측 결과가 올바르지 않습니다.')
      const { flowerList, prompt } = makeFlowerPrompt(data.predictions)
      setFlowerNames(flowerList)

      // 2. 꽃말 요청 (API Route로 fetch)
      const APIRequest = await axios.post('/api/gemini', { prompt })
      // gptRes.data.result는 json 문자열
      // 예시: { "꽃": { "이름": "해바라기", "꽃말": "움직임, 추억", "설명": "..." } }
      let lang = null
      let desc = null
      try {
        let resultStr = APIRequest.data.result
        resultStr = resultStr.replace(/```json|```/g, '').trim()
        const json = JSON.parse(resultStr)
        const flowerObj = json.꽃 || Object.values(json)[0]
        lang = flowerObj.꽃말 || ''
        desc = flowerObj.설명 || ''
      } catch {
        // 파싱 실패 시 전체 텍스트로 대체
        console.log('JSON 파싱 실패, 전체 텍스트 사용')
        lang = APIRequest.data.result
      }
      setFlowerLang(lang)
      setFlowerDesc(desc)
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  // 스타일 객체
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'sans-serif',
    },
    nav: {
      width: '100%',
      padding: '16px 0',
      borderBottom: '1px solid #eee',
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      fontSize: '2rem',
      letterSpacing: '0.1em',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
    },
    card: {
      maxWidth: 400,
      margin: '40px auto 0',
      padding: 24,
      background: '#f9fafb',
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
    },
    mainImg: {
      display: 'block',
      margin: '0 auto 24px',
      maxWidth: 320,
      width: '100%',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    input: {
      marginBottom: 16,
      display: 'block',
      width: '100%',
      fontSize: 14,
      color: '#555',
      padding: '8px 0',
    },
    previewBox: {
      marginBottom: 16,
    },
    previewImg: {
      display: 'block',
      margin: '0 auto',
      width: 160,
      height: 160,
      objectFit: 'contain' as const,
      borderRadius: 8,
      border: '1px solid #ddd',
      background: '#fff',
    },
    button: {
      width: '100%',
      padding: '12px 0',
      background: loading ? '#ddd' : '#ec4899',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 16,
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
      marginBottom: 0,
    },
    error: {
      marginTop: 16,
      color: '#ef4444',
      textAlign: 'center' as const,
    },
    resultBox: {
      marginTop: 32,
      textAlign: 'center' as const,
    },
    flowerName: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: '#ec4899',
    },
    flowerLang: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: 500,
    },
    flowerDesc: {
      marginTop: 8,
      fontSize: 15,
      color: '#444',
    },
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>Hanamory</nav>
      <div style={styles.card}>
        <img
          src={previewUrl || '/image/flower_1.jpg'}
          alt='꽃 이미지'
          style={styles.mainImg}
        />
        <input
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          style={styles.input}
        />
        <button
          onClick={handlePredict}
          disabled={loading || !selectedFile}
          style={styles.button}
        >
          {loading ? '분석 중...' : '꽃 이름 & 꽃말 분석'}
        </button>
        {error && <div style={styles.error}>{error}</div>}
        {flowerNames.length > 0 && (
          <div style={styles.resultBox}>
            <div>
              꽃 이름: <span style={styles.flowerName}>{flowerNames.join(', ')}</span>
            </div>
            {flowerLang && (
              <div style={styles.flowerLang}>
                <span style={{ fontWeight: 600 }}>꽃말:</span> {flowerLang}
              </div>
            )}
            {flowerDesc && <div style={styles.flowerDesc}>{flowerDesc}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
