import Link from 'next/link'
import { prisma } from '@/lib/db'

async function getArticles() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
    },
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
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  
  return articles
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">文章列表</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          分享我的交易经验和生活感悟
        </p>
      </div>

      <div className="grid gap-6">
        {articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无文章
          </div>
        ) : (
          articles.map((article: any) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{article.category?.name}</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                    <span>•</span>
                    <span>{article.viewCount} 阅读</span>
                    <span>•</span>
                    <span>{article._count?.comments || 0} 评论</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {article.tags?.map((tag: any) => (
                      <span
                        key={tag.tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
