export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">关于我</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
            👨‍💻
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">博主</h2>
          <p className="text-gray-600">全栈开发者 / 技术爱好者</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            欢迎来到我的个人博客！我是一名热爱技术的开发者，这个博客是我记录学习历程、分享技术心得的地方。
          </p>
          
          <p>
            在这里，你可以找到：
          </p>
          
          <ul>
            <li>前端开发技术分享（React、Vue、Next.js等）</li>
            <li>后端开发经验（Node.js、数据库设计等）</li>
            <li>开发工具和工作流程优化</li>
            <li>技术问题的解决方案</li>
          </ul>

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
