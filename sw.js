/**
 * Service Worker pour calculeage.fr
 * Cache-first strategy pour performances maximales
 * Version: 2.0.0
 */

const CACHE_VERSION = 'calculeage-v2.0.0';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Fichiers à mettre en cache immédiatement
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/analytics.js',
    '/manifest.json',
    '/404.html',
    '/age-en-mois-jours.html',
    '/chien.html',
    '/chat.html',
    '/comparer-ages.html',
    '/age-celebrites.html'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Installation en cours...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cache ouvert:', CACHE_NAME);
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Fichiers mis en cache avec succès');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Erreur lors de la mise en cache:', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activation en cours...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('[SW] Suppression de l\'ancien cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activé');
                return self.clients.claim();
            })
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }

    // Ignorer les requêtes vers des domaines externes (sauf Google Analytics)
    if (url.origin !== location.origin && !url.host.includes('google')) {
        return;
    }

    // Stratégie: Cache First avec Network Fallback
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Réponse depuis le cache:', request.url);
                    return cachedResponse;
                }

                // Si pas en cache, aller sur le réseau
                return fetch(request)
                    .then((networkResponse) => {
                        // Ne pas cacher les erreurs
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Cloner la réponse car elle ne peut être consommée qu'une fois
                        const responseToCache = networkResponse.clone();

                        // Mettre en cache dynamiquement
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        console.log('[SW] Réponse depuis le réseau (mise en cache):', request.url);
                        return networkResponse;
                    })
                    .catch(() => {
                        // En cas d'erreur réseau, retourner la page 404 si c'est un HTML
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/404.html');
                        }
                    });
            })
    );
});

// Messages du Service Worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// Notifications Push (optionnel, pour le futur)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Calcul d\'Âge';
    const options = {
        body: data.body || 'Nouvelle notification',
        icon: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 192 192\'><rect width=\'192\' height=\'192\' fill=\'%23667eea\'/><text x=\'96\' y=\'140\' font-size=\'120\' text-anchor=\'middle\' fill=\'white\'>📅</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 96 96\'><text y=\'70\' font-size=\'70\'>📅</text></svg>',
        vibrate: [200, 100, 200],
        data: data
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

console.log('[SW] Service Worker chargé - Version:', CACHE_VERSION);
