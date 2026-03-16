import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { ArticlesManager } from '@/components/admin/articles-manager'

export default async function AdminArticlesPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin/articles')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
        <a
          href="/admin/articles/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          新建文章
        </a>
      </div>

      <ArticlesManager />
    </div>
  )
}
