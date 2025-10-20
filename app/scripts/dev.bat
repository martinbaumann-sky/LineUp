@echo off
call npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js || npx tsx prisma/seed.ts
npm run dev