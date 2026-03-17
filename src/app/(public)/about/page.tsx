export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">关于我</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="flex items-center justify-center">
          <img
            src="/images/avatar.jpg"
            alt="头像"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">博主</h2>
          <p className="font-bold"><span className="text-red-600">交易爱好者</span><span className="text-blue-600">/前沿技术追踪</span><span className="text-green-600">/宏观市场分析</span></p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            欢迎来到我的个人博客！我是一名交易爱好者，曾经连续亏损7年，两次负债百万，依靠黄金牛市，从3w做到3000w，这个博客是我记录学习历程、分享技术心得的地方。
          </p>
          
          <p>
            在这里，你可以找到：
          </p>

          <p>
            我对宏观判断，市场的分析，世界的思考和人生的感悟。
          </p>

          <p>
            如果你有任何问题或建议，欢迎在问答专区提问，或者通过以下方式联系我：
          </p>
        </div>

        <div className="flex justify-center space-x-6 pt-4">
          <a
            href="mailto:your-email@example.com"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            📧 邮箱
          </a>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            🐙 GitHub
          </a>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            🐦 Twitter
          </a>
        </div>
      </div>
    </div>
  )
}
