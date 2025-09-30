interface FlowerResultProps {
  flowerNames: string[]
  koreanName: string | null
  flowerLang: string | null
  flowerDesc: string | null
}

export default function FlowerResult({ flowerNames, koreanName, flowerLang, flowerDesc }: FlowerResultProps) {
  // 중복 제거된 꽃 이름들 (대소문자 구분 없이 중복 제거)
  const uniqueFlowerNames = [...new Set(flowerNames.map((name) => name.toLowerCase()))].map((lowerName) => flowerNames.find((name) => name.toLowerCase() === lowerName)).filter(Boolean) as string[]

  return uniqueFlowerNames.length === 0 && !koreanName && !flowerLang && !flowerDesc ? null : (
    <div className='w-full max-w-md mx-auto'>
      <div className='rounded-2xl'>
        {/* 꽃 이모지 */}
        <div className='text-center mb-4'>
          <div className='text-2xl mb-2'>🌸</div>
          <h3 className='text-lg font-bold text-gray-800'>꽃 이름 & 꽃말 분석</h3>
        </div>

        {/* 꽃 이름 */}
        <div className='mb-6'>
          <div className='flex items-center mb-2'>
            <span className='text-lg font-medium text-gray-600'>꽃 이름:</span>
          </div>
          <div className='bg-white rounded-xl p-2'>
            <div className='space-y-1'>
              {koreanName && uniqueFlowerNames.length > 0 && (
                <div className='text-xl font-bold text-pink-600'>
                  {koreanName} - {uniqueFlowerNames.join(', ')}
                </div>
              )}
              {koreanName && uniqueFlowerNames.length === 0 && <div className='text-xl font-bold text-pink-600'>{koreanName}</div>}
              {!koreanName && uniqueFlowerNames.length > 0 && <div className='text-xl font-bold text-pink-600'>{uniqueFlowerNames.join(', ')}</div>}
            </div>
          </div>
        </div>

        {/* 꽃말 */}

        <div className='mb-6'>
          <div className='flex items-center mb-2'>
            <span className='text-lg font-medium text-gray-600'>꽃말:</span>
          </div>
          <div className='bg-white rounded-xl p-2 '>
            <span className='text-xl font-semibold text-purple-600'>{flowerLang}</span>
          </div>
        </div>

        {/* 설명 */}
        <div>
          <div className='flex items-center mb-2'>
            <span className='text-lg font-medium text-gray-600'>설명:</span>
          </div>
          <div className='bg-white rounded-xl p-2'>
            <p className='text-gray-700 leading-relaxed text-sm'>{flowerDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
