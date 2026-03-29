const CACHE_NAME = "amir-portfolio-v2";
const urlsToCache = [
  "/PORTFOLIO/",
  "/PORTFOLIO/index.html",
  "/PORTFOLIO/CSS/style.css",
  "/PORTFOLIO/JS/script.js",
  "/PORTFOLIO/Assets/CodwWithAmir-favicone.png"
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