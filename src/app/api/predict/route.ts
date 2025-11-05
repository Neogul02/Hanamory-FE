import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('image') as File

  if (!file) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
  }

  // 파일을 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // form-data 패키지로 백엔드에 전달할 FormData 생성
  const backendForm = new FormData()
  backendForm.append('image', buffer, {
    filename: file.name,
    contentType: file.type,
    knownLength: buffer.length,
  })

  try {
    // 백엔드의 /predict 엔드포인트로 요청 (이미지 반환)
    // 타임아웃 30초 설정
    const response = await axios.post('https://port-0-hanamory-be-mc4jrdp5a5037961.sel5.cloudtype.app/predict', backendForm, {
      headers: backendForm.getHeaders(),
      responseType: 'arraybuffer', // 이미지 데이터를 받기 위해
      timeout: 30000, // 30초 타임아웃
    })

    // 이미지 데이터를 Base64로 인코딩하여 반환
    const base64Image = Buffer.from(response.data, 'binary').toString('base64')
    const contentType = response.headers['content-type'] || 'image/jpeg'
    const imageDataUrl = `data:${contentType};base64,${base64Image}`

    return NextResponse.json({ imageUrl: imageDataUrl })
  } catch (err: any) {
    console.error('Predict API Error:', err)
    return NextResponse.json({ error: err?.response?.data?.error || err.message }, { status: 500 })
  }
}
