// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBsxDTCvqSEevSpTsbTnJKo79VC0muDsNI",
  authDomain: "davids-svensexa.firebaseapp.com",
  projectId: "davids-svensexa",
  storageBucket: "davids-svensexa.firebasestorage.app",
  messagingSenderId: "488864098079",
  appId: "1:488864098079:web:8f7e4022dea9033736b22a"
});

const messaging = firebase.messaging();

// Hantera notiser i bakgrunden
messaging.onBackgroundMessage((payload) => {
  console.log('Bakgrundsnotis mottagen:', payload);
  
  const notificationTitle = payload.notification?.title || 'Davids Svensexa';
  const notificationOptions = {
    body: payload.notification?.body || 'Ny händelse!',
    icon: 'https://firebasestorage.googleapis.com/v0/b/davids-svensexa.firebasestorage.app/o/Davidlogga.png?alt=media',
    badge: 'https://firebasestorage.googleapis.com/v0/b/davids-svensexa.firebasestorage.app/o/Dave1.png?alt=media',
    vibrate: [200, 100, 200],
    tag: payload.data?.type || 'general',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Hantera klick på notiser
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Öppna appen när användaren klickar på notisen
  event.waitUntil(
    clients.openWindow('/')
  );
});
