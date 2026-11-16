// ====== PENGATURAN APP TERPASANG (isi lalu upload ulang file ini) ======
self.HQ_CONFIG = {
  // 1) URL Web App dari Apps Script (Deploy > Manage deployments), berakhiran /exec
  EXEC_URL: 'https://script.google.com/macros/s/GANTI_DENGAN_ID_DEPLOYMENT/exec',

  // 2) Opsional, untuk notifikasi push. Tempel dari Firebase Console:
  //    Project settings > General > Your apps > Web app > SDK setup and configuration > Config
  firebaseConfig: null,
  // contoh:
  // firebaseConfig: {
  //   apiKey: '...', authDomain: '...', projectId: '...',
  //   storageBucket: '...', messagingSenderId: '...', appId: '...'
  // },

  // 3) Opsional: Project settings > Cloud Messaging > Web Push certificates > Key pair
  vapidKey: ''
};
