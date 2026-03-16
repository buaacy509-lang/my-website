import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { QAManager } from '@/components/admin/qa-manager'

export default async function AdminQAPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin/qa')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">问答管理</h1>
        <p className="text-gray-600 mt-2">审核和回答用户提问</p>
      </div>

      <QAManager />
    </div>
  )
}
