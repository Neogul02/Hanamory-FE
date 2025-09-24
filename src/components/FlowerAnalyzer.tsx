'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { predictFlower, getFlowerInfo, makeFlowerPrompt, FlowerInfo } from '@/lib/flower-api'

interface FlowerAnalyzerProps {
  onResult?: (result: { flowerNames: string[]; flowerInfo: FlowerInfo | null }) => void
}

export default function FlowerAnalyzer({ onResult }: FlowerAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [flowerNames, setFlowerNames] = useState<string[]>([])
  const [flowerInfo, setFlowerInfo] = useState<FlowerInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 선택 (드래그앤드롭과 파일 input 모두 처리)
  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setFlowerNames([])
    setFlowerInfo(null)
    setError(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // 드래그앤드롭 핸들러들
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        handleFileSelect(file)
      }
    }
  }

  const handleDropboxClick = () => {
    fileInputRef.current?.click()
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
    setFlowerInfo(null)

    try {
      // 1. 꽃 이름 예측
      const predictions = await predictFlower(selectedFile)
      const { flowerList, prompt } = makeFlowerPrompt(predictions)
      setFlowerNames(flowerList)

      // 2. 꽃말 요청
      const info = await getFlowerInfo(prompt)
      setFlowerInfo(info)

      // 부모 컴포넌트에 결과 전달
      onResult?.({ flowerNames: flowerList, flowerInfo: info })
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setFlowerNames([])
    setFlowerInfo(null)
    setError(null)
  }

  return (
    <div className='flex flex-col h-screen'>
      {/* 메인 컨텐츠 영역 (90%) */}
      <div className='flex-[9] overflow-y-auto p-4 space-y-6'>
        {/* 이미지 미리보기 카드 */}
        <div className='bg-white rounded-3xl p-6 shadow-lg border border-gray-100'>
          <div className='relative'>
            <Image
              src={previewUrl || '/image/flower_1.jpg'}
              alt='꽃 이미지'
              width={320}
              height={320}
              className='w-full max-w-80 mx-auto block rounded-2xl shadow-md object-cover aspect-square'
            />
            {previewUrl && (
              <button
                onClick={resetAnalysis}
                className='absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg'>
                ×
              </button>
            )}
          </div>
        </div>

        {/* 드래그앤드롭 업로드 영역 */}
        <div
          onClick={handleDropboxClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            bg-white rounded-3xl p-4 shadow-lg border-2 border-dashed cursor-pointer transition-all duration-200
            ${isDragOver ? 'border-blue-400 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          `}>
          <div className='flex flex-col items-center justify-center text-center py-4'>
            <div className='text-3xl mb-2'>📁</div>
            <p className={`text-sm font-medium transition-colors ${isDragOver ? 'text-blue-600' : 'text-gray-700'}`}>{isDragOver ? '파일을 놓아주세요' : '사진을 드래그하거나 클릭해주세요'}</p>
            <p className='text-xs text-gray-500 mt-1'>JPG, PNG 파일 지원</p>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileInputChange}
            className='hidden'
            aria-label='이미지 파일 선택'
          />
        </div>

        {/* 에러 메시지 */}
        {error && <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center'>{error}</div>}

        {/* 결과 섹션 */}
        {flowerNames.length > 0 && (
          <div className='bg-white rounded-3xl p-6 shadow-lg border border-gray-100'>
            <div className='text-center space-y-4'>
              <div className='text-4xl mb-4'>🌺</div>

              <div className='space-y-3'>
                <div>
                  <span className='text-gray-600 text-sm block mb-1'>꽃 이름</span>
                  <span className='text-2xl font-bold text-blue-600'>{flowerNames.join(', ')}</span>
                </div>

                {flowerInfo?.meaning && (
                  <div className='border-t border-gray-200 pt-4'>
                    <span className='text-gray-600 text-sm block mb-2'>꽃말</span>
                    <div className='text-lg font-medium text-gray-800 bg-blue-50 px-4 py-2 rounded-xl'>{flowerInfo.meaning}</div>
                  </div>
                )}

                {flowerInfo?.description && (
                  <div className='border-t border-gray-200 pt-4'>
                    <span className='text-gray-600 text-sm block mb-2'>설명</span>
                    <div className='text-gray-700 leading-relaxed text-left bg-gray-50 px-4 py-3 rounded-xl'>{flowerInfo.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 영역 (10%) */}
      <div className='flex-[1] bg-white border-t border-gray-200 p-4 flex items-center'>
        <button
          onClick={handlePredict}
          disabled={loading || !selectedFile}
          className='w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'>
          {loading ? (
            <span className='flex items-center justify-center space-x-2'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>분석 중...</span>
            </span>
          ) : (
            '🔍 꽃 이름 & 꽃말 분석'
          )}
        </button>
      </div>
    </div>
  )
}
