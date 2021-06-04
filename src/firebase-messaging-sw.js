importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBtew16D6VPv41dz-ubIsSizcw0thz7Hqo',
  authDomain: 'two-todo.firebaseapp.com',
  databaseURL: 'https://two-todo-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'two-todo',
  storageBucket: 'two-todo.appspot.com',
  messagingSenderId: '246115912358',
  appId: '1:246115912358:web:942dca9f6038b9c6950267'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  return self.registration.showNotification( // send push
    `${payload.data.title}`,
    { // with data from event
      body: payload.data.body,
      tag: payload.data.tag,
      renotify: false
    });
});

// close notification and open list from event
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  clients.openWindow(`/list/${event.notification.tag}`);
}, false);
