const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed() {
  try {
    // Create categories
    const categories = [
      { name: '技术', slug: 'tech' },
      { name: '生活', slug: 'life' },
      { name: '随笔', slug: 'essay' },
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    }
    console.log('✓ 分类创建成功')

    // Create tags
    const tags = [
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: '生活感悟', slug: 'thoughts' },
    ]

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      })
    }
    console.log('✓ 标签创建成功')

    // Create sample article
    const techCategory = await prisma.category.findUnique({
      where: { slug: 'tech' },
    })

    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (techCategory && admin) {
      await prisma.article.upsert({
        where: { slug: 'welcome-to-my-blog' },
        update: {},
        create: {
          title: '欢迎来到我的博客',
          content: `# 欢迎来到我的博客

这是我的第一篇博客文章！

## 关于这个博客

这个博客是基于 Next.js 14 构建的，包含以下功能：

- 📝 Markdown 文章支持
- 🏷️ 文章分类和标签
- 💬 评论系统
- ❓ 问答模块
- 🔐 用户认证

## 技术栈

- **前端**: Next.js 14 + React + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: SQLite (可升级为 PostgreSQL)
- **ORM**: Prisma

感谢你的访问！
`,
          slug: 'welcome-to-my-blog',
          published: true,
          viewCount: 0,
          authorId: admin.id,
          categoryId: techCategory.id,
        },
      })
      console.log('✓ 示例文章创建成功')
    }

    console.log('\n🎉 数据初始化完成！')
  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
