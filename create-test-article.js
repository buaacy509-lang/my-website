const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 获取或创建分类
  const category = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: { name: '生活感悟', slug: 'life' }
  })
  
  // 创建管理员用户（如果不存在）
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  
  // 创建文章
  const article = await prisma.article.create({
    data: {
      title: '欢迎来到郭大队的博客',
      content: '祝你们玩的开心！这是我的第一篇博客文章。\n\n在这里，我将分享：\n- 交易经验和心得\n- 市场分析和判断\n- 对世界的思考\n- 生活的点滴感悟',
      slug: 'welcome',
      published: true,
      authorId: admin.id,
      categoryId: category.id
    }
  })
  
  console.log('✅ 文章创建成功:', article.title)
  console.log('✅ 管理员账号: admin@example.com / admin123')
}

main()
  .catch(e => {
    console.error('❌ 错误:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
