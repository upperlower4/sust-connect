import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET() {
  const supabase = createClient()
  // Fetch SUST notice page
  const response = await fetch('https://www.sust.edu/notice')
  const html = await response.text()
  const $ = cheerio.load(html)
  const notices: any[] = []
  $('.notice-item').each((i, el) => {
    const title = $(el).find('.title').text().trim()
    const date = $(el).find('.date').text().trim()
    notices.push({ title, date })
  })
  for (const notice of notices) {
    await supabase.from('posts').insert({
      user_id: 'system', // You need a system user in profiles
      type: 'notice',
      content: notice.title,
      deadline: notice.date,
    })
  }
  return NextResponse.json({ count: notices.length })
}
