Esse é um projeto desenvolvido para o teste de código da Atom Studio.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Começando

Primeiramente crie um novo app no firebase e habilite a autenticação e crie um novo banco de dados no firebase no modo teste.
Depois, adicione as as variáveis de ambiente para conseguir rodar o app:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Depois, instale as dependências:
```bash
npm install
# or
yarn
```
Depois pode rodar o servidor utilizando:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) com o browser para ver o resultado. 

## Sobre a aplicação
Ao entrar na aplicação, você vai cair na landing page, que não foi feita.
Depois é só fazer o login e você pode utilizar a aplicação, que é um controle de jornadas com grupos.
Você pode criar novos grupos, adicionar amigos e ir visualizando suas atividades individuais bem como a dos outros.

Stack:
- Next.js 13
- Tailwind CSS
- React Hook Form
- Shadcn UI
- React Email
- Nodemailer
- Firebase
- Recharts
- Zod
- Zustand

