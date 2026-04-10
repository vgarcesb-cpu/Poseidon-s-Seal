# 🔱 Poseidon's Seal — Sistema de Control de Bienes y Materiales
**Academia de Guerra Aérea · Fuerza Aérea de Chile**

---

## Versión actual: 2.0.1 — Hotfix crítico

> **Rama activa:** `main`
> **Deploy:** https://vgarcesb-cpu.github.io/Poseidon-s-Seal/
> **Stack:** Single-file HTML5 + CSS + Vanilla JS + IndexedDB + PWA

---

## Archivos del repositorio

```
Poseidon-s-Seal/
├── index.html      ← App completa (single file)
├── manifest.json   ← PWA manifest
├── sw.js           ← Service Worker (cache-first offline)
├── icono.png       ← Ícono 512×512 PNG
└── README.md       ← Este archivo
```

---

## Changelog

### v2.0.1 — 2026-04-10 — Hotfix crítico + guards IDB

#### 🔴 HOT-001 — SyntaxError fatal: `const sb` duplicado en `imprimirVale()`
**Síntoma:** App completamente muerta — folio y fecha no aparecen, IDB no abre, tabs no responden.
**Causa:** `const sb` declarado dos veces en el mismo scope de función → motor JS rechaza el script completo antes de ejecutar ni una línea.
**Fix:** Eliminada segunda declaración. `sb` se declara una sola vez al inicio de `imprimirVale()`. El bloque "Status en PDF" reutiliza `sb` y solo declara `const ps`.

#### 🟠 HOT-002 — `irAPasoDirecto(3)` no inicializaba canvas ni redibujaba firmas
**Síntoma:** Al presionar "← Volver Atrás" desde el Paso 4, el canvas aparece pero no responde a touch ni mouse. En modo edición (vale cargado desde historial), la firma guardada no se muestra.
**Fix:** `irAPasoDirecto()` ahora llama a `redibujarFirmasEnCanvas()` con `setTimeout 150ms` cuando `paso === 3`, idéntico al comportamiento de `irPaso()`.

#### 🟠 HOT-003 — `tx.onerror` ausente en 11 operaciones IndexedDB
**Síntoma:** Fallas silenciosas en IDB (storage lleno, permisos revocados) sin ningún aviso al usuario.
**Fix:** Añadido `tx.onerror = (e) => mostrarToast(...)` en todas las transacciones:
- `guardarVale()`
- `registrarDevolucion()`
- `cerrarVale()`
- `cargarHistorial()`
- `buscarVale()`
- `exportarJSON()`
- `importarJSON()`
- `cargarValePorQR()`
- `syncSubirTodo()`
- `syncDescargarTodo()`
- `syncBidireccional()` (tx lectura + tx2 merge)

#### 🟠 HOT-004 — Firmas no se redibujaban al retroceder desde Paso 4 en modo edición
**Síntoma:** Usuario abre vale desde historial → va al Paso 3 → canvas vacío → validación bloquea el avance con "firma obligatoria" aunque la firma existe en IDB.
**Fix:** Nueva función `redibujarFirmasEnCanvas()` que llama `initCanvas()` y luego carga `sigEntregaURL`/`sigRecibeURL` vía `Image.onload`. Invocada desde `irPaso()`, `irAPasoDirecto()` y el listener de `resize`.

Además, `limpiarFirmaCanvas(canvasId, canal)` reemplaza a `limpiarFirma()`. Al borrar el canvas también limpia la URL guardada (`sigEntregaURL` o `sigRecibeURL`) para que la validación detecte correctamente que la firma fue eliminada intencionalmente.

#### 🟠 HOT-005 — `validarPaso()` bloqueaba avance si firma guardada en URL
**Síntoma:** En modo edición, `validarPaso()` verificaba solo el canvas (vacío tras `initCanvas`) sin considerar que `sigEntregaURL` ya contiene la firma de IDB.
**Fix:** `firmaVacia(canvasId, urlGuardada)` recibe ambos parámetros. Si `urlGuardada` tiene contenido, retorna `false` (firma válida) sin inspeccionar el canvas.

---

### v2.0.0 — Fase 1 + Fase 2 + Fase 3

#### Fase 1 — Core PWA
- Formulario 4 pasos: Datos → Ítems → Firmas → Resumen
- Estados: EN EMISIÓN → EN CUSTODIA → EN DEVOLUCIÓN → CERRADO
- IndexedDB con historial completo
- PDF vía `window.print()` con QR embebido
- Firmas digitales canvas touch+mouse
- Export/Import JSON backup
- WhatsApp `wa.me` compartir registro
- 10 FIX obligatorios aplicados (ver comentario en `<head>`)

#### Fase 2 — Escáner QR
- `Html5-QRCode v2.3.8` cámara trasera S25
- Marco animado dorado
- Extracción de folio desde URL QR o texto plano
- Flujo: detección → pausa → confirmación → carga registro

#### Fase 3 — Sync WD MyCloud
- API REST red local `http://IP:8080`
- Subida, descarga y sync bidireccional
- Merge por `fechaTs` (gana el más reciente)
- Auto-sync ping al guardar (timeout 1.5s, silencioso si falla)
- Log de operaciones en tiempo real

---

## Fixes heredados activos (v2.0.0)

| Fix | Descripción | Función |
|-----|-------------|---------|
| FIX-001 | `onerror` en `dbReq` | `indexedDB.open` |
| FIX-002 | Guard `!db` antes de toda operación IDB | Todas las funciones IDB |
| FIX-003 | `null-check` en registros recuperados | `registrarDevolucion`, `cerrarVale`, `confirmarEscaneo` |
| FIX-004 | Canvas medido desde `sig-wrap` (padre) | `initCanvas()` |
| FIX-005 | `setTimeout 150ms` antes de `initCanvas` | `irPaso()`, `irAPasoDirecto()` |
| FIX-006 | `drawImage` con dimensiones explícitas | `capturarFirma()` |
| FIX-007 | `try/catch` en `JSON.parse` | `importarJSON()`, `syncDescargarTodo()` |
| FIX-008 | Limpia TODOS los campos en `nuevoVale()` | `nuevoVale()` |
| FIX-009 | Validación completa por paso | `validarPaso()` |
| FIX-010 | Resize listener rotación S25 | `window.addEventListener("resize")` |

---

## Flujo de estados y botones visibles

```
EN EMISIÓN
  → Guardar y Registrar   ✅ visible
  → Volver Atrás          ✅ visible
  → (resto ocultos)

EN CUSTODIA  (tras guardar)
  → Imprimir / PDF        ✅ visible
  → Registrar Devolución  ✅ visible
  → Enviar WhatsApp       ✅ visible

EN DEVOLUCIÓN
  → Imprimir / PDF        ✅ visible
  → Cerrar Vale           ✅ visible
  → Enviar WhatsApp       ✅ visible
  → Nuevo Vale            ✅ visible

CERRADO
  → Imprimir / PDF        ✅ visible
  → Enviar WhatsApp       ✅ visible
  → Nuevo Vale            ✅ visible
```

---

## Flujo de desarrollo obligatorio

```
1. Desarrollo en Mac (Chrome DevTools)
         ↓
2. git add . && git commit -m "..." && git push
         ↓
3. Validar en https://vgarcesb-cpu.github.io/Poseidon-s-Seal/
         ↓
4. Prueba definitiva en Samsung S25 en terreno
```

**Nunca asumir que funciona sin pasar las 3 etapas.**

---

## Dependencias CDN (requieren internet en primera carga)

| Librería | CDN | Uso |
|----------|-----|-----|
| QRCode.js 1.0.0 | cdnjs.cloudflare.com | Generación QR en PDF |
| Html5-QRCode 2.3.8 | unpkg.com | Escáner cámara S25 |
| Tailwind CSS | cdn.tailwindcss.com | Clases utilitarias base |

Tras la primera carga, el Service Worker cachea todos los recursos → funciona offline.

---

## QR — arquitectura

```
QR_BASE_URL = "https://vgarcesb-cpu.github.io/Poseidon-s-Seal/"

URL en QR del PDF:
  https://vgarcesb-cpu.github.io/Poseidon-s-Seal/?folio=AGA-2026-XXXX

Al escanear con S25:
  → Abre navegador → Carga app → dbReq.onsuccess → cargarValePorQR(folio)

Sin app instalada (terceros):
  → Abre navegador → Muestra app → "Folio no encontrado" (no tienen IDB local)
  → Solución pendiente: P-1 PDF sin QR para terceros
```

---

## Pendientes — próxima sesión

### P-1 — PDF sin QR (WhatsApp a terceros) 🟡 PRIORIDAD ALTA
**Problema:** El QR en el PDF actual apunta a `https://vgarcesb-cpu.github.io/Poseidon-s-Seal/?folio=AGA-...`. Un tercero que recibe el PDF por WhatsApp escanea el QR, abre la app web, pero no tiene los registros en su IDB local → mensaje de error confuso.

**Solución propuesta:**
- Añadir botón `📄 PDF SIN QR` junto al botón de imprimir actual
- En `imprimirValeSimple()`: misma lógica que `imprimirVale()` pero `p-qr-container` se reemplaza por un bloque de texto con folio y datos de contacto
- Uso: solo para envío externo por WhatsApp a personas sin acceso al sistema

**Archivos a modificar:** `index.html` — añadir botón en `setStatusUI()` + función `imprimirValeSimple()`

---

### P-2 — Google Drive con subcarpetas por año/mes 🟡 PRIORIDAD MEDIA
**Problema:** No existe integración con Google Drive. El backup manual (Exportar JSON) requiere acción explícita del usuario.

**Solución propuesta:**
- Usar Google Drive API v3 con OAuth2 PKCE (sin backend)
- Estructura de carpetas: `Poseidon_Seal / 2026 / 04 / poseidon_backup_20260410.json`
- Botones en tab Sync: `☁️ Google Drive` independiente de MyCloud
- Flujo: botón → popup OAuth → seleccionar cuenta → subir/bajar JSON

**Consideraciones:**
- Requiere Google Cloud Console → OAuth 2.0 client ID tipo "Web application"
- `redirect_uri` debe ser `https://vgarcesb-cpu.github.io/Poseidon-s-Seal/`
- Token se guarda en `localStorage` con refresh automático
- CORS manejado por Google (no requiere proxy)

**Archivos a modificar:** `index.html` — nueva sección en tab Sync + funciones `gdriveAuth()`, `gdriveSubir()`, `gdriveDescargar()`

---

## Configuración manifest.json requerida

```json
{
  "name": "Poseidon's Seal — AGA FACH",
  "short_name": "Poseidon's Seal",
  "start_url": "/Poseidon-s-Seal/",
  "scope": "/Poseidon-s-Seal/",
  "display": "standalone",
  "background_color": "#0a1628",
  "theme_color": "#0a1628",
  "icons": [
    { "src": "icono.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

> ⚠️ `start_url` y `scope` deben incluir `/Poseidon-s-Seal/` para que el PWA funcione correctamente al abrir desde QR en dispositivos de terceros.

---

## Protocolo de escaneo de código (para sesiones futuras)

Antes de cualquier diagnóstico, ejecutar en orden:

1. **FASE 0 — Sintaxis:** `const`/`let`/`var` duplicados, llaves sin cerrar, paréntesis descalzados. Si hay SyntaxError → DETENER y reportar como CRÍTICO.
2. **FASE 1 — DOM:** Todo `getElementById` tiene contraparte HTML. Sin IDs huérfanos.
3. **FASE 2 — Flujos de estado:** Trazar cada estado en `setStatusUI()` y verificar botones.
4. **FASE 3 — Guards IDB:** Toda operación IDB tiene `!db` guard + null-check + `tx.onerror`.
5. **FASE 4 — 10 FIX AGA:** Verificar presencia de cada fix en las funciones correspondientes.
6. **FASE 5 — Backlog:** Listar pendientes sin implementar.

---

*Sistema Poseidon's Seal · Academia de Guerra Aérea · Fuerza Aérea de Chile*
*Desarrollado por Víctor Manuel Garcés Borje (Toti's®) · GitHub: vgarcesb-cpu*
