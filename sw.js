const CACHE_NAME = "amir-portfolio-v2";
const urlsToCache = [
  "/CodeWithAmir/",
  "/CodeWithAmir/index.html",
  "/CodeWithAmir/css/style.css",
  "/CodeWithAmir/js/script.js",
  "/CodeWithAmir/assets/icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});