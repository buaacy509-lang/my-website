'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type QuestionType = 'PUBLIC' | 'PAID'

interface Question {
  id: string
  title: string
  content: string
  questionType: QuestionType
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  answer: string | null
  answeredAt: string | null
  createdAt: string
  author: {
    name: string
  }
}

export default function QAPage() {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    questionType: 'PUBLIC' as QuestionType,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [session])

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions')
      if (res.ok) {
        const data = await res.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const newQuestion = await res.json()
        setQuestions([newQuestion, ...questions])
        setFormData({ title: '', content: '', questionType: 'PUBLIC' })
        setShowForm(false)
      } else {
        const data = await res.json()
        setError(data.error || '提交失败，请稍后重试')
      }
    } catch (error) {
      console.error('Failed to create question:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (question: Question) => {
    if (question.questionType === 'PAID') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          付费私密
        </span>
      )
    }
    
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    }
    const labels = {
      PENDING: '审核中',
      APPROVED: '已公开',
      REJECTED: '已拒绝',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[question.status]}`}>
        {labels[question.status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900">问答专区</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          有任何问题都可以在这里提问，我会尽快回复
        </p>
      </div>

      <div className="flex justify-center">
        {session ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            {showForm ? '取消提问' : '我要提问'}
          </button>
        ) : (
          <Link
            href="/login?callbackUrl=/qa"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            登录后提问
          </Link>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-100 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              问题标题
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="简短描述你的问题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              详细描述
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="详细描述你的问题..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              提问类型
            </label>
            <div className="space-y-3">
              <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                <input
                  type="radio"
                  name="questionType"
                  value="PUBLIC"
                  checked={formData.questionType === 'PUBLIC'}
                  onChange={(e) => setFormData({ ...formData, questionType: e.target.value as QuestionType })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">公开提问</span>
                  <span className="block text-sm text-gray-500">需要审核，其他用户可以看到</span>
                </div>
              </label>

              <label className="flex items-start p-4 border border-purple-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all bg-purple-50/10">
                <input
                  type="radio"
                  name="questionType"
                  value="PAID"
                  checked={formData.questionType === 'PAID'}
                  onChange={(e) => setFormData({ ...formData, questionType: e.target.value as QuestionType })}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-medium text-gray-900">私密提问（需要付费）</span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                      优先回答
                    </span>
                  </div>
                  <span className="block text-sm text-gray-500 mt-1">付费后将获得优先回答权限，仅提问者和管理员可见</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-md"
          >
            {submitting ? '提交中...' : formData.questionType === 'PAID' ? '提交并前往支付' : '提交问题'}
          </button>
        </form>
      )}

      <div className="grid gap-6">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md border border-gray-100">
            暂无问题
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {question.title}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(question)}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{question.content}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>提问者：{question.author.name}</span>
                <span>{new Date(question.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>

              {question.answer && (
                <div className={`mt-4 rounded-lg p-4 border-l-4 ${
                  question.questionType === 'PAID' 
                    ? 'bg-purple-50 border-purple-500' 
                    : 'bg-blue-50 border-blue-500'
                }`}>
                  <div className={`text-sm font-medium mb-2 ${
                    question.questionType === 'PAID' ? 'text-purple-900' : 'text-blue-900'
                  }`}>
                    回答：
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{question.answer}</p>
                  {question.answeredAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      回答于 {new Date(question.answeredAt).toLocaleDateString('zh-CN')}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
