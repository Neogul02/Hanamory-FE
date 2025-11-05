'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import ShareModal from '../../components/ShareModal'
import { useFlowerUploadStore } from '@/store/useFlowerUploadStore'
import { fetchFlowerInfoFromGemini } from '@/utils/geminiApi'

export default function ResultPage() {
  const router = useRouter()
  const { file, imageUrl, annotatedImageUrl, flowerNames, koreanName, flowerLang, flowerDesc, predictions, flowerInfos, selectedFlowerName, setSelectedFlowerName, setFlowerInfos, resetAnalysis } = useFlowerUploadStore()
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLoadingFlowerInfo, setIsLoadingFlowerInfo] = useState(false)

  // 꽃이 여러 개일 때 현재 선택된 꽃 정보
  // 중복 제거: 같은 꽃이 여러 개 인식된 경우 하나로 통일
  const uniqueFlowers = predictions.reduce((acc: typeof predictions, current) => {
    const exists = acc.find((flower) => flower.class === current.class)
    if (!exists) {
      acc.push(current)
    }
    return acc
  }, [])

  const isMultipleUniqueFlowers = uniqueFlowers.length > 1
  const currentFlowerName = isMultipleUniqueFlowers && selectedFlowerName ? selectedFlowerName : flowerNames[0] || ''
  const currentFlowerInfo = flowerInfos[currentFlowerName]

  // 디버깅용 로그 (프로덕션에서는 제거 권장)
  if (process.env.NODE_ENV === 'development') {
    console.log('Result Page Debug:', {
      predictions,
      uniqueFlowers,
      isMultipleUniqueFlowers,
      selectedFlowerName,
      flowerNames,
    })
  }

  // 표시할 정보 결정 (다중 꽃일 때는 선택된 꽃 정보, 단일 꽃일 때는 기존 정보)
  const displayKoreanName = isMultipleUniqueFlowers ? currentFlowerInfo?.koreanName : koreanName
  const displayFlowerLang = isMultipleUniqueFlowers ? currentFlowerInfo?.flowerLang : flowerLang
  const displayFlowerDesc = isMultipleUniqueFlowers ? currentFlowerInfo?.flowerDesc : flowerDesc

  // Gemini API로 꽃 정보 가져오기 (공통 함수 사용)
  const fetchFlowerInfo = useCallback(
    async (flowerName: string) => {
      if (flowerInfos[flowerName]) return // 이미 로드된 경우 스킵

      setIsLoadingFlowerInfo(true)
      try {
        const { koreanName: koreanFlowerName, flowerLang: lang, flowerDesc: desc } = await fetchFlowerInfoFromGemini(flowerName)

        // store에 꽃 정보 저장
        const newFlowerInfos = {
          ...flowerInfos,
          [flowerName]: {
            name: flowerName,
            koreanName: koreanFlowerName,
            flowerLang: lang,
            flowerDesc: desc,
          },
        }
        setFlowerInfos(newFlowerInfos)
      } catch (error) {
        console.error('꽃 정보 로드 실패:', error)
        // 에러 시에도 기본 정보 저장
        const newFlowerInfos = {
          ...flowerInfos,
          [flowerName]: {
            name: flowerName,
            koreanName: flowerName,
            flowerLang: '꽃말 정보를 불러오지 못했습니다.',
            flowerDesc: '설명 정보를 불러오지 못했습니다.',
          },
        }
        setFlowerInfos(newFlowerInfos)
      } finally {
        setIsLoadingFlowerInfo(false)
      }
    },
    [flowerInfos, setFlowerInfos]
  )

  // 꽃 선택 핸들러
  const handleFlowerSelect = async (flowerName: string) => {
    setSelectedFlowerName(flowerName)
    await fetchFlowerInfo(flowerName)
  }

  useEffect(() => {
    // 업로드된 파일이 없거나 분석 결과가 없으면 메인 페이지로 리다이렉트
    if (!file || !flowerNames.length) {
      router.push('/')
      return
    }

    // 페이지 로드 시 단일 꽃에 대한 Gemini 정보 자동 로드
    if (!isMultipleUniqueFlowers && flowerNames.length > 0 && !koreanName && !isLoadingFlowerInfo) {
      const firstFlowerName = flowerNames[0]
      setIsLoadingFlowerInfo(true)

      // Gemini API로 꽃 정보 가져오기 (공통 함수 재사용)
      const loadInitialFlowerInfo = async () => {
        try {
          const { koreanName: koreanFlowerName, flowerLang: lang, flowerDesc: desc } = await fetchFlowerInfoFromGemini(firstFlowerName)

          // store에 단일 꽃 정보 저장 (기존 방식)
          useFlowerUploadStore.setState({
            koreanName: koreanFlowerName,
            flowerLang: lang,
            flowerDesc: desc,
          })
        } catch (error) {
          console.error('꽃 정보 로드 실패:', error)
          // 에러 시에도 기본 정보 표시
          useFlowerUploadStore.setState({
            koreanName: firstFlowerName,
            flowerLang: '꽃말 정보를 불러오지 못했습니다.',
            flowerDesc: '설명 정보를 불러오지 못했습니다.',
          })
        } finally {
          setIsLoadingFlowerInfo(false)
        }
      }

      loadInitialFlowerInfo()
    }
  }, [file, flowerNames, koreanName, isMultipleUniqueFlowers, router, isLoadingFlowerInfo])

  useEffect(() => {
    // 다중 꽃이고 선택된 꽃이 없으면 첫 번째 꽃을 선택
    if (isMultipleUniqueFlowers && !selectedFlowerName && uniqueFlowers.length > 0) {
      const firstFlowerName = uniqueFlowers[0].class
      setSelectedFlowerName(firstFlowerName)
      // 첫 번째 꽃 정보 자동 로드
      fetchFlowerInfo(firstFlowerName)
    }
  }, [isMultipleUniqueFlowers, selectedFlowerName, uniqueFlowers, setSelectedFlowerName, fetchFlowerInfo])

  const handleShare = () => {
    setIsShareModalOpen(true)
  }

  const handleNewAnalysis = () => {
    resetAnalysis()
    router.push('/')
  }

  // imageUrl이 있으면 사용하고, 없으면 file로부터 생성 (공유용 원본 이미지)
  const originalImageUrl = imageUrl || (file ? URL.createObjectURL(file) : null)

  // 결과 페이지에 표시할 이미지: annotatedImageUrl이 있으면 사용 (꽃 인식 표시), 없으면 원본 사용
  const displayImageUrl = annotatedImageUrl || originalImageUrl

  // 메모리 누수 방지: 컴포넌트 언마운트 시 생성된 Object URL 정리
  useEffect(() => {
    return () => {
      if (!imageUrl && file && originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl)
      }
    }
  }, [imageUrl, file, originalImageUrl])

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
              {displayKoreanName && <h1 className='text-3xl font-bold text-gray-800 mb-2'>{displayKoreanName}</h1>}
              {flowerNames.length > 0 && (
                <div className='text-lg text-gray-600'>
                  {isMultipleUniqueFlowers
                    ? currentFlowerName
                    : [...new Set(flowerNames.map((name) => name.toLowerCase()))]
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

            {/* 꽃 선택 버튼 (서로 다른 꽃이 2개 이상일 때만) */}
            {isMultipleUniqueFlowers && (
              <div className='mb-4'>
                <p className='text-sm text-gray-600 mb-2 text-center'>꽃을 선택하세요:</p>
                <div className='flex flex-wrap gap-2 justify-center'>
                  {uniqueFlowers.map((pred, index) => {
                    const flowerName = pred.class
                    const isSelected = selectedFlowerName === flowerName
                    return (
                      <button
                        key={`${flowerName}-${index}`}
                        onClick={() => handleFlowerSelect(flowerName)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {flowerName}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* 꽃말 */}
          {(displayFlowerLang || isLoadingFlowerInfo) && (
            <motion.div
              className='bg-white rounded-2xl shadow-lg p-6 mb-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                <span className='text-2xl mr-2'>🌸</span>
                꽃말
              </h2>
              {isLoadingFlowerInfo ? (
                <div className='flex items-center justify-center py-4'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-2'></div>
                  <span className='text-gray-600'>꽃말 정보를 불러오는 중...</span>
                </div>
              ) : (
                <p className='text-lg text-gray-700 leading-relaxed'>{displayFlowerLang}</p>
              )}
            </motion.div>
          )}

          {/* 설명 */}
          {(displayFlowerDesc || isLoadingFlowerInfo) && (
            <motion.div
              className='bg-white rounded-2xl shadow-lg p-6 mb-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                <span className='text-2xl mr-2'>📖</span>
                설명
              </h2>
              {isLoadingFlowerInfo ? (
                <div className='flex items-center justify-center py-4'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-2'></div>
                  <span className='text-gray-600'>설명 정보를 불러오는 중...</span>
                </div>
              ) : (
                <p className='text-gray-700 leading-relaxed'>{displayFlowerDesc}</p>
              )}
            </motion.div>
          )}

          {/* 버튼들 */}
          <motion.div
            className='space-y-3'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}>
            {/* 인스타그램 공유 & 꽃집 찾기 - 가로 배치 */}
            <div className='flex gap-3'>
              <Button
                onClick={handleShare}
                className='flex-1 text-lg py-4 !bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 !text-white'>
                인스타그램 공유하기
              </Button>
              <Button
                onClick={() => router.push('/flowermap')}
                className='flex-1 text-lg py-4 !bg-gradient-to-r !from-amber-400 !to-yellow-500 hover:!from-amber-500 hover:!to-yellow-600 !text-white'>
                내 주변 꽃집 찾기
              </Button>
            </div>

            <Button
              onClick={handleNewAnalysis}
              className='w-full text-lg py-4'>
              새로운 꽃 분석하기
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 공유 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        imageUrl={originalImageUrl!}
        imageFile={file}
        koreanName={displayKoreanName || currentFlowerName}
        flowerLang={displayFlowerLang || ''}
      />
    </div>
  )
}
