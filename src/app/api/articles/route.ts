import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

// 生成 slug 的辅助函数
function generateSlug(title: string): string {
  // 转换为小写，替换空格为连字符，移除特殊字符
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

// 获取唯一的 slug
async function getUniqueSlug(title: string): Promise<string> {
  let slug = generateSlug(title)
  let counter = 1
  
  // 检查 slug 是否已存在
  while (await prisma.article.findUnique({ where: { slug } })) {
    // 如果存在，添加数字后缀
    slug = `${generateSlug(title)}-${counter}`
    counter++
  }
  
  return slug
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const published = searchParams.get('published')

    const where: any = {}

    if (category) {
      where.category = { slug: category }
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } }
    }

    if (published === 'true') {
      where.published = true
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true },
        },
        category: {
          select: { name: true, slug: true },
        },
        tags: {
          include: {
            tag: {
              select: { name: true, slug: true },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content, categoryId, tagIds, published } = await req.json()

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 自动生成唯一的 slug
    const slug = await getUniqueSlug(title)

    const article = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        categoryId,
        published: published || false,
        authorId: session.user.id,
        tags: {
          create: tagIds?.map((tagId: string) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}