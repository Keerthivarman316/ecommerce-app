## Setup

1. Install dependencies:
   npm install

2. Start PostgreSQL:
   docker-compose up -d

3. Push schema to database:
   npx prisma db push

4. Generate Prisma Client:
   npx prisma generate

5. Start development:
   npm run dev
