import { create } from 'zustand'

interface FlowerUploadState {
  file: File | null
  imageUrl: string | null
  error: string
  isAnalyzing: boolean
  flowerNames: string[]
  koreanName: string | null
  flowerLang: string | null
  flowerDesc: string | null
  setFile: (file: File | null) => void
  setImageUrl: (url: string | null) => void
  setError: (error: string) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  setFlowerNames: (names: string[]) => void
  setKoreanName: (name: string | null) => void
  setFlowerLang: (lang: string | null) => void
  setFlowerDesc: (desc: string | null) => void
  resetAnalysis: () => void
}

export const useFlowerUploadStore = create<FlowerUploadState>((set) => ({
  file: null,
  imageUrl: null,
  error: '',
  isAnalyzing: false,
  flowerNames: [],
  koreanName: null,
  flowerLang: null,
  flowerDesc: null,
  setFile: (file) => set({ file }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setError: (error) => set({ error }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setFlowerNames: (names) => set({ flowerNames: names }),
  setKoreanName: (name) => set({ koreanName: name }),
  setFlowerLang: (lang) => set({ flowerLang: lang }),
  setFlowerDesc: (desc) => set({ flowerDesc: desc }),
  resetAnalysis: () => set({ file: null, imageUrl: null, flowerNames: [], koreanName: null, flowerLang: null, flowerDesc: null, error: '' }),
}))
