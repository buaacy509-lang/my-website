import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const mine = searchParams.get('mine')

    const session = await getServerSession(authOptions)
    const where: any = {}

    // Public questions - only show approved public questions
    if (!session) {
      where.status = 'APPROVED'
      where.questionType = 'PUBLIC'
    } else if (session.user.role !== 'ADMIN') {
      // For non-admin users
      if (mine === 'true') {
        // Show user's own questions
        where.authorId = session.user.id
      } else {
        // Show approved public questions + their own questions
        where.OR = [
          { status: 'APPROVED', questionType: 'PUBLIC' },
          { authorId: session.user.id },
        ]
      }
    }
    // Admin can see all questions

    if (status && session?.user.role === 'ADMIN') {
      where.status = status.toUpperCase()
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Get questions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    console.log('Session:', session)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content, questionType } = await req.json()
    
    console.log('Request body:', { title, content, questionType })

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating question with data:', {
      title,
      content,
      questionType: questionType || 'PUBLIC',
      status: questionType === 'PUBLIC' ? 'PENDING' : 'APPROVED',
      authorId: session.user.id,
    })

    const question = await prisma.question.create({
      data: {
        title,
        content,
        questionType: questionType || 'PUBLIC',
        status: questionType === 'PUBLIC' ? 'PENDING' : 'APPROVED',
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    console.log('Question created successfully:', question.id)

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Create question error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to create question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}