# Simmey

![image](https://github.com/user-attachments/assets/9d4941d5-7d4e-4e78-ad73-2dcd526605aa)

엄마 아빠와 내가 얼마나 닮았는지 알려주는 웹앱 사이트! 

전 세계 사람들이 나에게 1원씩만(광고 수익) 주면 부자가 되지 않을까..? 싶어서 
16개국 다국어 지원을 통하여 사이드 프로젝트 홈페이지를 만들고 테스트 해봤습니다.

다국어 지원은 chatgpt AI로 번역했고, SEO 다국어 지원이 가능한지 가설 및 검증은 아래 링크의 "두루미스" 플랫폼을 참고해서 구현했습니다.

https://blog.naver.com/dreamyoungs_inc/223425945113


자세한 글)

https://lodado.tistory.com/104


## 구조 설명


### 인브라우저 인공지능 모델  

tensorflow.js를 사용해서 브라우저에서 "인공지능 모델(facenet 경량버전)"이 동작합니다.
이를 통하여 유저는 사진 유출 걱정 없이 브라우저에서 닮은꼴 사진들을 마끔껏 비교 가능합니다.
물론 원하면 oauth2 소셜 로그인을 통하여 결과 공유도 가능하지만
수상한(?) 사이트에 지금까지 "사진을 공유한 유저"는 없었습니다..ㅎㅎ 

### Feature-Sliced Design (FSD)

Feature-Sliced Design은 비즈니스 로직을 명확히 분리하고, 각 기능을 독립적으로 구성할 수 있도록 돕는 설계 방식이다. 기술 레이어 중심이 아닌 "기능 중심"으로 코드를 관리함으로써, 유지보수성과 확장성을 높이는 것이 목적이다.

```
App: 앱의 초기 설정 및 전역 설정 담당
Pages: 화면 단위, 여러 기능과 엔티티를 조합해 구성
Widgets: feature/entity/shared 레이어의 구성 요소 2개 이상을 조합한 상위 UI
Features: 독립적인 비즈니스 기능 단위
Entities: 도메인 모델과 관련 로직 정의
Shared: 공통 유틸리티, 컴포넌트, 스타일 등
```

### 도입 배경

의존성 관리가 어려웠고, 이를 구조적으로 해결할 수 있는 파일 구조가 필요했다.

순환 의존성을 제거하고, 각 레이어 간 관계를 명확히 드러내고 싶었다.


### 커스텀 룰

Widgets는 features/entities/shared 레이어의 컴포넌트 2개 이상을 조합할 때만 생성한다. widget과 feature의 경계가 모호해지는 것을 방지하기 위함이다.

대부분의 페이지는 하나의 feature만 사용하는 경우가 많다. 따라서 해당 페이지 전용 feature는 pages 폴더 내부에 위치시키며, GNB처럼 여러 페이지에서 사용하는 공통 feature만 features/widgets에 둔다.







