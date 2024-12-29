import { Metadata } from 'next'

interface MetadataProps {
  title: string
  description: string
  path: string
  image?: string
  label1?: {
    name: string
    data: string | number
  }
  label2?: {
    name: string
    data: string | number
  }
  locale?: string
}

const webUrl = process.env.NEXT_PUBLIC_CLIENT_URL

const defaultImage = '/icons/Profile_Icon_1.svg'

export interface MetadataParams {
  params: {
    locale: string
  }
}
export default function getMetadata(props: MetadataProps): Metadata {
  const { title, description: desc, path, image, label1, label2, locale = 'KO' } = props
  const description = `${desc}`

  const images = webUrl + (image ?? defaultImage)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: webUrl + path,
      //  siteName: `${webUrl}`,
      images,
      locale,
    },
    twitter: {
      //  card: 'summary_large_image',
      title,
      description,
      images,
    },
    other: {
      'twitter:label1': label1?.name ?? '',
      'twitter:data1': label1?.data ?? '',
      'twitter:label2': label2?.name ?? '',
      'twitter:data2': label2?.data ?? '',
    },
  }
}
