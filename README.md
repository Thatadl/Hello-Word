# WTEC ERP

Projeto base em Next.js 14 (App Router) com TypeScript, Tailwind, shadcn/ui, Prisma e PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL

## Configuração

1. Crie o banco no PostgreSQL e defina a variável de ambiente:

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wtec?schema=public"
```

2. Instale as dependências:

```bash
npm install
```

3. Gere o client do Prisma e rode as migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Rode o seed com o usuário admin:

```bash
npm run prisma:seed
```

5. Suba o projeto:

```bash
npm run dev
```

## Comandos úteis

- Prisma Studio: `npm run prisma:studio`
- Lint: `npm run lint`
- Build: `npm run build`
