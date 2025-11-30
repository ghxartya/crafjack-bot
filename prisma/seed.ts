import { Category } from '@/services/category'
import { Color } from '@/services/color'
import { Size } from '@/services/size'
import { User } from '@/services/user'

import { terminal } from '@/helpers/cmd'

import { categories } from '@/config/categories'
import { colors } from '@/config/colors'
import { sizes } from '@/config/sizes'
import { whitelistIds } from '@/config/users'

import { prisma } from '@/lib/prisma'

async function main() {
  for (const id of whitelistIds) await User.authenticate(id)
  terminal.inform('Seeded user IDs for authenticated users.')
  for (const name of categories) await Category.append(name)
  terminal.inform('Seeded category names as new categories.')
  for (const name of colors) await Color.append(name)
  terminal.inform('Seeded color names as new colors.')
  for (const name of sizes) await Size.append(name)
  terminal.inform('Seeded size names as new sizes.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    terminal.success('Database seeded successfully!', {
      start: true
    })
  })
  .catch(async error => {
    terminal.failureMessage(error)
    await prisma.$disconnect()
    process.exit(1)
  })
