# 🌊 Sistema Poseidon's Seal
### Academia de Guerra Aérea — Fuerza Aérea de Chile

![Estado](https://img.shields.io/badge/Estado-Producción-green)
![Versión](https://img.shields.io/badge/Versión-2.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Offline--ready-orange)
![Fases](https://img.shields.io/badge/Fases-1%20%2B%202%20%2B%203-gold)

---

## 🔗 Acceso

**URL pública:** [`https://vgarcesb-cpu.github.io/Poseidon-s-Seal/`](https://vgarcesb-cpu.github.io/Poseidon-s-Seal/)

> **Samsung S25:** Menú → Agregar a pantalla de inicio → PWA instalada offline

---

## 📋 Descripción

Sistema de trazabilidad de bienes y materiales de la Academia de Guerra Aérea, FACH. Genera comprobantes físicos (PDF imprimible) con **QR embebido** que enlaza al registro digital. Funciona completamente **offline** en terreno.

El papel impreso con el QR es el puente entre el mundo físico y la memoria digital. Cualquier celular escanea el QR y accede al registro sin login.

---

## 🖥️ Entorno de desarrollo

| Dispositivo | Rol |
|---|---|
| **Mac** | Desarrollo + prueba local (Chrome/Safari + Git) |
| **GitHub Pages** | Validación pública antes del terreno |
| **Samsung S25** | Prueba final en terreno — el juez definitivo |
| **PC Windows** | Consulta e impresión en oficina |
| **WD MyCloud** | Backup automático en red local (Fase 3) |

---

## ⚙️ Funcionalidades completas

| Funcionalidad | Fase | Estado |
|---|---|---|
| Formulario 4 pasos (Datos / Ítems / Firmas / Resumen) | 1 | ✅ |
| IndexedDB — historial persistente en dispositivo | 1 | ✅ |
| Firmas digitales (táctil S25 + mouse Mac) | 1 | ✅ |
| PDF imprimible con QR embebido | 1 | ✅ |
| Estados: EN EMISIÓN → EN CUSTODIA → EN DEVOLUCIÓN → CERRADO | 1 | ✅ |
| Historial con filtros (Todos / Custodia / Devolución / Cerrado) | 1 | ✅ |
| Búsqueda por folio o nombre | 1 | ✅ |
| Exportar / Importar JSON (sync manual Mac ↔ S25) | 1 | ✅ |
| WhatsApp con resumen + URL del QR | 1 | ✅ |
| Modal de confirmación post-guardado (evita pantalla blanca S25) | 1 | ✅ |
| PWA instalable — funciona 100% offline | 1 | ✅ |
| Carga automática por parámetro `?folio=` (QR scan) | 1 | ✅ |
| **Escáner QR con cámara trasera S25** (Html5-QRCode v2.3.8) | **2** | ✅ |
| **Marco animado dorado** en overlay de escaneo | **2** | ✅ |
| **Confirmación de folio** antes de cargar registro | **2** | ✅ |
| **Sync WD MyCloud** — subir / descargar / bidireccional | **3** | ✅ |
| **Auto-sync silencioso** al guardar cada vale | **3** | ✅ |
| **Log de operaciones** en tiempo real (panel Sync) | **3** | ✅ |
| **Detección de red local** — ping antes de operar | **3** | ✅ |

---

## 📁 Estructura del proyecto

```
Poseidon-s-Seal/
├── index.html      ← App completa (single file — 1.700+ líneas)
├── manifest.json   ← PWA instalable en S25
├── sw.js           ← Service Worker — offline garantizado
├── icono.png       ← Escudo AGA FACH + Tridente Poseidón 512×512
└── README.md       ← Este documento
```

---

## 🔄 Flujo de uso completo

```
① CREAR
   Formulario 4 pasos → Datos → Ítems → Firmas → Resumen

② REGISTRAR
   Guardar → Estado: EN CUSTODIA (rojo)
   Modal confirma → Imprimir PDF con QR embebido
   Papel físico archivado

③ EN TERRENO
   Escanear QR del papel → App carga registro automático
   O compartir por WhatsApp → Link directo al registro

④ DEVOLVER
   Registrar Devolución → Estado: EN DEVOLUCIÓN (naranja)
   Imprimir comprobante de devolución

⑤ CERRAR
   Cerrar Vale → Estado: CERRADO (verde)
   Registro archivado permanentemente

⑥ SINCRONIZAR
   Sync MyCloud (si WiFi disponible) → automático al guardar
   O manual: Exportar JSON en Mac → Importar en S25
```

---

## 📄 Encabezado PDF

```
ACADEMIA DE GUERRA AÉREA — SISTEMA POSEIDON'S SEAL
Comprobante de Entrega de Bienes / Materiales
```

El PDF incluye: datos de entrega/recepción, tabla de ítems, firmas digitales, QR con URL del registro y estado con color garantizado en impresión.

---

## 🔗 URL del QR

```
https://vgarcesb-cpu.github.io/Poseidon-s-Seal/?folio=AGA-2026-XXXX
```

Cualquier celular escanea el QR → abre el registro directamente. Sin login, sin restricciones.

---

## ☁️ Sync WD MyCloud

```
Ruta del backup: /Public/Poseidon_Seal/poseidon_backup.json

⬆️ Subir          → vales locales → MyCloud
⬇️ Descargar      → MyCloud → dispositivo
🔄 Bidireccional  → mezcla ambos, gana el más reciente
🔁 Auto-sync      → silencioso al guardar si MyCloud en red
```

---

## 🗺️ Roadmap

- **Fase 1** ✅ App fusión completa — formulario, IDB, firmas, PDF+QR, historial, estados, WhatsApp, PWA
- **Fase 2** ✅ Escáner QR con cámara S25 — Html5-QRCode, overlay animado, confirmación de folio
- **Fase 3** ✅ Sync WD MyCloud — subir / bajar / bidireccional + auto-sync silencioso

---

## 🛡️ Correcciones S25 aplicadas (10 FIX)

| Fix | Descripción |
|---|---|
| FIX-001 | `onerror` en IndexedDB — falla silenciosa en Android |
| FIX-002 | Guard `!db` antes de toda operación IDB |
| FIX-003 | Null-check en registros recuperados de IDB |
| FIX-004 | Canvas medido desde `sig-wrap` (padre), no del canvas |
| FIX-005 | `setTimeout 150ms` antes de `initCanvas` en S25 |
| FIX-006 | `drawImage` con dimensiones explícitas |
| FIX-007 | `try/catch` en `JSON.parse` al importar backup |
| FIX-008 | Limpieza total de campos en `nuevoVale()` |
| FIX-009 | Validación completa de campos por paso |
| FIX-010 | Resize listener para rotación de pantalla S25 |

---

## 🔒 Seguridad y privacidad

- Datos almacenados **solo en el dispositivo** (IndexedDB local)
- Sync MyCloud solo en **red local** — nunca sale a internet
- Sin backend, sin servidor, sin cookies, sin tracking

---

## 🧰 Stack técnico

```
HTML5 + CSS + Vanilla JS    Single file, sin frameworks
IndexedDB                   Persistencia local
Service Worker              Offline completo
QRCode.js (cdnjs)           Generación de QR en PDF
Html5-QRCode (unpkg)        Escáner cámara S25
Tailwind CSS (CDN)          Estilos utilitarios
GitHub Pages                Hosting público gratuito
WD MyCloud API REST         Sync red local (Fase 3)
```

---

*Sistema Poseidon's Seal v2.0.0 — Academia de Guerra Aérea · Fuerza Aérea de Chile · Abril 2026*
