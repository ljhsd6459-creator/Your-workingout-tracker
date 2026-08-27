/* GymBuddy Service Worker — 백그라운드 쉬는시간 타이머 알림 */

const SW_VERSION = "1.0.0";

// 타이머 ID를 보관 (중복 타이머 방지)
let _timerHandle = null;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SET_TIMER') {
    // 기존 타이머가 있으면 취소
    if (_timerHandle !== null) {
      clearTimeout(_timerHandle);
      _timerHandle = null;
    }

    const delay = event.data.endAt - Date.now();
    if (delay <= 0) return; // 이미 지난 시각이면 무시

    _timerHandle = setTimeout(() => {
      _timerHandle = null;
      self.registration.showNotification('⏰ 쉬는 시간 완료!', {
        body: '다음 세트 시작할 시간이에요 💪',
        tag: 'gymbuddy-rest-timer',
        renotify: true,
        vibrate: [300, 120, 300, 120, 400],
        requireInteraction: false
      });
    }, delay);
  }

  if (event.data.type === 'CANCEL_TIMER') {
    if (_timerHandle !== null) {
      clearTimeout(_timerHandle);
      _timerHandle = null;
    }
  }
});