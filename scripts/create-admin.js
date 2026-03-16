const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || 'Admin'

  if (!email || !password) {
    console.log('Usage: node scripts/create-admin.js <email> <password> [name]')
    process.exit(1)
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    })

    console.log(`✓ 管理员账户创建成功！`)
    console.log(`  邮箱: ${user.email}`)
    console.log(`  密码: ${password}`)
    console.log(`  角色: ${user.role}`)
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
