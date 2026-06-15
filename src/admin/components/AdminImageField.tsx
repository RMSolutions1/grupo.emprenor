import { useRef, useState } from 'react'
import { isValidImageUrl, uploadMedia } from '../../lib/media'
import { AdminInput } from './AdminUI'

type Mode = 'upload' | 'url'

export function AdminImageField({ label, value, onChange, folder = 'uploads' }: {
  label: string
  value: string
  onChange: (v: string) => void
  folder?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>('upload')
  const [urlDraft, setUrlDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyUrl = (raw: string) => {
    const v = raw.trim()
    if (!v) {
      setError('Ingrese una dirección de imagen.')
      return
    }
    if (!isValidImageUrl(v)) {
      setError('La URL no es válida. Debe empezar con http://, https:// o /')
      return
    }
    setError(null)
    onChange(v)
    setUrlDraft(v)
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError(null)
    const { url, error: err } = await uploadMedia(file, folder)
    setUploading(false)
    if (err) {
      setError(err)
      return
    }
    if (url) {
      onChange(url)
      setUrlDraft(url)
    }
  }

  return (
    <div className="block md:col-span-2">
      <span className="block text-xs font-body font-medium text-foreground-600 mb-2">{label}</span>

      <div className="rounded-xl border border-background-200 bg-background-50 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="w-full sm:w-36 h-36 shrink-0 rounded-lg border border-background-200 bg-white flex items-center justify-center overflow-hidden">
            {value ? (
              <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
            ) : (
              <div className="text-center px-3">
                <i className="ri-image-line text-3xl text-foreground-300" />
                <p className="text-[10px] font-body text-foreground-400 mt-1">Sin imagen</p>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`px-3 h-8 rounded-lg text-xs font-body font-medium transition-colors ${mode === 'upload' ? 'bg-accent-500 text-white' : 'bg-white border border-background-300 text-foreground-600 hover:bg-background-100'}`}
              >
                <i className="ri-upload-2-line mr-1" /> Desde mi PC
              </button>
              <button
                type="button"
                onClick={() => { setMode('url'); setUrlDraft(value) }}
                className={`px-3 h-8 rounded-lg text-xs font-body font-medium transition-colors ${mode === 'url' ? 'bg-accent-500 text-white' : 'bg-white border border-background-300 text-foreground-600 hover:bg-background-100'}`}
              >
                <i className="ri-link mr-1" /> Desde URL
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setUrlDraft(''); setError(null) }}
                  className="px-3 h-8 rounded-lg text-xs font-body font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Quitar
                </button>
              )}
            </div>

            {mode === 'upload' ? (
              <div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-body font-medium disabled:opacity-60 transition-colors"
                >
                  {uploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Subiendo…
                    </>
                  ) : (
                    <>
                      <i className="ri-folder-image-line" />
                      Elegir imagen de mi computadora
                    </>
                  )}
                </button>
                <p className="text-[11px] font-body text-foreground-400 mt-2">JPG, PNG, WebP o GIF · máximo 8 MB</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <AdminInput
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyUrl(urlDraft) } }}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => applyUrl(urlDraft)}
                  className="shrink-0 px-4 h-10 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-body font-medium"
                >
                  Usar URL
                </button>
              </div>
            )}

            {value && (
              <p className="text-[11px] font-body text-foreground-400 break-all line-clamp-2" title={value}>{value}</p>
            )}
          </div>
        </div>

        {error && (
          <p className="px-4 py-2 text-xs font-body text-red-700 bg-red-50 border-t border-red-100">{error}</p>
        )}
      </div>
    </div>
  )
}
