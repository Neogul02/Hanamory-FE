'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useFlowerUploadStore } from '../store/useFlowerUploadStore'
import { validateImageFile } from '../utils/format'
import { UploadIcon } from '../assets/icons'

interface UploadBoxProps {
  maxSizeMb?: number
}

export default function UploadBox({ maxSizeMb = 20 }: UploadBoxProps) {
  const { file, error, isAnalyzing, setFile, setImageUrl, setError } = useFlowerUploadStore()
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileValidation = (selectedFile: File) => {
    const validationError = validateImageFile(selectedFile, maxSizeMb)
    if (validationError) {
      setError(validationError)
      return false
    }
    setFile(selectedFile)
    // 이미지 URL 생성 및 저장
    const url = URL.createObjectURL(selectedFile)
    setImageUrl(url)
    return true
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      handleFileValidation(selectedFile)
    }
  }

  const handleClick = () => {
    if (isAnalyzing) return
    fileInputRef.current?.click()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isAnalyzing) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      fileInputRef.current?.click()
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    if (isAnalyzing) return
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    if (isAnalyzing) return

    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter((f) => f.type.startsWith('image/') || f.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/))

    if (imageFiles.length === 0) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    handleFileValidation(imageFiles[0])
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    if (isAnalyzing) return

    const items = Array.from(event.clipboardData.items)
    const imageItem = items.find((item) => item.type.startsWith('image/'))

    if (imageItem) {
      const file = imageItem.getAsFile()
      if (file) {
        handleFileValidation(file)
      }
    }
  }

  const getDropzoneClasses = () => {
    let classes = 'w-full h-100 flex flex-col justify-center items-center border-2 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 '

    if (isAnalyzing) {
      classes += ' cursor-not-allowed opacity-75 border-2 border-yellow-500'
    } else if (isDragOver) {
      classes += ' ring-2 border-2 bg-yellow-50 bg-yellow-50 border-yellow-500 ring-yellow-600/20'
    } else if (error) {
      classes += ' border-red-300 hover:bg-red-50'
    } else {
      classes += ' border-gray-300 hover:bg-gray-50'
    }

    return classes
  }

  return (
    <div className='flex relative justify-center items-center'>
      <div
        className={getDropzoneClasses()}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        role='button'
        tabIndex={isAnalyzing ? -1 : 0}
        aria-label='꽃 사진 업로드'
        aria-describedby='upload-help'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
          disabled={isAnalyzing}
          aria-label='이미지 파일 선택'
        />

        {file ? (
          <div className='w-full text-center p-6'>
            <div className='relative w-full h-90 rounded-xl overflow-hidden'>
              <Image
                src={URL.createObjectURL(file)}
                alt='선택된 꽃 이미지'
                fill
                className='object-cover'
              />
            </div>
          </div>
        ) : (
          <div className='w-full text-center p-6'>
            <UploadIcon
              size={48}
              color='#9ca3af'
              className='mx-auto mb-4'
            />
            <p className='text-lg font-medium text-gray-800 mb-2'>파일을 업로드 해주세요</p>
            <p className='text-sm text-gray-500 mb-4'>드래그하거나 클릭</p>
          </div>
        )}
      </div>

      {error && (
        <div className='absolute -top-10 left-0 right-0 flex justify-center'>
          <p
            id='upload-error'
            role='alert'
            aria-live='polite'
            className='text-sm text-red-600 text-center bg-red-50 px-3 py-1 rounded-md'>
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
