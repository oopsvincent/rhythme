// app/api/onboarding/generate/route.ts

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { goal_title, goal_description } = body

    if (!goal_title || typeof goal_title !== 'string' || goal_title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Goal title is required and must be at least 3 characters.' },
        { status: 400 }
      )
    }

    const mlEndpoint = process.env.ML_ENDPOINT
    const apiSecret = process.env.API_SECRET

    if (!mlEndpoint) {
      console.error('ML_ENDPOINT is not configured')
      return NextResponse.json(
        { error: 'Service is temporarily unavailable. Please try again.' },
        { status: 503 }
      )
    }

    const response = await fetch(`${mlEndpoint}/api/v1/onboarding/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': apiSecret ?? '',
      },
      body: JSON.stringify({
        goal_title: goal_title.trim(),
        goal_description: (goal_description ?? '').trim(),
      }),
    })

    if (!response.ok) {
      console.error(`ML endpoint returned ${response.status}: ${response.statusText}`)
      return NextResponse.json(
        { error: 'Failed to generate your plan. Please try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Onboarding generate error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
