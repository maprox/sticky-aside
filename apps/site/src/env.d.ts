declare module '#site/pages-host.mjs' {
  interface PagesResponse {
    ok: boolean
    json: () => Promise<unknown>
  }

  export function resolvePagesHost(
    env?: Record<string, string | undefined>,
    fetchImpl?: (input: string, init?: RequestInit) => Promise<PagesResponse>,
  ): Promise<{ site: string, base: string, cname: string | null }>
}

interface ImportMetaEnv {
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
