# Shift Calendar PWA

민기님, 교대근무표를 어디서나 앱처럼 사용할 수 있도록 만들었어요. 지금 상태에서 모바일 앱처럼 설치하거나 배포할 수 있게 필요한 설정과 실행 방법을 정리했어요.

## 현재 구성
- **PWA 기본**: `manifest.json`, `icons/calendar-symbol.svg`, `meta` 태그, `link rel="apple-touch-icon"`, `display: standalone`로 앱 감성 설정.
- **고급 타이포그래피**: `Cormorant Garamond` + `Pretendard` 조합 + 일관된 레터스페이싱으로 고급 느낌 유지.
- **오프라인 대비**: `offline.html`과 `sw.js`가 캐시를 관리해서 인터넷이 끊겨도 메시지와 마지막 로컬 버전을 보여줘요.
- **서비스워커 관리**: 로컬에서는 이미 등록된 `sw.js`를 정리하고, 배포 환경에서는 최신 캐시를 등록합니다.

## 로컬에서 미리보기 (PC/모바일 모두)
1. `./serve.sh 8000` 을 실행하면 `live-server`(없으면 `python3 -m http.server`)로 자동 실행돼요.
2. 같은 네트워크의 다른 기기에서 `http://<PC_IP>:8000/index.html` 주소를 열면 항상 최신 근무표를 확인할 수 있어요. IP는 `hostname -I` 또는 `ip a`로 확인.
3. 개발용으로는 브라우저에서 `Ctrl+Shift+R`/`Ctrl+F5`로 캐시를 무시하면 바로 바뀐 스타일이 반영돼요.

## 모바일 앱으로 묶기 (Capacitor/웹뷰 등)
1. **Capacitor 예시**
   ```bash
   npx cap init shift-calendar-app "교대근무표"
   cd shift-calendar
   npx cap add android  # 또는 ios
   npx cap copy
   npx cap open android
   ```
   - `android/app/src/main/assets/public` 폴더에 `index.html` 등 현 파일을 복사하면 됩니다.
   - `capacitor.config.ts`에서 `webDir`/`server`를 `shift-calendar`로 맞춰주세요.
2. **웹뷰 호스팅**: 서버(예: Netlify/GitHub Pages)에 `shift-calendar` 폴더를 배포하고, 모바일 앱(Android WebView, iOS WKWebView)에서 해당 URL을 로드하면 됩니다.
3. **빌드 자동화**: `serve.sh`를 배포용에 맞게 `npm run build` 선행 + static 서버를 얹는 스크립트로 확장 가능해요.

## 배포 팁
- PWA 캐시는 `sw.js`에서 `CACHE_NAME`을 `shift-cal-v4`로 관리해요. 배포 시 `v5`처럼 번호만 올려주면 새로운 캐시를 가져오고 예전 캐시는 자동 삭제돼요.
- `manifest.json`의 `shortcuts`와 `icons`를 그대로 유지하면 Android/iOS에서 설치 시 아이콘·빠른 실행이 잘 작동합니다.
- 오프라인 메시지가 필요 없으면 `offline.html`을 편집하거나 꺼낼 수도 있고, 네트워크 리소스는 `APP_SHELL`에만 넣으면 됩니다.

추가로 민기님이 원하는 플랫폼(예: Android, iOS, Samsung)이나 배포 방식 있으면 알려줘, 그에 맞춰 더 손봐줄게! 🩷