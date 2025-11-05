'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageFile?: File | null
  koreanName: string | null
  flowerLang: string | null
}

export default function ShareModal({ isOpen, onClose, imageUrl, imageFile, koreanName, flowerLang }: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 커스터마이징 옵션
  const [backgroundColor, setBackgroundColor] = useState<string>('dark') // 'none', 'dark', 'light'
  const [textColor, setTextColor] = useState<string>('#ffffff') // RGB 색상 값
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.4) // 0.2, 0.4, 0.6

  // 배경색 옵션 (3가지로 단순화)
  const backgroundOptions = [
    { id: 'none', label: '없음', color: 'transparent' },
    { id: 'dark', label: '어둡게', color: 'rgba(0, 0, 0, 0.4)' },
    { id: 'light', label: '밝게', color: 'rgba(255, 255, 255, 0.3)' },
  ]

  // 빠른 색상 선택 프리셋
  const colorPresets = [
    { label: '흰색', color: '#ffffff' },
    { label: '검정', color: '#000000' },
    { label: '분홍', color: '#ec4899' },
    { label: '초록', color: '#22c55e' },
    { label: '파랑', color: '#3b82f6' },
    { label: '노랑', color: '#eab308' },
  ]

  const generateStoryImage = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current
      if (!canvas) {
        reject('Canvas not found')
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject('Canvas context not found')
        return
      }

      // 인스타그램 스토리 크기 (9:16 비율)
      canvas.width = 1080
      canvas.height = 1920

      console.log('Canvas 초기화 완료:', canvas.width, 'x', canvas.height)

      const renderText = () => {
        // 배경 오버레이 적용
        if (backgroundColor === 'dark') {
          ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        } else if (backgroundColor === 'light') {
          ctx.fillStyle = `rgba(255, 255, 255, ${overlayOpacity})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        // 'none'일 경우 배경 오버레이 없음

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // 꽃 이름 텍스트
        if (koreanName) {
          ctx.font = 'bold 100px sans-serif'
          ctx.textAlign = 'center'

          // 텍스트 그림자 (가독성을 위해)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
          ctx.fillText(koreanName, centerX + 3, centerY - 50 + 3)

          // 메인 텍스트
          ctx.fillStyle = textColor
          ctx.fillText(koreanName, centerX, centerY - 50)
        }

        // 꽃말 텍스트
        if (flowerLang) {
          ctx.font = '60px sans-serif'
          ctx.textAlign = 'center'

          // 텍스트 길이에 따라 줄바꿈
          const maxWidth = 900
          const words = flowerLang.split(' ')
          let line = ''
          let y = centerY + 100
          const lineHeight = 80

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = ctx.measureText(testLine)
            const testWidth = metrics.width

            if (testWidth > maxWidth && n > 0) {
              // 텍스트 그림자
              ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
              ctx.fillText(line, centerX + 2, y + 2)

              // 메인 텍스트
              ctx.fillStyle = textColor
              ctx.fillText(line, centerX, y)

              line = words[n] + ' '
              y += lineHeight
            } else {
              line = testLine
            }
          }

          // 마지막 줄
          if (line.trim()) {
            // 텍스트 그림자
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
            ctx.fillText(line, centerX + 2, y + 2)

            // 메인 텍스트
            ctx.fillStyle = textColor
            ctx.fillText(line, centerX, y)
          }
        }

        // 하단에 로고/워터마크
        ctx.font = '50px sans-serif'
        ctx.textAlign = 'center'

        // 텍스트 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillText('🌸 Hanamory', centerX + 2, canvas.height - 80 + 2)

        // 메인 텍스트
        ctx.fillStyle = textColor
        ctx.fillText('🌸 Hanamory', centerX, canvas.height - 80)

        // 고품질 이미지로 변환 (JPEG 품질 0.95)
        resolve(canvas.toDataURL('image/jpeg', 0.95))
      }

      const drawImageAndText = (img: HTMLImageElement) => {
        console.log('Canvas 크기:', canvas.width, 'x', canvas.height)
        console.log('이미지 크기:', img.width, 'x', img.height)

        // 먼저 흰색 배경 그리기 (투명도 문제 방지)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 이미지를 전체 캔버스에 맞춰 그리기
        const imgAspect = img.width / img.height
        const canvasAspect = canvas.width / canvas.height

        let drawWidth, drawHeight, offsetX, offsetY

        if (imgAspect > canvasAspect) {
          // 이미지가 더 넓음 - 높이에 맞춤
          drawHeight = canvas.height
          drawWidth = drawHeight * imgAspect
          offsetX = (canvas.width - drawWidth) / 2
          offsetY = 0
        } else {
          // 이미지가 더 높음 - 너비에 맞춤
          drawWidth = canvas.width
          drawHeight = drawWidth / imgAspect
          offsetX = 0
          offsetY = (canvas.height - drawHeight) / 2
        }

        console.log('그리기 영역:', { drawWidth, drawHeight, offsetX, offsetY })

        // 배경 이미지 그리기
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
        console.log('이미지 그리기 완료')

        // 텍스트 렌더링
        renderText()
      }

      const drawFallback = () => {
        // 이미지 로딩 실패 시 기본 배경으로 처리
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#fdf2f8')
        gradient.addColorStop(0.5, '#fce7f3')
        gradient.addColorStop(1, '#f3e8ff')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 텍스트 렌더링 계속 진행
        renderText()
      }

      // 이미지 로딩 - File이 있으면 우선 사용, 없으면 fetch로 URL을 Blob으로 변환
      if (imageFile) {
        // 파일이 있는 경우
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = document.createElement('img') as HTMLImageElement
          img.onload = () => {
            console.log('이미지 로딩 성공 (FileReader):', img.width, 'x', img.height)
            drawImageAndText(img)
          }
          img.onerror = (error) => {
            console.error('이미지 로딩 실패 (FileReader):', error)
            drawFallback()
          }
          img.src = e.target?.result as string
        }
        reader.onerror = (error) => {
          console.error('파일 읽기 실패:', error)
          drawFallback()
        }
        reader.readAsDataURL(imageFile)
      } else {
        // URL인 경우 fetch를 통해 Blob으로 변환
        try {
          fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                const img = document.createElement('img') as HTMLImageElement
                img.onload = () => {
                  console.log('이미지 로딩 성공 (URL->Blob):', img.width, 'x', img.height)
                  drawImageAndText(img)
                }
                img.onerror = (error) => {
                  console.error('이미지 로딩 실패 (URL->Blob):', error)
                  drawFallback()
                }
                img.src = e.target?.result as string
              }
              reader.onerror = (error) => {
                console.error('Blob 읽기 실패:', error)
                drawFallback()
              }
              reader.readAsDataURL(blob)
            })
            .catch((error) => {
              console.error('URL fetch 실패:', error)
              drawFallback()
            })
        } catch (error) {
          console.error('URL 처리 중 오류:', error)
          drawFallback()
        }
      }
    })
  }

  const handleShareToInstagram = async () => {
    setIsGenerating(true)

    try {
      const storyImageUrl = await generateStoryImage()

      // 모바일에서 Instagram 앱으로 공유
      if (navigator.share) {
        // 데이터 URL을 Blob으로 변환
        const response = await fetch(storyImageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'hanamory-flower.jpg', { type: 'image/jpeg' })

        await navigator.share({
          files: [file],
          title: koreanName || '꽃말',
          text: flowerLang || '',
        })
      } else {
        // 데스크톱에서는 다운로드
        const link = document.createElement('a')
        link.download = 'hanamory-flower.jpg'
        link.href = storyImageUrl
        link.click()
      }
    } catch (error) {
      console.error('공유 중 오류:', error)
      alert('공유 중 오류가 발생했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          {/* 배경 오버레이 */}
          <motion.div
            className='absolute inset-0 bg-[rgba(0,0,0,0.8)] bg-opacity-75'
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className='relative bg-white rounded-2xl p-6 m-4 max-w-md w-full max-h-[90vh] overflow-auto no-scrollbar'
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}>
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className='absolute cursor-pointer top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-600'>
              ✕
            </button>

            {/* 제목 */}
            <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'></h2>

            {/* 미리보기 */}
            <motion.div
              className='mb-6'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <div className='aspect-[9/16] relative rounded-2xl overflow-hidden'>
                {/* 배경 이미지 */}
                <Image
                  src={imageUrl}
                  alt='꽃 이미지'
                  fill
                  className='object-cover'
                />

                {/* 배경 오버레이 (커스터마이징 적용) */}
                {backgroundColor !== 'none' && (
                  <div
                    className='absolute inset-0'
                    style={{
                      background: backgroundColor === 'dark' ? `rgba(0, 0, 0, ${overlayOpacity})` : `rgba(255, 255, 255, ${overlayOpacity})`,
                    }}
                  />
                )}

                {/* 텍스트 오버레이 */}
                <div
                  className='absolute inset-0 flex flex-col items-center justify-center p-6'
                  style={{
                    color: textColor,
                    fontFamily: 'sans-serif',
                  }}>
                  {/* 꽃 이름 */}
                  {koreanName && (
                    <h3
                      className='text-3xl font-bold text-center mb-4'
                      style={{
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                      }}>
                      {koreanName}
                    </h3>
                  )}

                  {/* 꽃말 */}
                  {flowerLang && (
                    <p
                      className='text-lg text-center leading-relaxed px-4'
                      style={{
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                      }}>
                      {flowerLang}
                    </p>
                  )}
                </div>

                {/* 워터마크 */}
                <div
                  className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm'
                  style={{
                    color: textColor,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                  }}>
                  Hanamory
                </div>
              </div>
            </motion.div>

            {/* 커스터마이징 옵션 */}
            <motion.div
              className='mb-6 space-y-4'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}>
              {/* 배경 스타일 */}
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-2'>배경 스타일</p>
                <div className='flex gap-2'>
                  {backgroundOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setBackgroundColor(option.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${backgroundColor === option.id ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 투명도 조절 (배경이 있을 때만) */}
              {backgroundColor !== 'none' && (
                <div>
                  <p className='text-sm font-semibold text-gray-700 mb-2'>배경 투명도</p>
                  <div className='flex gap-2'>
                    {[0.2, 0.4, 0.6].map((opacity) => (
                      <button
                        key={opacity}
                        onClick={() => setOverlayOpacity(opacity)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${overlayOpacity === opacity ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {opacity === 0.2 ? '밝게' : opacity === 0.4 ? '보통' : '어둡게'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 텍스트 색상 */}
              <div>
                <p className='text-sm font-semibold text-gray-700 mb-2'>텍스트 색상</p>
                {/* 컬러피커 */}
                <div className='flex items-center gap-3 mb-2'>
                  <input
                    type='color'
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className='w-16 h-10 rounded-lg border-2 border-gray-300 cursor-pointer'
                  />
                  <span className='text-sm text-gray-600 font-mono'>{textColor.toUpperCase()}</span>
                </div>
                {/* 빠른 선택 프리셋 */}
                <div className='flex gap-2 flex-wrap'>
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setTextColor(preset.color)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${textColor === preset.color ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      style={{
                        borderLeft: `4px solid ${preset.color}`,
                      }}>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 버튼들 */}
            <motion.div
              className='space-y-3'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}>
              <Button
                onClick={handleShareToInstagram}
                disabled={isGenerating}
                loading={isGenerating}
                className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3'>
                {isGenerating ? '이미지 생성 중...' : '인스타그램으로 공유'}
              </Button>

              <Button
                onClick={onClose}
                className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3'>
                취소
              </Button>
            </motion.div>

            {/* 숨겨진 캔버스 */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
