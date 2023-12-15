import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface InvitationEmailTemplateProps {
  invitedByEmail?: string
  projectName?: string
  signUpLink?: string
  invitedEmail?: string
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ''

const InvitationEmailTemplate = ({
  invitedByEmail = 'edmar@gmail.com',
  projectName = 'EVIS',
  signUpLink = `http://localhost:3000/sign-in?invitation=`,
  invitedEmail = 'João Marcos',
}: InvitationEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Entre no grupo {projectName}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Heading className='text-[32px] font-bold text-black my-0 mx-auto'>EJourney</Heading>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Faça parte do grupo <strong>{projectName}</strong> no{' '}
              <strong>EJourney</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {invitedEmail},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong className="text-blue-600"> ({invitedByEmail}) </strong>
              convidou você para o grupo <strong>
                {projectName}
              </strong> no <strong>EJourney</strong>.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] px-4 py-3 rounded text-white text-[12px] font-semibold no-underline text-center"
                href={signUpLink}
              >
                Entre no grupo
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              ou copie e cole a seguinte URL no browser:{' '}
              <Link href={signUpLink} className="text-blue-600 no-underline">
                {signUpLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default InvitationEmailTemplate
