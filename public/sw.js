self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  // A simple fetch handler is required by Chrome to trigger the PWA install prompt.
  // We can just let the browser handle it.
  return;
});
