import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@bwta.bittonik.com'
  const password = 'adminpassword' // CHANGE THIS IN PRODUCTION

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('Admin user already exists.')
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash
    }
  })

  console.log(`Admin user created: ${admin.email}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
