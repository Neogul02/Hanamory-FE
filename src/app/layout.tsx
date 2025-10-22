import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hanamory',
  description: 'Yolov5 기반 꽃 이미지 판별',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ko'>
      <head>
        <link
          rel='icon'
          href='/favicon.ico'
          sizes='32x32'
        />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css'
        />
        <script
          type='text/javascript'
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`}
          async
        />
      </head>
      <body className='font-pretendard min-h-screen flex justify-center bg-white no-scrollbar'>
        <div className='w-full box-border md:max-w-xl 2xl:max-w-xl'>{children}</div>
      </body>
    </html>
  )
}
