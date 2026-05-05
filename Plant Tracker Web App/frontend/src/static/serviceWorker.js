function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = 'evergreen-static-v0';

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        '/offline',
        '/static/css/dashboard.css',
        '/static/css/login-success.css',
        '/static/css/login.css',
        '/static/css/plants.css',
        '/static/css/profile.css',
        '/static/css/schedule.css',
        '/static/css/splash.css',
        '/static/css/styles.css',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-01.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-02.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-03.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-04.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-05.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-06.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-07.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-08.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-09.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-10.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-11.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-12.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-13.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-14.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-15.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-16.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-17.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-18.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-19.png',
        '/static/images/avatars/Avatars%20Set%20Flat%20Style-20.png',
        '/static/images/icons/home_icon.png',
        '/static/images/icons/plant_icon.png',
        '/static/images/icons/profile_icon.png',
        '/static/images/icons/schedule_icon.png',
        '/static/images/plants/african%20violet.png',
        '/static/images/plants/aloe%20vera.png',
        '/static/images/plants/anthurium.png',
        '/static/images/plants/aster.png',
        '/static/images/plants/basil.png',
        '/static/images/plants/boston%20fern.png',
        '/static/images/plants/burros%20tail.png',
        '/static/images/plants/buttonbush.png',
        '/static/images/plants/cactus.png',
        '/static/images/plants/calathea.png',
        '/static/images/plants/chinese%20evergreen.png',
        '/static/images/plants/christmas%20cactus.png',
        '/static/images/plants/coneflower.png',
        '/static/images/plants/fiddle%20leaf%20fig.png',
        '/static/images/plants/hyacinth.png',
        '/static/images/plants/hydrangea.png',
        '/static/images/plants/jade%20plant.png',
        '/static/images/plants/lavender.png',
        '/static/images/plants/lily.png',
        '/static/images/plants/maidenhair%20fern.png',
        '/static/images/plants/mint.png',
        '/static/images/plants/monstera.png',
        '/static/images/plants/orchid.png',
        '/static/images/plants/peace%20lily.png',
        '/static/images/plants/placeholder.png',
        '/static/images/plants/poppy.png',
        '/static/images/plants/pothos.png',
        '/static/images/plants/rose.png',
        '/static/images/plants/rosemary.png',
        '/static/images/plants/roses.jpg',
        '/static/images/plants/rubber%20plant.png',
        '/static/images/plants/snake%20plant.png',
        '/static/images/plants/sunflower.jpg',
        '/static/images/plants/sunflower.png',
        '/static/images/plants/testing.png',
        '/static/images/plants/tulip.png',
        '/static/images/plants/userPlant.png',
        '/static/images/apple-touch-icon.png',
        '/static/images/favicon-96x96.png',
        '/static/images/favicon.ico',
        '/static/images/favicon.svg',
        '/static/images/icon-192x192.png',
        '/static/images/icon-256x256.png',
        '/static/images/icon-384x384.png',
        '/static/images/icon-512x512.png',
        '/static/images/logo.svg',
        '/static/images/logo.png',
        '/static/js/APIClient.js',
        '/static/js/dashboard.js',
        '/static/js/HTTPClient.js',
        '/static/js/login.js',
        '/static/js/plants.js',
        '/static/js/profile.js',
        '/static/js/registration.js',
        '/static/js/schedule.js',
    ]);
  })); 
  // As soon as this method returns, the service worker is considered installed
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil( caches.keys().then(cacheNames => {
    const oldCaches = cacheNames.filter(cacheName => 
        cacheName.startsWith('evergreen-') && cacheName != STATIC_CACHE_NAME
    );

    return Promise.all(
        oldCaches.map(cacheName => caches.delete(cacheName))
    );
  }));
  // As soon as this method returns, the service worker is considered active
});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (response.ok && request.method === 'GET') {
      return caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.put(request, response.clone());
        return response.clone();
      });
    }
    
    return response.clone();
  });
}

function cacheFirst(request) {
  return caches.match(request).then(response => {
    if (response) 
        return response;
    return fetchAndCache(request);
  }).catch(() => {
    return caches.match('/offline');
  });
}

self.addEventListener('fetch', event => {
    event.respondWith(
        cacheFirst(event.request)
    );
});



self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


/********************\
* PUSH NOTIFICATIONS *
\********************/
self.addEventListener('push', event => {
  log('push', event);

  // Get the pushed data and parse it as JSON into a constant called message. This data will be the notification object we sent from the server.
  const message = event.data.json();

  // Use event.waitUntil() to ensure the event doesn't finish until we show the notification, passing in as a parameter the result of calling the showNotification method on the self.registration object with the message.title as the first parameter and an object with a body property set to the message.body property and an icon property set to /img/chat-icon.svg
  event.waitUntil(
    self.registration.showNotification(message.title, {
        body: message.body,
        icon: `/static/images/icon-192x192.png`
    })
    .then(() => log('Notification shown successfully'))
    .catch(err => log('Notification failed:', err))
  );
});