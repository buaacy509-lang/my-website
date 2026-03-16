import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

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

    const { title, content, slug, categoryId, tagIds, published } = await req.json()

    if (!title || !content || !slug || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await prisma.article.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

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
