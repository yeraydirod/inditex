# 🎧 Podcaster

Mini-aplicación **SPA** para escuchar podcasts musicales, desarrollada como prueba técnica front-end para **Inditex**.

Muestra los 100 podcasts musicales más populares de Apple, permite filtrarlos al instante, consultar el detalle de cada podcast con sus episodios y escuchar cualquier episodio con el reproductor nativo de HTML5.

- ⚙️ **Webpack 5 configurado desde cero** (sin create-react-app, Vite ni similares).
- 🧱 **Arquitectura hexagonal orientada a features** (dominio, aplicación, infraestructura y UI por feature).
- 🟦 **TypeScript** en modo `strict`.
- 🎨 **CSS nativo** (CSS Modules y custom properties), sin librerías de estilos.
- ✅ **Tests unitarios y de integración** con Jest y Testing Library, y **tests e2e** con Cypress.

---

## Índice

1. [Requisitos previos](#requisitos-previos)
2. [Puesta en marcha rápida](#puesta-en-marcha-rápida)
3. [Modos de ejecución: development y production](#modos-de-ejecución-development-y-production)
4. [Scripts disponibles](#scripts-disponibles)
5. [Tests](#tests)
6. [Arquitectura](#arquitectura)
7. [Decisiones técnicas](#decisiones-técnicas)
8. [Stack y versiones](#stack-y-versiones)
9. [Historial del desarrollo (tags)](#historial-del-desarrollo-tags)

---

## Requisitos previos

| Herramienta   | Versión mínima                  | Notas                                                                             |
| ------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| **Node.js**   | `20.19.0` (recomendada: `24`)   | Babel 8 y React Router 7 lo exigen. El repo incluye un `.nvmrc` → `nvm use`.      |
| **npm**       | `10.0.0`                        | Se incluye `package-lock.json` para tener instalaciones reproducibles (`npm ci`). |
| **Navegador** | Última versión de Google Chrome | Es el único navegador objetivo del enunciado (solo escritorio).                   |
| **Git**       | Cualquier versión reciente      | Para clonar el repositorio.                                                       |

> La primera instalación descarga también el binario de Cypress (unos cientos de MB), que se guarda en la caché del usuario.

## Puesta en marcha rápida

```bash
git clone <url-del-repositorio> podcaster
cd podcaster
nvm use
npm ci
```

Para arrancar en **modo desarrollo** (http://localhost:3000):

```bash
npm run dev
```

Para arrancar en **modo producción** (build minimizado servido en http://localhost:3000):

```bash
npm start
```

## Modos de ejecución: development y production

El enunciado pide dos modos. Los dos comparten el mismo `webpack.config.js`, que cambia de comportamiento según `--mode`:

| Aspecto            | `development` (`npm run dev`)                          | `production` (`npm start`)                                               |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| JavaScript         | Concatenado en un único bundle **sin minimizar**       | Concatenado, **minimizado** con Terser y separado en `vendor`/`main`     |
| CSS                | Inyectado con `style-loader`, sin minimizar            | Extraído a un `.css` y **minimizado** con cssnano                        |
| Nombres de fichero | `js/main.js`                                           | Con hash de contenido (`js/main.[hash].js`) para caché de larga duración |
| Source maps        | `cheap-module-source-map` (bundle legible, sin `eval`) | `source-map` en ficheros separados                                       |
| Servidor           | `webpack-dev-server` con HMR                           | `serve` estático sobre `dist/`                                           |
| URLs limpias       | `historyApiFallback: true`                             | `serve --single` (fallback a `index.html`)                               |

Se puede generar el build de cualquiera de los dos modos sin servirlo con `npm run build` (producción) o `npm run build:dev` (desarrollo). El resultado queda en `dist/`.

### Variable de entorno opcional: `CORS_PROXY_URL`

Hoy en día los endpoints de iTunes devuelven `Access-Control-Allow-Origin: *`, así que la aplicación los consume directamente. Si en algún momento dejaran de hacerlo, se puede activar un proxy CORS **sin tocar código**, ya que basta con un prefijo al que se le concatena la URL codificada:

```bash
CORS_PROXY_URL="https://api.allorigins.win/raw?url=" npm run dev
```

## Scripts disponibles

| Script                  | Descripción                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run dev`           | Arranca el servidor de desarrollo con HMR en http://localhost:3000.                             |
| `npm start`             | Genera el build de producción y lo sirve en http://localhost:3000.                              |
| `npm run build`         | Build de **producción** en `dist/` (concatenado y minimizado).                                  |
| `npm run build:dev`     | Build de **desarrollo** en `dist/` (concatenado, sin minimizar).                                |
| `npm run serve`         | Sirve el contenido actual de `dist/` en http://localhost:3000 (con fallback SPA).               |
| `npm test`              | Ejecuta los tests unitarios y de integración (Jest).                                            |
| `npm run test:watch`    | Jest en modo _watch_.                                                                           |
| `npm run test:coverage` | Jest con informe de cobertura en `coverage/`.                                                   |
| `npm run test:e2e`      | Genera el build de producción, lo sirve en el puerto 4000 y ejecuta Cypress en modo _headless_. |
| `npm run cy:open`       | Abre la interfaz de Cypress (necesita la app levantada en el puerto 4000: `npm run serve:e2e`). |
| `npm run cy:run`        | Ejecuta Cypress _headless_ contra una app ya levantada.                                         |
| `npm run serve:e2e`     | Genera el build de producción y lo sirve en http://localhost:4000 para Cypress.                 |
| `npm run test:all`      | Lint, comprobación de tipos, tests unitarios y e2e (lo mismo que la CI).                        |
| `npm run lint`          | ESLint (TypeScript, React y React Hooks).                                                       |
| `npm run lint:fix`      | ESLint con autocorrección.                                                                      |
| `npm run format`        | Formatea el proyecto con Prettier.                                                              |
| `npm run format:check`  | Comprueba el formato sin modificar ficheros.                                                    |
| `npm run typecheck`     | Comprueba los tipos de la app y de los tests de Cypress con `tsc`.                              |

## Tests

### Unitarios e integración (Jest + Testing Library)

```bash
npm test
npm run test:coverage
```

- **Dominio**: entidades y _value objects_ (`Podcast.matches`, `Duration.format`, `PodcastDetail`…).
- **Aplicación**: casos de uso con repositorios falsos (`GetTopPodcasts`, `GetPodcastDetail`, `GetEpisodeDetail`, `filterPodcasts`).
- **Infraestructura**: mappers de los DTO de iTunes, repositorios, decoradores de caché, `LocalStorageCache` (caducidad con un reloj falso y gestión de cuota) y clientes HTTP.
- **UI**: cada vista se prueba sobre el **router real** (`createMemoryRouter`) y los **casos de uso reales**, con repositorios en memoria. Se cubren el filtrado inmediato, la navegación, el indicador de carga, el HTML interpretado y saneado, y el log de errores en consola.

Al cierre de la prueba hay **60 tests** y una cobertura de **~94 % de líneas**.

### End-to-end (Cypress)

```bash
npm run test:e2e
```

Se ejecutan contra el **build de producción**. Las llamadas a iTunes se interceptan con _fixtures_ (`cypress/fixtures`) para que los tests sean deterministas y no dependan de la red. Se comprueba lo siguiente:

- El listado, el contador y el filtrado inmediato por título y autor.
- Que el listado queda guardado en cliente y no se vuelve a pedir al recargar, y que sí se vuelve a pedir cuando han pasado más de 24 h.
- El flujo completo listado → podcast → episodio → podcast → inicio, comprobando que **no se recarga el documento** y que el **indicador de navegación** aparece y desaparece.
- Los _deep links_ con URLs limpias, como `/podcast/:id/episode/:id`.

> Gracias a los tests e2e se detectó que el build de producción usaba el runtime JSX de desarrollo (Babel 8 usa `development` por defecto). Está corregido en el commit `fix(build)`.

## Arquitectura

El código sigue una **arquitectura hexagonal (puertos y adaptadores) organizada por features**. Cada feature tiene sus propias capas, y las dependencias apuntan siempre hacia el dominio:

```
UI (React)  ──▶  Aplicación (casos de uso)  ──▶  Dominio (entidades + puertos)
                                                        ▲
                         Infraestructura (adaptadores) ─┘  implementa los puertos
```

```
src/
├── app/                         # Composition root y shell de la aplicación
│   ├── container.ts             #   Inyección de dependencias manual (adaptadores → casos de uso)
│   ├── routes.tsx               #   Definición de rutas, loaders y layouts
│   ├── RootLayout.tsx           #   Cabecera + indicador de navegación + <Outlet/>
│   ├── RouteError.tsx           #   Errores → console.error (según el enunciado)
│   └── styles/global.css        #   Reset y design tokens (custom properties)
│
├── features/
│   ├── podcasts/                # Feature: vista principal
│   │   ├── domain/              #   Podcast (entidad), PodcastRepository (puerto)
│   │   ├── application/         #   GetTopPodcasts, filterPodcasts
│   │   ├── infrastructure/      #   ItunesPodcastRepository, CachedPodcastRepository, DTO + mapper
│   │   └── ui/                  #   PodcastsPage, PodcastCard, PodcastFilter, loader
│   │
│   └── podcast-detail/          # Feature: detalle de podcast y de episodio
│       ├── domain/              #   PodcastDetail, Episode, Duration (VO), errores, puerto
│       ├── application/         #   GetPodcastDetail, GetEpisodeDetail
│       ├── infrastructure/      #   ItunesPodcastDetailRepository, CachedPodcastDetailRepository
│       └── ui/                  #   PodcastLayout, PodcastSidebar, PodcastDetailPage, EpisodeDetailPage
│
├── shared/                      # Piezas transversales sin lógica de negocio
│   ├── domain/                  #   Clock (puerto), normalizeText
│   ├── infrastructure/          #   HttpClient (Fetch y proxy CORS), LocalStorageCache, SystemClock
│   └── ui/                      #   Header, LoadingIndicator, Card
│
└── test/                        # Object mothers, fakes y helper para renderizar rutas
```

### Puntos clave

- **Entidades con comportamiento**: `Podcast.matches(term)` sabe si coincide con un filtro, `PodcastDetail.findEpisode(id)` busca un episodio y `Duration.format()` devuelve `HH:MM:SS` o `MM:SS`. Todas exponen `toPrimitives()` y `fromPrimitives()` para serializarse en la caché sin filtrar detalles de la infraestructura.
- **Puertos y adaptadores**: el dominio define `PodcastRepository` y `PodcastDetailRepository`. iTunes es solo un adaptador (`Itunes*Repository`) que convierte los DTO en entidades mediante _mappers_.
- **Caché como decorador**: `Cached*Repository` envuelve al repositorio real e implementa el mismo puerto (patrón Decorator), así que ni los casos de uso ni la UI saben que existe una caché.
- **Composition root**: `app/container.ts` es el único sitio donde se instancian las clases concretas. En los tests se monta un contenedor con repositorios en memoria y los mismos casos de uso.
- **La UI solo habla con casos de uso**: los _loaders_ del router invocan los casos de uso del contenedor, y los componentes reciben entidades del dominio.

## Decisiones técnicas

| Requisito del enunciado                                             | Solución                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SPA con navegación en cliente y **URLs limpias** (sin `#`)          | React Router 7 en modo _data router_ (`createBrowserRouter`), con History API y _fallback_ a `index.html` en ambos servidores.                                                                                                             |
| **Indicador de navegación** en la esquina superior derecha          | Los datos de cada vista se cargan en _loaders_ del router, así que `useNavigation().state` refleja exactamente el ciclo «inicio → fin de la transición». Durante la carga inicial lo muestra el `hydrateFallbackElement`.                  |
| Guardar el listado y el detalle **durante un día**                  | `LocalStorageCache` guarda `{ storedAt, value }` con un TTL de 24 h y un `Clock` inyectable (testeable). Las entradas caducadas o corruptas se descartan. Si se llena la cuota, se purgan las caducadas y se reintenta.                    |
| Filtrado **inmediato** por título y autor                           | Estado local y `useMemo` sobre `filterPodcasts`. Ignora mayúsculas, tildes y espacios.                                                                                                                                                     |
| Descripción del podcast en la barra lateral                         | El endpoint `lookup` no devuelve la descripción, así que `GetPodcastDetail` la completa con el `summary` del listado de populares (que ya está en caché).                                                                                  |
| Número de episodios                                                 | Se muestra `trackCount`, el total real de episodios del podcast. El listado muestra los 20 más recientes, que es el `limit=20` del endpoint indicado.                                                                                      |
| Descripciones de episodio con **HTML interpretado**                 | Se renderiza con `dangerouslySetInnerHTML`, siempre **saneado con DOMPurify** para evitar XSS. Las descripciones en texto plano conservan sus saltos de línea.                                                                             |
| Errores solo en consola                                             | Cualquier error de un _loader_ llega al `errorElement`, que hace `console.error(error)` (mensaje y traza) sin mostrar ninguna UI de error.                                                                                                 |
| Assets sin minimizar en `development` y minimizados en `production` | Ver [Modos de ejecución](#modos-de-ejecución-development-y-production).                                                                                                                                                                    |
| Recursos sin CORS (allorigins)                                      | iTunes ya envía cabeceras CORS y `allorigins.win` respondía con `522` durante el desarrollo, así que por defecto se llama directamente. El proxy sigue disponible como decorador (`CorsProxyHttpClient`) y se activa con `CORS_PROXY_URL`. |
| CSS                                                                 | CSS nativo con **CSS Modules** (estilos encapsulados por componente) y **custom properties** como _design tokens_. Sin preprocesadores ni librerías.                                                                                       |

## Stack y versiones

| Ámbito   | Herramientas                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------- |
| UI       | React 19, React Router 7, DOMPurify 3                                                                    |
| Lenguaje | TypeScript 5.9 (`strict`)                                                                                |
| Build    | Webpack 5, webpack-dev-server 5, Babel 8 (preset-env/react/typescript), fork-ts-checker, Terser, cssnano |
| Estilos  | CSS nativo, CSS Modules (css-loader), mini-css-extract-plugin                                            |
| Tests    | Jest 30, Testing Library (React, user-event, jest-dom), Cypress 15, start-server-and-test                |
| Calidad  | ESLint 9 (typescript-eslint, react, react-hooks), Prettier 3, GitHub Actions                             |

Las versiones exactas están en `package.json` y fijadas en `package-lock.json`.

## Historial del desarrollo (tags)

Cada paso relevante está etiquetado, como pide el enunciado. Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/).

| Tag      | Paso                                                                    |
| -------- | ----------------------------------------------------------------------- |
| `v0.1.0` | Repositorio inicial (`.gitignore`, `.nvmrc`, `.editorconfig`)           |
| `v0.2.0` | Webpack + Babel + TypeScript + React configurados desde cero (dev/prod) |
| `v0.3.0` | ESLint, Prettier y Jest + Testing Library                               |
| `v0.4.0` | Dominio, casos de uso e infraestructura (hexagonal) con tests           |
| `v0.5.0` | Router, cabecera con indicador de navegación y las tres vistas          |
| `v0.6.0` | Tests end-to-end con Cypress y corrección del build de producción       |
| `v1.0.0` | Documentación completa y CI                                             |

```bash
git tag -n          # lista los tags con su descripción
git checkout v0.4.0 # para ver el estado del proyecto en un paso concreto
```
