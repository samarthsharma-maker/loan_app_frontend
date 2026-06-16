/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the LoanHub Spring Boot API (e.g. http://localhost:8080/api, or /api behind nginx). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
