import { NextResponse } from 'next/server'
import { userFromRequest } from '@/lib/shoppers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req) {
  return NextResponse.json({ user: userFromRequest(req) })
}
