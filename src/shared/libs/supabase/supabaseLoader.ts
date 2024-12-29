export interface SupabaseLoaderParams {
  src: string
  width?: number

  quality?: number
}

export default function supabaseLoader({ src, width, quality }: SupabaseLoaderParams) {
  return `${src}?width=${width || 500}&quality=${quality || 75}`
}
