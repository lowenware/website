import { NextPage } from 'next'
import { site } from '~/config'
import Head from 'next/head'
import { Blog, BlogPostRaw } from '~/modules/blog'
import {
  ContentManager,
  PageProps,
  StaticContent,
  StaticPageMeta,
} from '~/modules/content-manager'
import { Button, PageLayout } from '../components'

interface Home {
  meta: StaticPageMeta
  posts: BlogPostRaw[]
  product:StaticContent[]
}
const Home: NextPage<PageProps<Home>> = ({ menu, social, data }) => {
  const { meta, posts,product } = data

  return (
    <>
      <Head>
        <title>
          {meta.title} - {site.name}
        </title>
      </Head>
      
      <PageLayout className="flex flex-col relative" currentPage="product" links={menu} social={social}>
        <section className='min-h-screen'>

        </section>
      </PageLayout>
    </>
  )
}

export const getStaticProps = async () => {
  const manager = new ContentManager()
  return {
    props: manager.getPageProps({
      meta: manager.page(site.product.slug),
      //TODO Why slug contains .md
      product: manager.readFolderOrdered(['product']),
      posts: new Blog().getRawBlogPosts(site.home.maxBlogPosts),
    }),
  }
}
export default Home
