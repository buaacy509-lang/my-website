import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: params.slug },
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
        comments: {
          include: {
            author: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content, categoryId, tagIds, published } = await req.json()

    const existing = await prisma.article.findUnique({
      where: { slug: params.slug },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Delete existing tags and create new ones
    await prisma.articleTag.deleteMany({
      where: { articleId: existing.id },
    })

    const article = await prisma.article.update({
      where: { slug: params.slug },
      data: {
        title,
        content,
        categoryId,
        published,
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

    return NextResponse.json(article)
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const existing = await prisma.article.findUnique({
      where: { slug: params.slug },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    await prisma.article.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: 'Article deleted' })
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
