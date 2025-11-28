import 'dotenv/config'

import { terminal } from '@/helpers/cmd'

import { connectionString, pool } from '@/lib/prisma'

terminal.cmd(
  'connect',
  'tsx prisma/db',
  async () => {
    const client = await pool.connect()

    client.release()
    await pool.end()

    terminal.cautionValue(['DB connection string:', connectionString])
    terminal.informValue(['Is the pool stopping:', pool.ending])

    terminal.informValue(['Is the pool finished:', pool.ended])
    terminal.informValue(['Client`s total count:', pool.totalCount])

    terminal.success('Database connected successfully!', {
      start: true
    })
  },
  { start: true }
)
