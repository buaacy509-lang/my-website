import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/db'
import { Comments } from '@/components/comments'

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true, email: true },
      },
      category: {
        select: { name: true, slug: true },
      },
      tags: {
        include: {
          tag: {
            select: { name: true, slug: true },
          },
        },
      },
      comments: {
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!article) {
    notFound()
  }

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  })

  return article
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <article className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="mb-6">
            <Link
              href="/articles"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              返回文章列表
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{article.category?.name}</span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>•</span>
            <span>{article.viewCount} 阅读</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags?.map((tag: any) => (
              <span
                key={tag.tag.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag.tag.name}
              </span>
            ))}
          </div>

          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <Comments articleId={article.id} comments={article.comments} />
    </div>
  )
}
