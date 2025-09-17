'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import useAppStore from '../store/Appstate'

export default function ApiTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [jsonResult, setJsonResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<string>('확인 필요')

  const { setSelectedImage, setPredictionResults } = useAppStore()

  // 파일 선택 처리
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setSelectedImage(file)

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
      setPredictionResults(response.data)
    } catch (err) {
      setError('JSON 예측 실패')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>API Test</h1>

      {/* 서버 상태 */}
      <div>
        <span>서버 상태: {serverStatus}</span>
        <button onClick={checkServerStatus}>새로고침</button>
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
          onClick={getPredictionImage}
          disabled={!selectedFile || loading}>
          {loading ? '처리중...' : '이미지 예측'}
        </button>

        <button
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
