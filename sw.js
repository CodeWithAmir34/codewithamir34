const CACHE_NAME = "amir-portfolio-v2";
const urlsToCache = [
  "/PORTFOLIO/",
  "/PORTFOLIO/index.html",
  "/PORTFOLIO/CSS/style.css",
  "/PORTFOLIO/JS/script.js",
  "/PORTFOLIO/Assets/CodeWithAmir-favicone.png" // Fix: spelling check karlo file ki
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // force update ke liye
      self.skipWaiting();
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Agar cache mein hai to wahan se lo, warna network se
      return response || fetch(event.request);
    })
  );
});