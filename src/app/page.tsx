'use client'

import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import UploadBox from '@/components/UploadBox'
import Button from '@/components/Button'
import { useFlowerUploadStore } from '@/store/useFlowerUploadStore'
import { makeFlowerPrompt } from '@/utils/flowerPrompt'

export default function Page() {
  const router = useRouter()
  const { file, isAnalyzing, setIsAnalyzing, setError, setFlowerNames, setKoreanName, setFlowerLang, setFlowerDesc, setPredictions, setAnnotatedImageUrl } = useFlowerUploadStore()

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError('')
    setFlowerNames([])
    setKoreanName(null)
    setFlowerLang(null)
    setFlowerDesc(null)
    setPredictions([])
    setAnnotatedImageUrl(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      // 1. predict-json과 predict를 병렬로 요청 (타임아웃 30초)
      const timeout = 30000 // 30초
      const [jsonRes, imageRes] = await Promise.all([axios.post('/api/predict-json', formData, { timeout }), axios.post('/api/predict', formData, { timeout })])

      const data = jsonRes.data

      if (!data.predictions || !Array.isArray(data.predictions)) {
        throw new Error('예측 결과가 올바르지 않습니다.')
      }

      const { flowerList } = makeFlowerPrompt(data.predictions)
      setFlowerNames(flowerList)

      // 예측 결과를 store에 저장 (다중 꽃 선택 기능을 위해)
      setPredictions(data.predictions || [])

      // 2. 꽃 인식 표시된 이미지 URL 저장 (결과 페이지에서 표시용)
      if (imageRes.data.imageUrl) {
        setAnnotatedImageUrl(imageRes.data.imageUrl)
      }

      // 3. 즉시 결과 페이지로 이동 (Gemini는 result 페이지에서 처리)
      router.push('/result')
    } catch (error: any) {
      console.error('분석 중 오류 발생:', error)
      setError(error?.response?.data?.error || error.message || '분석 중 오류가 발생했습니다.')
      setIsAnalyzing(false)
    }
    // isAnalyzing은 result 페이지로 이동 시 자동으로 false가 됨
  }

  return (
    <div className='h-screen flex flex-col '>
      {/* 헤더 */}
      <motion.nav
        className='w-full ext-center bg-white py-1'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}>
        <div
          className='flex items-center justify-center cursor-pointer'
          onClick={() => router.push('/')}>
          <Image
            src='/image/mainLogo.png'
            alt='Hanamory Logo'
            width={100}
            height={40}
            className='rounded-xl'
          />
        </div>
      </motion.nav>

      {/* 메인 컨텐츠 영역 - 9:1 비율로 분할 */}
      <div className='flex-1 flex flex-col'>
        {/* 상단 컨텐츠 영역 (9) */}
        <div className='flex-[9] flex flex-col items-center justify-center p-2'>
          {/* 업로드 박스 */}
          <motion.div
            className='w-full max-w-md mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}>
            <UploadBox />
          </motion.div>
        </div>

        {/* 하단 버튼 영역 (1) - 고정 */}
        <div className='flex-[1] flex items-center justify-center p-6'>
          <motion.div
            className='w-full max-w-md'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}>
            <Button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              loading={isAnalyzing}
              className='text-lg py-4'>
              꽃 분석하기
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
