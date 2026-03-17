'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-700">
            郭大队的博客（测试版）
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/articles" className="text-gray-600 hover:text-blue-600 transition-colors">
              文章
            </Link>
            <Link href="/qa" className="text-gray-600 hover:text-blue-600 transition-colors">
              问答
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              关于
            </Link>

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-blue-200 animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    管理后台
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {session.user?.name || session.user?.email}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
