import { prisma } from '@/lib/prisma'

async function main() {
  const allowedIds = [
    403519902n,
    536012447n,
    622291718n,
    631410667n,
    980946239n
  ]

  for (const id of allowedIds)
    await prisma.user.upsert({
      where: { telegramId: id },
      update: { isAuthenticated: true },
      create: { telegramId: id, isAuthenticated: true }
    })

  console.log(
    'Seeded allowed Telegram IDs as authenticated users. (Разрешено использование идентификаторов Telegram в качестве аутентифицированных пользователей.)'
  )
}

main()
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
