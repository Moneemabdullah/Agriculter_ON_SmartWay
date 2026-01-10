/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPEN_WEATHER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
