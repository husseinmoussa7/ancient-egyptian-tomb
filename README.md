# Ancient Egyptian Tomb Explorer

An interactive 3D exploration of an ancient Egyptian burial chamber, built with React Three Fiber.

**[Live Demo](https://husseinmoussa7.github.io/ancient-egyptian-tomb/)**

![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## Features

- **11 interactive artifacts** — click any object to read historical context, fun facts, and material details
- **Reconstruction Mode** — toggle between the original 1320 BCE vibrant colors and the weathered "as discovered" state
- **Cross-Section Mode** — slice through the tomb geometry to reveal interior construction
- **7-stop Guided Tour** — cinematic camera fly-through with narration at each landmark
- **Dual camera modes** — orbit (drag to rotate) and first-person walk (WASD + pointer lock)
- **Torch particle effects** — animated fire particles with organic flicker on all 8 torches
- **Atmospheric rendering** — Bloom + Vignette post-processing, exponential fog, dynamic shadows
- **Leva dev panel** — live-tweak torch intensity, fog density, bloom threshold, and ambient light

## Artifacts

| Artifact | Category | Notes |
|---|---|---|
| Royal Sarcophagus | Funerary | Gold-leaf cedar coffin, 18th Dynasty |
| Canopic Jar of Imsety | Funerary | Human-headed, guards the liver |
| Canopic Jar of Hapy | Funerary | Baboon-headed, guards the lungs |
| Canopic Jar of Duamutef | Funerary | Jackal-headed, guards the stomach |
| Canopic Jar of Qebehsenuef | Funerary | Falcon-headed, guards the intestines |
| Statue of Anubis | Statue | Life-sized jackal guardian, obsidian eyes |
| Eye of Horus Amulet | Amulet | Faience Wedjat with gold inlay |
| Heart Scarab | Amulet | Green jasper, Chapter 30 of the Book of the Dead |
| Royal Treasure Chest | Treasure | Cedar and hammered gold |
| Shabti Worker Figures | Funerary | 365 faience servants, one per day of the year |
| Book of the Dead | Religious | Papyrus scroll with illustrated vignettes |

## Tech Stack

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) — React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) — OrbitControls, PointerLockControls, Html, Stars
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) — Bloom, Vignette
- [Zustand](https://github.com/pmndrs/zustand) — global state management
- [Leva](https://github.com/pmndrs/leva) — dev controls panel
- [Vite](https://vitejs.dev/) + TypeScript + Tailwind CSS

## Getting Started

```bash
# Requires Node 18+
npm install
npm run dev
```
