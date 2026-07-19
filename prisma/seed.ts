import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Vérification de l'environnement
  if (process.env.NODE_ENV === 'production') {
    console.log('❌ Ce script de seed ne peut pas être exécuté en production.');
    process.exit(0);
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Les variables ADMIN_EMAIL et ADMIN_PASSWORD doivent être définies dans .env');
    process.exit(1);
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user "${email}" existe déjà.`);
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const admin = await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  console.log(`✅ Admin user créé : ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
