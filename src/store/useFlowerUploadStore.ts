import { create } from 'zustand'

interface FlowerPrediction {
  bbox: number[]
  class: string
  confidence: number
}

interface FlowerInfo {
  name: string
  koreanName?: string
  flowerLang?: string
  flowerDesc?: string
}

interface FlowerUploadState {
  file: File | null
  imageUrl: string | null
  error: string
  isAnalyzing: boolean
  flowerNames: string[]
  koreanName: string | null
  flowerLang: string | null
  flowerDesc: string | null
  // 다중 꽃 예측 결과
  predictions: FlowerPrediction[]
  flowerInfos: { [name: string]: FlowerInfo }
  selectedFlowerName: string | null
  setFile: (file: File | null) => void
  setImageUrl: (url: string | null) => void
  setError: (error: string) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  setFlowerNames: (names: string[]) => void
  setKoreanName: (name: string | null) => void
  setFlowerLang: (lang: string | null) => void
  setFlowerDesc: (desc: string | null) => void
  setPredictions: (predictions: FlowerPrediction[]) => void
  setFlowerInfos: (infos: { [name: string]: FlowerInfo }) => void
  setSelectedFlowerName: (name: string | null) => void
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
  predictions: [],
  flowerInfos: {},
  selectedFlowerName: null,
  setFile: (file) => set({ file }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setError: (error) => set({ error }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setFlowerNames: (names) => set({ flowerNames: names }),
  setKoreanName: (name) => set({ koreanName: name }),
  setFlowerLang: (lang) => set({ flowerLang: lang }),
  setFlowerDesc: (desc) => set({ flowerDesc: desc }),
  setPredictions: (predictions) => set({ predictions }),
  setFlowerInfos: (infos) => set({ flowerInfos: infos }),
  setSelectedFlowerName: (name) => set({ selectedFlowerName: name }),
  resetAnalysis: () =>
    set({
      file: null,
      imageUrl: null,
      flowerNames: [],
      koreanName: null,
      flowerLang: null,
      flowerDesc: null,
      error: '',
      predictions: [],
      flowerInfos: {},
      selectedFlowerName: null,
    }),
}))
