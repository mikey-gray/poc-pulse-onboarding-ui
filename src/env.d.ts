/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_CLIENT_ID: string;
  readonly VITE_AZURE_AUTHORITY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}