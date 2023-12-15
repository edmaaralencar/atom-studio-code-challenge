import { EtherealMailProvider } from '@/lib/nodemailer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const { invitedEmail, invitedByEmail, groupName } = body

  const mailProvider = new EtherealMailProvider()

  await mailProvider.sendMail({
    to: invitedEmail,
    groupName,
    invitedByEmail: invitedByEmail,
    invitedEmail,
    subject: `Convite de ${invitedByEmail}`,
  })

  return NextResponse.json({ sucess: true })
}
