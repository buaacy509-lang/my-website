'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string
  }
}

interface CommentsProps {
  articleId: string
  comments: Comment[]
}

export function Comments({ articleId, comments: initialComments }: CommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          articleId,
        }),
      })

      if (res.ok) {
        const comment = await res.json()
        setComments([comment, ...comments])
        setNewComment('')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        评论 ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? '发布中...' : '发布评论'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600">
            请{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              登录
            </Link>{' '}
            后发表评论
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无评论，来发表第一条评论吧！</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {comment.author.name}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
