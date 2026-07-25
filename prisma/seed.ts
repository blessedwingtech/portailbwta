import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = process.env.ADMIN_PASSWORD || '12345678';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  const executiveAccounts = [
    {
      email: 'admin@bittonik.com',
      name: 'Admin Système BWTA',
      role: 'ADMIN',
    },
    {
      email: 'admin@bwta.bittonik.com',
      name: 'Admin Principal',
      role: 'ADMIN',
    },
    {
      email: 'president@bittonik.com',
      name: 'Bentzky Louis (Président)',
      role: 'PRESIDENT',
    },
    {
      email: 'secretaire@bittonik.com',
      name: 'Secrétariat Général BWTA',
      role: 'SECRETAIRE',
    },
    {
      email: 'tresorier@bittonik.com',
      name: 'Trésorerie Centrale BWTA',
      role: 'TRESORIER',
    },
  ];

  console.log('🔄 Initialisation / Vérification des comptes exécutifs de test BWTA...');

  for (const acc of executiveAccounts) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: acc.email },
    });

    if (existing) {
      await prisma.adminUser.update({
        where: { email: acc.email },
        data: {
          name: acc.name,
          role: acc.role,
          active: true,
          passwordHash: passwordHash,
        }
      });
      console.log(`✔ Compte existant mis à jour : ${acc.email} [Rôle: ${acc.role}]`);
    } else {
      await prisma.adminUser.create({
        data: {
          email: acc.email,
          name: acc.name,
          role: acc.role,
          active: true,
          passwordHash,
        },
      });
      console.log(`✨ Nouveau compte créé : ${acc.email} [Rôle: ${acc.role}] (Mot de passe: ${defaultPassword})`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🎉 Seeding des comptes exécutifs terminé avec succès !');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
