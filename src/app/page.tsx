import Link from 'next/link'
import { prisma } from '@/lib/db'

async function getLatestArticles() {
  const articles = await prisma.article.findMany({
    where: {
      published: true,
    },
    include: {
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
  
  return articles
}

export default async function HomePage() {
  const articles = await getLatestArticles()

  return (
    <div className="space-y-0">
      {/* Hero Section with Blue Gradient */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 -mx-4 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold">
            欢迎来到郭大队的博客
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            在这里，分享我的交易经验、对世界的思考。你可以向我提问。
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <Link
              href="/articles"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              浏览文章
            </Link>
            <Link
              href="/qa"
              className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              问答专区
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
          <Link
            href="/articles"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            查看全部 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </Link>
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
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                    {article.title}
                  </h3>
                </Link>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{article.category?.name}</span>
                  <span>•</span>
                  <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                  <span>•</span>
                  <span>{article.viewCount} 阅读</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">交易文章</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              分享交易经验、市场分析和投资策略。涵盖技术分析、基本面分析和风险管理等多个领域。
            </p>
            <Link
              href="/articles"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              阅读文章 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">问答互动</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              有任何交易问题或生活困惑？欢迎在问答专区提问，我会尽力为你解答。
            </p>
            <Link
              href="/qa"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              去提问 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
