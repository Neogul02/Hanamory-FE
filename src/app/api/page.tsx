'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useFlowerUploadStore } from '@/store/useFlowerUploadStore'

export default function ApiTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [jsonResult, setJsonResult] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<string>('확인 필요')
  // 꽃말 관련 상태
  const [flowerMeanings, setFlowerMeanings] = useState<{ [name: string]: string }>({})
  const [selectedFlowerName, setSelectedFlowerName] = useState<string>('')
  const [meaningsLoading, setMeaningsLoading] = useState<boolean>(false)

  const { setFile, setFlowerNames } = useFlowerUploadStore()

  // 파일 선택 처리
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFile(file) // store에 파일 저장

      // 파일 미리보기 URL 생성
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)

      // 이전 결과 초기화
      setResultImage(null)
      setJsonResult('')
      setError(null)
    }
  }

  // 서버 상태 확인
  async function checkServerStatus() {
    try {
      setServerStatus('확인 중...')
      setError(null)
      const response = await axios.get(`https://port-0-hanamory-be-mc4jrdp5a5037961.sel5.cloudtype.app`)
      console.log(response.data)
      setServerStatus('온라인')
    } catch (err) {
      setServerStatus('오프라인')
      setError(`서버 연결 실패 : ${err}`)
    }
  }

  // 이미지 예측 함수 (이미지 반환)
  async function getPredictionImage() {
    if (!selectedFile) {
      setError('파일을 먼저 선택해주세요')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await axios.post(`https://port-0-hanamory-be-mc4jrdp5a5037961.sel5.cloudtype.app/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      })

      const imageUrl = URL.createObjectURL(response.data)
      setResultImage(imageUrl)
    } catch (err) {
      setError('이미지 예측 실패')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 이미지 예측 함수 (JSON 반환)
  async function getPredictionJson() {
    if (!selectedFile) {
      setError('파일을 먼저 선택해주세요')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await axios.post(`https://port-0-hanamory-be-mc4jrdp5a5037961.sel5.cloudtype.app/predict-json`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setJsonResult(response.data)
      // 예측 결과를 store에 저장할 수 있지만 현재는 JSON만 표시
      if (response.data.predictions && Array.isArray(response.data.predictions)) {
        // predictions가 있으면 꽃 이름들을 추출하여 store에 저장
        const flowerNames = response.data.predictions.map((pred: any) => pred.class || pred.name).filter(Boolean)
        setFlowerNames(flowerNames)
        // 꽃말 정보 초기화
        setFlowerMeanings({})
        setSelectedFlowerName(flowerNames[0] || '')
        // 꽃말 정보 요청
        fetchFlowerMeanings(flowerNames)
      }
    } catch (err) {
      setError('JSON 예측 실패')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Gemini API로 꽃말 정보 요청
  async function fetchFlowerMeanings(flowerNames: string[]) {
    setMeaningsLoading(true)
    try {
      const results: { [name: string]: string } = {}
      // 여러 꽃에 대해 병렬 요청
      await Promise.all(
        flowerNames.map(async (name) => {
          try {
            // 실제 Gemini API 엔드포인트에 맞게 수정 필요
            const res = await axios.post('/api/gemini', { flower: name })
            results[name] = res.data.meaning || '꽃말 정보를 찾을 수 없습니다.'
          } catch {
            results[name] = '꽃말 정보를 불러오지 못했습니다.'
          }
        })
      )
      setFlowerMeanings(results)
    } finally {
      setMeaningsLoading(false)
    }
  }

  return (
    <div>
      <h1>API Test</h1>

      {/* 서버 상태 */}
      <div>
        <span>서버 상태: {serverStatus}</span>
        <button
          className='border-2'
          onClick={checkServerStatus}>
          새로고침
        </button>
      </div>

      {/* 파일 업로드 */}
      <div>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
        />

        {previewUrl && (
          <div>
            <h3>미리보기</h3>
            <Image
              src={previewUrl}
              alt='미리보기'
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          </div>
        )}
      </div>

      {/* API 요청 버튼 */}
      <div>
        <button
          className='border-2'
          onClick={getPredictionImage}
          disabled={!selectedFile || loading}>
          {loading ? '처리중...' : '이미지 예측'}
        </button>

        <button
          className='border-2'
          onClick={getPredictionJson}
          disabled={!selectedFile || loading}>
          {loading ? '처리중...' : 'JSON 예측'}
        </button>
      </div>

      {/* 에러 표시 */}
      {error && <div>{error}</div>}

      {/* 결과 표시 */}
      <div>
        {/* 이미지 결과 */}
        {resultImage && (
          <div>
            <h2>이미지 예측 결과</h2>
            <Image
              src={resultImage}
              alt='결과'
              width={300}
              height={300}
              style={{ objectFit: 'contain' }}
              unoptimized
            />
            {/* 꽃 선택 버튼 (꽃이 2개 이상일 때) */}
            {jsonResult && jsonResult.predictions && Array.isArray(jsonResult.predictions) && jsonResult.predictions.length > 1 && (
              <div style={{ marginTop: 16 }}>
                <div>꽃 선택:</div>
                {jsonResult.predictions.map((pred: any, idx: number) => {
                  const name = pred.class || pred.name || `꽃${idx + 1}`
                  return (
                    <button
                      key={name}
                      className={`border-2 m-1 px-2 py-1 ${selectedFlowerName === name ? 'bg-blue-200' : ''}`}
                      onClick={() => setSelectedFlowerName(name)}>
                      {name}
                    </button>
                  )
                })}
              </div>
            )}
            {/* 꽃말 정보 표시 */}
            {selectedFlowerName && (
              <div style={{ marginTop: 16 }}>
                <h3>꽃말</h3>
                {meaningsLoading ? <div>꽃말 불러오는 중...</div> : <div>{flowerMeanings[selectedFlowerName] || '꽃말 정보 없음'}</div>}
              </div>
            )}
          </div>
        )}

        {/* JSON 결과 */}
        {jsonResult && (
          <div>
            <h2>JSON 예측 결과</h2>
            <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
