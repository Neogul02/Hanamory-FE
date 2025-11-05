# 🌸 Hanamory - 당신의 꽃, 당신의 이야기

<div align="center">
<!-- TODO: 메인 프로젝트 이미지 추가 -->
<img width="100%" alt="hanamory-main" src="" />
</div>

# Hanamory : WEB FRONTEND

> **AI 기반 꽃 인식 및 꽃말 공유 서비스** <br/>
> **개발기간: 2025.01 ~ 2025.11**

## 👋 배포 주소

> **Hanamory Service** : [서비스 체험하기](#) <br> > **프론트엔드 Github** : [Hanamory-FE](https://github.com/Neogul02/Hanamory-FE)<br> > **백엔드 Github** : [Hanamory-BE](#)<br>

## 🎉 팀 소개

|                  팀원명                   |
| :---------------------------------------: |
|  <img width="160" alt="프로필" src="" />  |
| [@Your Name](https://github.com/Neogul02) |
|                Full Stack                 |

## 🔥 프로젝트 소개

<mark>**Hanamory**는 사용자가 촬영한 꽃 사진을 AI로 자동 인식하고, 꽃말과 상세 정보를 제공하는 서비스입니다.
복잡한 꽃 이름을 몰라도 사진 한 장으로 즉시 꽃에 대한 정보를 얻을 수 있으며,
감성적인 이미지로 변환하여 인스타그램 등 SNS에 공유할 수 있습니다.
꽃을 사랑하는 모든 분들께 꽃과의 특별한 추억을 기록하고 공유할 수 있는 플랫폼을 제공합니다.</mark>

<br>

## 🌊 서비스 플로우

<!-- TODO: 서비스 플로우 이미지 추가 -->
<div align="center">
<img width="100%" alt="service-flow" src="" />
</div>

**주요 플로우:**

1. 📸 꽃 사진 업로드 (드래그 앤 드롭 또는 클릭)
2. 🤖 AI 기반 실시간 꽃 인식 (YOLO 모델)
3. 🌺 꽃말 및 상세 정보 제공 (Gemini AI)
4. 🎨 커스터마이징 가능한 공유 이미지 생성
5. 📱 인스타그램 스토리 공유 또는 다운로드

<br>

## ✨ 서비스 핵심 기능

### 1. 간편한 꽃 사진 업로드

<!-- TODO: 업로드 기능 스크린샷 추가 -->
<div style="display: flex; justify-content: space-between; gap: 10px;">
  <img src="" width="48%" />
  <img src="" width="48%" />
</div>
<br>

<mark>드래그 앤 드롭, 클릭, 붙여넣기 등 다양한 방식으로 꽃 사진을 업로드할 수 있습니다.
이미지 형식 자동 검증 및 20MB 이하 파일 크기 제한으로 안정적인 업로드를 보장합니다.</mark>

**주요 기능:**

- 드래그 앤 드롭 지원
- 클립보드 붙여넣기 지원
- 실시간 이미지 미리보기
- 자동 파일 검증 (형식, 크기)

### 2. AI 기반 실시간 꽃 인식

<!-- TODO: AI 분석 화면 스크린샷 추가 -->
<div style="display: flex; justify-content: space-between; gap: 10px;">
  <img src="" width="48%" />
  <img src="" width="48%" />
</div>
<br>

<mark>YOLO 객체 인식 모델을 활용하여 사진 속 꽃을 실시간으로 인식합니다.
다중 꽃 인식 지원으로 한 장의 사진에서 여러 종류의 꽃을 동시에 분석할 수 있습니다.</mark>

**주요 기능:**

- 🎯 고정밀 꽃 종류 인식
- 🔍 다중 꽃 동시 인식
- 📊 신뢰도 기반 결과 제공
- 🖼️ 인식된 꽃 위치 시각화 (바운딩 박스)

### 3. Gemini AI 기반 꽃말 및 상세 정보

<!-- TODO: 결과 페이지 스크린샷 추가 -->
<div style="display: flex; justify-content: space-between; gap: 10px;">
  <img src="" width="48%" />
  <img src="" width="48%" />
</div>
<br>

<mark>Google Gemini AI를 활용하여 인식된 꽃의 한국어 이름, 꽃말, 관리 방법 등 상세 정보를 제공합니다.
다중 꽃이 인식된 경우 각 꽃을 선택하여 개별 정보를 확인할 수 있습니다.</mark>

**제공 정보:**

- 🌸 꽃 이름
- 💭 꽃말
- 📖 꽃 설명 및 특징
- 🌱 관리 방법

### 4. 커스터마이징 가능한 공유 이미지

<!-- TODO: 공유 모달 스크린샷 추가 -->
<div style="display: flex; justify-content: space-between; gap: 10px;">
  <img src="" width="48%" />
  <img src="" width="48%" />
</div>
<br>

<mark>사용자가 직접 배경, 텍스트 색상, 투명도를 조절하여 자신만의 감성적인 꽃말 이미지를 만들 수 있습니다.
인스타그램 스토리에 최적화된 9:16 비율로 자동 생성됩니다.</mark>

**커스터마이징 옵션:**

- 🎨 배경 스타일 (없음, 어두운, 밝은)
- 🔆 배경 투명도 조절 (3단계)
- 🌈 텍스트 색상 (RGB 컬러피커 + 6가지 프리셋)
- 📱 실시간 미리보기

### 5. 내 주변 꽃집 찾기

<!-- TODO: 꽃집 지도 스크린샷 추가 -->
<img src="" width="100%" />
<br>

<mark>마음에 드는 꽃을 발견했다면? 카카오맵 API를 활용하여 현재 위치 기반으로 가까운 꽃집을 찾아드립니다.</mark>

**주요 기능:**

- 📍 현재 위치 기반 꽃집 검색
- 🗺️ 카카오맵 연동

---

## 💻 기술 스택

| 구분                 | 기술                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**             | ![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Style**            | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)                                                                                                                                                                                                         |
| **Animation**        | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)                                                                                                                                                                                                             |
| **State Management** | ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square&logoColor=white)                                                                                                                                                                                                                                     |
| **HTTP Client**      | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)                                                                                                                                                                                                                              |
| **AI Integration**   | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white) ![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=flat-square)                                                                                                                                         |
| **Maps**             | ![Kakao Maps](https://img.shields.io/badge/Kakao_Maps-FFCD00?style=flat-square&logo=kakao&logoColor=black)                                                                                                                                                                                                                    |
| **Image Processing** | ![Canvas API](https://img.shields.io/badge/Canvas_API-FF6F00?style=flat-square)                                                                                                                                                                                                                                               |
| **Deployment**       | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)                                                                                                                                                                                                                           |

### 백엔드 기술 스택

| 구분           | 기술                                                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Model**   | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=flat-square) |
| **Deployment** | ![Cloudtype](https://img.shields.io/badge/Cloudtype-000000?style=flat-square)                                                                                           |

---

## 📁 프로젝트 구조

```
Hanamory-FE/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx               # 메인 페이지 (꽃 업로드)
│   │   ├── result/                # 결과 페이지
│   │   │   └── page.tsx           # 꽃 정보 표시
│   │   ├── flowermap/             # 꽃집 지도 페이지
│   │   │   └── page.tsx
│   │   └── api/                   # API Routes
│   │       ├── gemini/            # Gemini AI 호출
│   │       ├── predict/           # 꽃 인식 (이미지 반환)
│   │       └── predict-json/      # 꽃 인식 (JSON 반환)
│   ├── components/                # 재사용 컴포넌트
│   │   ├── UploadBox.tsx         # 이미지 업로드
│   │   ├── ShareModal.tsx        # 공유 모달
│   │   ├── Button.tsx            # 공통 버튼
│   │   └── FlowerResult.tsx      # 꽃 결과 카드
│   ├── store/                     # Zustand 상태 관리
│   │   └── useFlowerUploadStore.ts
│   ├── utils/                     # 유틸리티 함수
│   │   ├── geminiApi.ts          # Gemini API 공통 함수
│   │   ├── flowerPrompt.ts       # 프롬프트 생성
│   │   └── format.ts             # 파일 검증
│   └── assets/                    # 정적 리소스
│       └── icons.tsx
├── public/                        # 정적 파일
│   └── image/
│       └── mainLogo.png
├── IMPROVEMENTS.md                # 개선사항 문서
└── README.md                      # 프로젝트 문서
```

---

## 🚀 설치 및 실행

### 환경 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/Neogul02/Hanamory-FE.git
cd Hanamory-FE

# 의존성 설치
npm install
# 또는
yarn install

# 환경 변수 설정
# .env.local 파일 생성 후 아래 내용 추가
GEMINI_API_KEY=your_gemini_api_key_here

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build
# 또는
yarn build

# 빌드 결과 실행
npm start
# 또는
yarn start

# 린터 실행
npm run lint
# 또는
yarn lint
```
