'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import ShareModal from '../../components/ShareModal'
import { useFlowerUploadStore } from '@/store/useFlowerUploadStore'

export default function ResultPage() {
  const router = useRouter()
  const { file, imageUrl, flowerNames, koreanName, flowerLang, flowerDesc, resetAnalysis } = useFlowerUploadStore()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    // 업로드된 파일이 없거나 분석 결과가 없으면 메인 페이지로 리다이렉트
    if (!file || (!flowerNames.length && !koreanName)) {
      router.push('/')
      return
    }
  }, [file, flowerNames, koreanName, router])

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const handleNewAnalysis = () => {
    resetAnalysis()
    router.push('/')
  }

  // imageUrl이 있으면 사용하고, 없으면 file로부터 생성
  const displayImageUrl = imageUrl || (file ? URL.createObjectURL(file) : null)

  if (!displayImageUrl || (!flowerNames.length && !koreanName)) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col no-scrollbar'>
      {/* 헤더 */}
      <nav className='w-full text-center bg-white py-4'>
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
      </nav>

      {/* 메인 컨텐츠 */}
      <div className='flex-1 overflow-auto no-scrollbar p-6'>
        <div className='max-w-2xl mx-auto'>
          {/* 꽃 이미지 */}
          <motion.div
            className='bg-white rounded-2xl shadow-lg p-6 mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <div className='aspect-square relative mb-4 rounded-xl overflow-hidden'>
              <Image
                src={displayImageUrl}
                alt='분석된 꽃 이미지'
                fill
                className='object-cover'
              />
            </div>

            {/* 꽃 이름 */}
            <div className='text-center mb-4'>
              {koreanName && <h1 className='text-3xl font-bold text-gray-800 mb-2'>{koreanName}</h1>}
              {flowerNames.length > 0 && (
                <div className='text-lg text-gray-600'>
                  {[...new Set(flowerNames.map((name) => name.toLowerCase()))]
                    .map((lowerName) => flowerNames.find((name) => name.toLowerCase() === lowerName))
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((name, index, uniqueNames) => (
                      <span key={index}>
                        {name}
                        {index < uniqueNames.length - 1 && ', '}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* 꽃말 */}
          {flowerLang && (
            <motion.div
              className='bg-white rounded-2xl shadow-lg p-6 mb-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                <span className='text-2xl mr-2'>🌸</span>
                꽃말
              </h2>
              <p className='text-lg text-gray-700 leading-relaxed'>{flowerLang}</p>
            </motion.div>
          )}

          {/* 설명 */}
          {flowerDesc && (
            <motion.div
              className='bg-white rounded-2xl shadow-lg p-6 mb-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                <span className='text-2xl mr-2'>📖</span>
                설명
              </h2>
              <p className='text-gray-700 leading-relaxed'>{flowerDesc}</p>
            </motion.div>
          )}

          {/* 버튼들 */}
          <motion.div
            className='space-y-3'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}>
            <Button
              onClick={handleShare}
              className='w-full text-lg py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'>
              인스타그램 공유하기
            </Button>
            <Button
              onClick={handleNewAnalysis}
              className='w-full text-lg py-4 bg-green-500 hover:bg-green-600'>
              새로운 꽃 분석하기
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 공유 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        imageUrl={displayImageUrl!}
        imageFile={file}
        koreanName={koreanName}
        flowerLang={flowerLang}
      />
    </div>
  )
}
