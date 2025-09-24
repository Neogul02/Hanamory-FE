import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hanamory',
  description: 'Yolov5 기반 꽃 이미지 판별',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ko'>
      <head>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css'
        />
      </head>
      <body className='font-pretendard min-h-screen flex justify-center'>
        <div className='w-full box-border md:max-w-2xl 2xl:max-w-2xl'>{children}</div>
      </body>
    </html>
  )
}
