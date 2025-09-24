import { useState, useRef } from 'react'

interface DropboxProps {
  onFileSelect: (file: File) => void
  className?: string
}

export default function Dropbox({ onFileSelect, className = '' }: DropboxProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        onFileSelect(file)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative cursor-pointer transition-all duration-200
        ${isDragOver ? 'border-blue-400 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        ${className}
      `}>
      <div className='flex flex-col items-center justify-center h-full text-center p-6'>
        <div className='space-y-2'>
          <p className={`text-lg font-medium transition-colors ${isDragOver ? 'text-blue-600' : 'text-gray-700'}`}>{isDragOver ? '파일을 놓아주세요' : '사진을 드래그하거나 클릭해주세요'}</p>
          <p className='text-sm text-gray-500'>JPG, PNG 파일만 지원됩니다</p>
        </div>
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
  )
}
