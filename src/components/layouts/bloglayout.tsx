import Link from 'next/link'
import { site } from '~/config'
import { BlogPostMeta, Tag } from '~/modules/blog'
import {
  ContentManager,
  SocialMeta,
  StaticPageMeta,
} from '~/modules/content-manager'
import { BlogPosts } from '../blog'

// import {BlogPosts} from "./blog-posts";
import { PageLayout } from './pagelayout'

interface BlogProps {
  posts: BlogPostMeta[]
  totalPages: number
  page: number
  tags: Tag[]
  tag?: string
}

interface BlogLayoutProps {
  menu: StaticPageMeta[]
  social: SocialMeta[]
  blog: BlogProps
  tags:Tag[]
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  menu,
  social,
  blog
}) => {
  const root = ContentManager.root(menu, site.blog.slug)
  const { posts, totalPages, page, tag, tags } = blog
  
  return (
    <PageLayout className='min-h-screen' currentPage={site.blog.slug} links={menu} social={social}>
    <section className="w-full px-16 space-y-16">
      <h2>
        Blog
        {tag && (
          <span className="text-blue">
            <span className="ml-8">#</span>{tag}
          </span>
        )}
      </h2>

        <div className='flex flex-col md:flex-row space-y-16'>
        <div className='w-full lg:w-1/4 lg:pr-16'>
        <p className='uppercase'>
        Tags
            </p>
            <ul className=''>
            {tags.map((tag)=>{
              return <li key={tag.label} className="flex space-x-2"><a className='text-blue hover:text-dark duration-500' href={`${root.url}/${tag.label}`}>{tag.label}</a><span className='text-grey-600'>[{tag.count}]</span></li>
            })}
            </ul>
        </div>
        <BlogPosts posts={posts} className="w-full min-h-min -mt-32" />
        </div>
      </section>

     

      {/* <Paginator
        className="my-24"
        page={page}
        totalPages={totalPages}
        root={tag ? `${root.url}/${tag}` : root.url}
      /> */}
    </PageLayout>
  )
}
