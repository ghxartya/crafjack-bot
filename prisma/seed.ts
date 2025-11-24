import { UserService } from '@/services/userService'

import { whitelistIds } from '@/config/users'

import { prisma } from '@/lib/prisma'

async function main() {
  for (const id of whitelistIds) await UserService.authenticate(id)
  console.log('Seeded whitelisted Telegram IDs as authenticated users.')
}

main()
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => await prisma.$disconnect())
