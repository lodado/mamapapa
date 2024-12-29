/* eslint-disable turbo/no-undeclared-env-vars */

/*
import { MetadataRoute } from 'next'

const BASE_PATH = process.env.NEXT_PUBLIC_CLIENT_URL

export const getPosts = () => {
  return fetch(`${BASE_PATH}/api/posts`, {
    next: { revalidate: 60 * 10 }, // 10분 캐시
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject()
      }
      return res.json()
    })
    .catch(() => {
      return []
    })
}

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts: any[] = [] // await getPosts()

  const blogPosts = posts.map((post) => ({
    url: `${BASE_PATH}/${post.id}`,
    lastModified: new Date(),
  }))

  const routes = ['', '/projects'].map((route) => ({
    url: `${BASE_PATH}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogPosts]
}

export default Sitemap
*/
