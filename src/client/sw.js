var DOMAIN_NAME = self.location.origin;
const url = new URL(location.href);
const debug = url.searchParams.has('debug');
var API_CACHE = 'api-cache';
var RUNTIME_CACHE = 'runtime-cache';
var IMAGE_CACHE = 'image-cache';
//var CSS_CACHE = 'css-cache';

if (workbox) {
	(function () {
		workbox.core.clientsClaim();
		self.__precacheManifest = [].concat(self.__precacheManifest || []);
		self.__precacheManifest.unshift({
			url: '/offline.html'
		});

		workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
		
		var apiHandler = workbox.strategies.staleWhileRevalidate({
			cacheName: API_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 24 * 60 * 60 // 1day
			}), new workbox.cacheableResponse.Plugin({
				statuses: [200]
			})]
		});

		workbox.routing.registerRoute(/(.*)\/images\//, workbox.strategies.cacheFirst({
			cacheName: IMAGE_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 31536000 // 1 year
			})]
		}), 'GET');

		workbox.routing.registerRoute(/(.*)\/fonts\//, workbox.strategies.cacheFirst({
			cacheName: IMAGE_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 31536000 // 1 year
			})]
		}), 'GET');

		workbox.routing.registerRoute(/(.*)/, new workbox.strategies.NetworkFirst({
			cacheName: RUNTIME_CACHE,
			plugins: [new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 30 * 60 // 30 min
			})]
		}), 'GET');

		workbox.routing.registerRoute(/.*/, new workbox.strategies.NetworkFirst(), 'GET');

		self.addEventListener('install', function (event) {
			return event.waitUntil(self.skipWaiting());
		});

		self.addEventListener('activate', function (event) {
			event.waitUntil(
				caches.keys().then(function (cacheNames) {
					return Promise.all(
						cacheNames.map(function (cacheName) {
							if (cacheName.indexOf('runtime') != -1) {
								console.log('Deleting out of date cache:', cacheName);
								return caches.delete(cacheName);
							}
						})
					);
				})
			);
		});

	})();
} else {
	//console.log('Boo! Workbox didn\'t load 😬');
}