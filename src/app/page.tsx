import Image from 'next/image'
import FlowerAnalyzer from '@/components/FlowerAnalyzer'

export default function Page() {
  return (
    <div className='h-screen flex flex-col'>
      {/* 헤더 */}
      <nav className='w-full border-b border-gray-200 text-center bg-white shadow-sm py-2'>
        <div className='flex items-center justify-center'>
          <Image
            src='/image/mainLogo.png'
            alt='Hanamory Logo'
            width={100}
            height={40}
            className='rounded-xl'
          />
        </div>
      </nav>

      {/* 메인 컨텐츠 - 나머지 공간 모두 사용 */}
      <div className='flex-1 overflow-hidden'>
        <FlowerAnalyzer />
      </div>
    </div>
  )
}
