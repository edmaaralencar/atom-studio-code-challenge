import nodemailer, { Transporter } from 'nodemailer'
import { render } from '@react-email/render'
import InvitationEmailTemplate from '@/lib/react-email'

type MailDTO = {
  to: string
  subject: string
  invitedEmail: string
  invitedByEmail: string
  groupName: string
}

export class EtherealMailProvider {
  private client!: Transporter

  constructor() {
    this.client = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'kellie81@ethereal.email',
        pass: 'J2cMNv3YwfUKFGNe8s',
      },
    })
  }

  async sendMail(data: MailDTO): Promise<void> {
    const emailHtml = render(
      <InvitationEmailTemplate
        invitedByEmail={data.invitedByEmail}
        signUpLink="http://localhost:3000/sign-up"
        invitedEmail={data.invitedEmail}
        projectName={data.groupName}
      />
    )

    const resultMail = await this.client.sendMail({
      to: data.to,
      from: 'EJourney <noreplay@ejourney.com.br>',
      subject: data.subject,
      html: emailHtml,
    })

    console.log('Message sent: %s', resultMail.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(resultMail))
  }
}
