import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin')
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">管理后台</h1>
        <p className="text-gray-600">管理您的博客内容</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/articles"
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">文章管理</div>
          <p className="text-gray-600">创建、编辑和管理文章</p>
        </Link>

        <Link
          href="/admin/qa"
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">问答管理</div>
          <p className="text-gray-600">审核和回答用户提问</p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">分类管理</div>
          <p className="text-gray-600">管理文章分类</p>
        </Link>

        <Link
          href="/admin/tags"
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">标签管理</div>
          <p className="text-gray-600">管理文章标签</p>
        </Link>
      </div>
    </div>
  )
}
