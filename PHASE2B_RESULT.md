# SIGA Web — Resultado Fase 2B

## Resultado

`G3 = PASS`

Baseline de origen: `SIGA-2A-dee89f97-8032f5c2`.

Fingerprint técnico 2B: `SIGA-2B-432a9499-94600d6a`.

## Archivos modificados

- `vite.config.ts`: queda en Vite estándar con React, Tailwind y alias `@`.
- `index.html`: materializa la metadata histórica y robots sin plugin Figma.
- `package.json`: el script `dev` queda como `vite`; no cambian dependencias.
- `AGENTS.md`: instrucciones operativas React+Vite independientes.

## Archivo añadido

- `public/robots.txt`: conserva exactamente `User-agent: *` y `Disallow: /`.

## Archivos retirados

Los nueve archivos `.figma/make/*`: `analyze-routes`, `deploy`, `deploy-preview`, `dev`, `dev.json`, `format`, `install`, `langserver` y `site.json`.

Sus hashes, efectos y recuperación se documentan en la evidencia 2B. El rollback raíz es el ZIP original con SHA-256 `dee89f97aeb79e73265c1b9def555d92e2676e90a1ac7b400fe19e8eb8c6ec0f`.

## Archivos preservados

- todo `src/`, incluido Mobile y los históricos de `src/imports/pasted_text/*`;
- `pnpm-lock.yaml`;
- `.mise.toml`;
- `CLAUDE.md`;
- `react-router-dom` en package/lock;
- título y descripción históricos `Figma Make App` como `FIX-LATER`, sin inventar branding.

## Dependencias

No se añadió, retiró ni actualizó ninguna dependencia. `pnpm install --frozen-lockfile` pasa con pnpm `10.34.3` bajo Node `22.23.2`.

## Verificación

- B1–B5: build, dev, preview y smoke UI PASS por incremento.
- Regresión integral: 26 escenarios UI; 23 PASS, 3 anomalías `BASELINE/FIX-LATER`, 0 FAIL.
- Los 28 escenarios de reducer de 2A se reutilizan porque el agregado completo de `src/` permanece idéntico.
- JS y robots del build conservan sus hashes 2A.
- HTML y CSS tienen diferencias exclusivamente técnicas, clasificadas y cubiertas por regresión UI.
- Navegación, RBAC, estado, datos demo, Movement, autorizaciones/MFA, stock, alertas, auditoría, responsive y feedback conservan baseline.

## Rollback

- B1: restaurar `index.html`/`vite.config.ts`, retirar `public/robots.txt` y restaurar `site.json`.
- B2: restaurar plugins inline Figma.
- B3: restaurar callback/config Vite y script `dev` inicial.
- B4: extraer `.figma/make/*` del ZIP original validado.
- B5: restaurar `AGENTS.md` inicial.

## Diferencias respecto a 2A

1. Los efectos metadata/robots son explícitos y ya no dependen de `site.json`.
2. Desaparecen Make Kit, overlay replay y refresh fallback exclusivos de Figma.
3. Base, build, dev y preview usan comportamiento Vite estándar.
4. Tailwind deja de generar utilidades descubiertas sólo en literales de la configuración Figma retirada; no hubo regresión visual/funcional.
5. Los wrappers/CLI de `.figma/make` se retiran del proyecto y permanecen recuperables desde la fuente original.

No existe diferencia funcional no clasificada.

## Límite de autorización

Fase 2C no fue iniciada. No se implementó registry, router, división de `AppContext`, migración por features, cambio de dominio, backend/API, limpieza funcional ni modificación Mobile.
