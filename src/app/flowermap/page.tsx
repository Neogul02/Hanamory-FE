'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

declare global {
  interface Window {
    kakao: any
  }
}

export default function FlowerMapPage() {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showInfoCard, setShowInfoCard] = useState(true)

  // 카카오 맵 스크립트 로드 대기 및 초기화
  useEffect(() => {
    // 카카오 맵 SDK가 로드될 때까지 대기
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initMap()
        })
      } else {
        setTimeout(checkKakaoMaps, 100)
      }
    }

    checkKakaoMaps()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 맵 초기화 및 현재 위치 가져오기
  const initMap = () => {
    if (!mapContainer.current) return

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCurrentLocation({ lat, lng })

          // 지도 생성
          const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3, // 지도 확대 레벨
          }

          const kakaoMap = new window.kakao.maps.Map(mapContainer.current, mapOption)
          setMap(kakaoMap)

          // 현재 위치 마커 표시
          const markerPosition = new window.kakao.maps.LatLng(lat, lng)
          new window.kakao.maps.Marker({
            position: markerPosition,
            map: kakaoMap,
          })

          // 주변 꽃집 검색
          searchFlowerShops(kakaoMap, lat, lng)
          setIsLoading(false)
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
          // 기본 위치 (서울 시청)
          const defaultLat = 37.5665
          const defaultLng = 126.978
          setCurrentLocation({ lat: defaultLat, lng: defaultLng })

          const mapOption = {
            center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
            level: 3,
          }

          const kakaoMap = new window.kakao.maps.Map(mapContainer.current, mapOption)
          setMap(kakaoMap)
          searchFlowerShops(kakaoMap, defaultLat, defaultLng)
          setIsLoading(false)
          setError('위치 정보를 가져올 수 없어 서울 시청으로 설정되었습니다.')
        }
      )
    } else {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      setIsLoading(false)
    }
  }

  // 주변 꽃집 검색
  const searchFlowerShops = (map: any, lat: number, lng: number) => {
    const ps = new window.kakao.maps.services.Places()

    // 꽃집 검색
    ps.keywordSearch(
      '꽃집',
      (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 검색된 장소들에 마커 표시
          data.forEach((place: any) => {
            const markerPosition = new window.kakao.maps.LatLng(place.y, place.x)

            // 꽃 이모지 마커 생성
            const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
            const imageSize = new window.kakao.maps.Size(36, 37)
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize)

            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map,
              image: markerImage,
            })

            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding:10px;min-width:200px;">
                  <div style="font-weight:bold;margin-bottom:5px;">${place.place_name}</div>
                  <div style="font-size:12px;color:#666;">${place.address_name}</div>
                  ${place.phone ? `<div style="font-size:12px;color:#666;margin-top:3px;">📞 ${place.phone}</div>` : ''}
                  <a href="${place.place_url}" target="_blank" style="font-size:11px;color:#4A90E2;margin-top:5px;display:inline-block;">상세보기</a>
                </div>
              `,
            })

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindow.open(map, marker)
            })
          })
        }
      },
      {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius: 3000, // 3km 반경 검색
      }
    )
  }

  return (
    <div className='h-screen flex flex-col'>
      {/* 헤더 */}
      <nav className='w-full bg-white py-4 shadow-sm z-10'>
        <div className='flex items-center justify-between px-6'>
          <button
            onClick={() => router.push('/result')}
            className='text-gray-600 hover:text-gray-800 cursor-pointer'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <div
            className='flex items-center cursor-pointer'
            onClick={() => router.push('/')}>
            <Image
              src='/image/mainLogo.png'
              alt='Hanamory Logo'
              width={100}
              height={40}
              className='rounded-xl'
            />
          </div>
          <div className='w-6' /> {/* 균형을 위한 빈 공간 */}
        </div>
      </nav>

      {/* 맵 컨테이너 */}
      <div className='flex-1 relative'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white z-10'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto'></div>
              <p className='mt-4 text-gray-600'>지도를 불러오는 중...</p>
            </div>
          </div>
        )}

        {error && <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-10 max-w-md'>{error}</div>}

        <div
          ref={mapContainer}
          className='w-full h-full'
        />

        {/* 현재 위치로 이동 버튼 */}
        {currentLocation && map && (
          <motion.button
            onClick={() => {
              const moveLatLon = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
              map.panTo(moveLatLon)
            }}
            className='absolute bottom-4 left-4 bg-white rounded-full p-4 shadow-lg z-10 cursor-pointer'>
            <svg
              className='w-6 h-6 text-blue-500'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                clipRule='evenodd'
              />
            </svg>
          </motion.button>
        )}

        {/* 정보 카드 - 하단 위치 */}
        {showInfoCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='absolute top-6 left-6 right-6 bg-white rounded-lg shadow-lg p-4 z-10'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h3 className='font-bold text-lg mb-2 flex items-center'>
                  <span className='text-2xl mr-2'>🌸</span>내 주변 꽃집
                </h3>
                <p className='text-sm text-gray-600'>마커를 클릭하면 꽃집 정보를 확인할 수 있습니다.</p>
              </div>
              <button
                onClick={() => setShowInfoCard(false)}
                className='ml-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
