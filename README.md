# 🌊 Sistema Poseidon's Seal
### Academia de Guerra Aérea — Fuerza Aérea de Chile

![Estado](https://img.shields.io/badge/Estado-Producción-green)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-Offline--ready-orange)

---

## 🔗 Acceso

**URL pública:** [`https://vgarcesb-cpu.github.io/Poseidon-s-Seal/`](https://vgarcesb-cpu.github.io/Poseidon-s-Seal/)

> Instalar como app en Samsung S25: **Menú → Agregar a pantalla de inicio**

---

## 📋 Descripción

Sistema de trazabilidad de bienes y materiales. Genera comprobantes físicos (PDF imprimible) con **QR embebido** que enlaza al registro digital. Funciona completamente **offline** en terreno.

---

## ⚙️ Funcionalidades — Fase 1

| Funcionalidad | Estado |
|---|---|
| Formulario 4 pasos (Datos / Ítems / Firmas / Resumen) | ✅ |
| IndexedDB — historial persistente en dispositivo | ✅ |
| Firmas digitales (táctil S25 + mouse Mac) | ✅ |
| PDF imprimible con QR embebido | ✅ |
| 3 estados: En Custodia → En Devolución → Cerrado | ✅ |
| Historial con filtros y búsqueda | ✅ |
| Exportar / Importar JSON (sync Mac ↔ S25) | ✅ |
| WhatsApp con URL del QR | ✅ |
| PWA instalable — funciona offline | ✅ |

---

## 📁 Estructura

```
aga-vale/
├── index.html      ← App completa (single file)
├── manifest.json   ← Config PWA
├── sw.js           ← Service Worker offline
├── icono.png       ← Escudo AGA FACH 512×512
└── README.md
```

---

## 🔄 Flujo de uso

```
Crear vale → Firmar → Guardar → Imprimir PDF con QR
→ Papel archivado con QR impreso
→ Escanear QR en terreno → App carga el registro
→ Registrar devolución → Imprimir comprobante
→ 2 papeles + memoria digital permanente
```

---

## 🗺️ Roadmap

- **Fase 1** ✅ App fusión completa (actual)
- **Fase 2** 🔜 Escáner QR con cámara S25 (Html5-QRCode)
- **Fase 3** 🔜 Sync automático WD MyCloud vía API REST red local

---

## 🔒 Seguridad y privacidad

- Datos almacenados **solo en el dispositivo** (IndexedDB local)
- Sin backend, sin servidor, sin cookies
- Backup manual JSON en poder del operador

---

*Sistema desarrollado para uso interno — Academia de Guerra Aérea, FACH*
