// ════════════════════════════════════════════════════════════════════
// SERVICE WORKER — Sistema Poseidon's Seal
// Academia de Guerra Aérea — FACH
// Estrategia: Cache-first para assets propios | Network-first para CDN
// ════════════════════════════════════════════════════════════════════

const CACHE_NAME    = "poseidon-seal-v1";
const CACHE_CDN     = "poseidon-cdn-v1";

// Assets propios → siempre en caché (offline garantizado)
const ASSETS_LOCAL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icono.png"
];

// CDN externos → se cachean al primer uso
const ASSETS_CDN = [
    "https://cdn.tailwindcss.com",
    "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
];

// ── INSTALL ──────────────────────────────────────────────────────
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_LOCAL);
        }).then(() => self.skipWaiting())
    );
});

// ── ACTIVATE ─────────────────────────────────────────────────────
// Limpia cachés viejas de versiones anteriores
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME && k !== CACHE_CDN)
                    .map(k  => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ── FETCH ────────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
    const url = e.request.url;

    // IndexedDB y chrome-extension: no interceptar
    if (!url.startsWith("http")) return;

    // CDN externos → Network-first, fallback a caché
    if (url.includes("cdn.tailwindcss.com") || url.includes("cdnjs.cloudflare.com")) {
        e.respondWith(
            fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE_CDN).then(c => c.put(e.request, clone));
                return res;
            }).catch(() => caches.match(e.request))
        );
        return;
    }

    // Assets propios → Cache-first, fallback a network
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(res => {
                // Solo cachear respuestas válidas
                if (!res || res.status !== 200 || res.type === "opaque") return res;
                const clone = res.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return res;
            });
        })
    );
});
