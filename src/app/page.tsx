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
  const { file, isAnalyzing, setIsAnalyzing, setError, setFlowerNames, setKoreanName, setFlowerLang, setFlowerDesc } = useFlowerUploadStore()

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError('')
    setFlowerNames([])
    setKoreanName(null)
    setFlowerLang(null)
    setFlowerDesc(null)

    try {
      // 1. 꽃 이름 예측 - 자체 AI 이미지 인식 모델
      const formData = new FormData()
      formData.append('image', file)
      const res = await axios.post('/api/predict-json', formData)
      const data = res.data

      if (!data.predictions || !Array.isArray(data.predictions)) {
        throw new Error('예측 결과가 올바르지 않습니다.')
      }

      const { flowerList, prompt } = makeFlowerPrompt(data.predictions)
      setFlowerNames(flowerList)

      // 2. 꽃말 요청 (API Route-Gemini로 요청)
      const APIRequest = await axios.post('/api/gemini', { prompt })

      let koreanFlowerName = null
      let lang = null
      let desc = null

      try {
        let resultStr = APIRequest.data.result
        resultStr = resultStr.replace(/```json|```/g, '').trim()
        const json = JSON.parse(resultStr)
        const flowerObj = json.꽃 || Object.values(json)[0]
        koreanFlowerName = flowerObj.한국어이름 || flowerObj.이름 || ''
        lang = flowerObj.꽃말 || ''
        desc = flowerObj.설명 || ''
      } catch {
        console.log('JSON 파싱 실패, 전체 텍스트 사용')
        lang = APIRequest.data.result
      }

      setKoreanName(koreanFlowerName)
      setFlowerLang(lang)
      setFlowerDesc(desc)

      // 분석 완료 후 결과 페이지로 이동
      router.push('/result')
    } catch (error: any) {
      console.error('분석 중 오류 발생:', error)
      setError(error?.response?.data?.error || error.message || '분석 중 오류가 발생했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
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
