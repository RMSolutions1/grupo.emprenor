type Req = { method?: string; headers?: Record<string, string | string[] | undefined> }
type Res = { setHeader?: (k: string, v: string) => void }

export const CORS_ORIGINS = [
  'https://grupo.emprenor.com',
  'https://www.grupo.emprenor.com',
  'https://www.emprenor.com.ar',
  'https://emprenor.com.ar',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

export function setCors(req: Req, res: Res) {
  const origin = typeof req.headers?.origin === 'string' ? req.headers.origin : ''
  if (CORS_ORIGINS.includes(origin)) {
    res.setHeader?.('Access-Control-Allow-Origin', origin)
    res.setHeader?.('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS')
  }
}
