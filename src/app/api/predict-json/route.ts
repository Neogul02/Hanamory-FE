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
    const response = await axios.post(
      'http://ec2-43-203-218-212.ap-northeast-2.compute.amazonaws.com:5000/predict-json',
      backendForm,
      {
        headers: backendForm.getHeaders(),
      }
    )
    return NextResponse.json(response.data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.response?.data?.error || err.message },
      { status: 500 }
    )
  }
}