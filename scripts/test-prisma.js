// 简单的测试脚本
const testPrisma = async () => {
  try {
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    
    console.log('Testing Prisma connection...')
    
    // 尝试查询问题
    const questions = await prisma.question.findMany({
      take: 1,
      include: {
        author: {
          select: { name: true }
        }
      }
    })
    
    console.log('✓ Prisma is working!')
    console.log('Found questions:', questions.length)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('✗ Prisma error:', error.message)
    console.error(error)
  }
}

testPrisma()
