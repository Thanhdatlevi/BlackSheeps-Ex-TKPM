function getLangFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'vi';
}

const currentLang = getLangFromURL();

window.i18nReady = new Promise((resolve, reject) => {
  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      backend: {
        loadPath: '/lang/{{lng}}.json',
      },
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator'],
        caches: ['cookie'],
      },
      lng: currentLang,
      fallbackLng: 'vi',
      ns: ['translation'], // đảm bảo namespace được dùng
      defaultNS: 'translation',
      debug: true,
    }, (err, t) => {
      if (err) {
        console.error('❌ i18next init error:', err);
        reject(err);
      } else {
        console.log('✅ i18next đã khởi tạo xong');
        resolve();
      }
    });
});
