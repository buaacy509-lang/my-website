'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  published: boolean
  viewCount: number
  createdAt: string
  category: {
    name: string
  }
  _count: {
    comments: number
  }
}

export function ArticlesManager() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles')
      if (res.ok) {
        const data = await res.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setArticles(articles.filter(a => a.slug !== slug))
      }
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              标题
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              分类
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              状态
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              阅读量
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              评论
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                暂无文章
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr key={article.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {article.title}
                  </div>
                  <div className="text-sm text-gray-500">{article.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">{article.category?.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      article.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {article.published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.viewCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article._count?.comments || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      查看
                    </Link>
                    <Link
                      href={`/admin/articles/edit/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(article.slug)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
