'use client'

import { useState, useEffect } from 'react'

type QuestionType = 'PUBLIC' | 'PRIVATE' | 'PAID'

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

export function QAManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchQuestions()
  }, [filter])

  const fetchQuestions = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/questions' 
        : `/api/questions?status=${filter}`
      const res = await fetch(url)
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

  const handleAnswer = async (questionId: string) => {
    if (!answer.trim()) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer,
          status: selectedQuestion?.questionType === 'PUBLIC' ? 'APPROVED' : selectedQuestion?.status 
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setQuestions(questions.map(q => q.id === questionId ? updated : q))
        setSelectedQuestion(null)
        setAnswer('')
      }
    } catch (error) {
      console.error('Failed to answer question:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (questionId: string, status: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        const updated = await res.json()
        setQuestions(questions.map(q => q.id === questionId ? updated : q))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const getQuestionTypeBadge = (type: QuestionType) => {
    const styles = {
      PUBLIC: 'bg-blue-100 text-blue-800',
      PRIVATE: 'bg-gray-100 text-gray-800',
      PAID: 'bg-purple-100 text-purple-800',
    }
    const labels = {
      PUBLIC: '公开',
      PRIVATE: '私密',
      PAID: '付费私密',
    }
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[type]}`}>
        {labels[type]}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
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
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">筛选：</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部</option>
          <option value="pending">待审核</option>
          <option value="approved">已公开</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {questions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              暂无问题
            </div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {question.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>提问者：{question.author.name}</span>
                      <span>•</span>
                      <span>{new Date(question.createdAt).toLocaleDateString('zh-CN')}</span>
                      {getQuestionTypeBadge(question.questionType)}
                      {question.questionType === 'PUBLIC' && getStatusBadge(question.status)}
                    </div>
                  </div>
                  
                  {question.questionType === 'PUBLIC' && question.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(question.id, 'APPROVED')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleStatusChange(question.id, 'REJECTED')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        拒绝
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{question.content}</p>

                {question.answer ? (
                  <div className={`rounded-lg p-4 ${
                    question.questionType === 'PAID' 
                      ? 'bg-purple-50' 
                      : 'bg-blue-50'
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
                ) : (
                  <div>
                    {selectedQuestion?.id === question.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                          placeholder="输入你的回答..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAnswer(question.id)}
                            disabled={submitting || !answer.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {submitting ? '提交中...' : '提交回答'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuestion(null)
                              setAnswer('')
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedQuestion(question)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        回答这个问题
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
