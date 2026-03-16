import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (!session) {
      // Public can only see approved public questions
      if (question.status !== 'APPROVED' || question.questionType !== 'PUBLIC') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    } else if (session.user.role !== 'ADMIN') {
      // Non-admin can see their own questions and approved public questions
      if (question.authorId !== session.user.id && 
          (question.status !== 'APPROVED' || question.questionType !== 'PUBLIC')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Get question error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { answer, status } = await req.json()

    const question = await prisma.question.findUnique({
      where: { id: params.id },
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    
    if (answer !== undefined) {
      updateData.answer = answer
      updateData.answeredAt = new Date()
    }
    
    if (status) {
      updateData.status = status
    }

    const updated = await prisma.question.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update question error:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}