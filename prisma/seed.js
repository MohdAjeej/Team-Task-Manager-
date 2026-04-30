import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const users = [
    {
      name: 'John Doe',
      email: 'john@test.com',
      password: await bcrypt.hash('test123', 10),
      role: 'MEMBER'
    },
    {
      name: 'Jane Smith',
      email: 'jane@test.com',
      password: await bcrypt.hash('test123', 10),
      role: 'MEMBER'
    },
    {
      name: 'Bob Wilson',
      email: 'bob@test.com',
      password: await bcrypt.hash('test123', 10),
      role: 'MEMBER'
    },
    {
      name: 'Alice Johnson',
      email: 'alice@test.com',
      password: await bcrypt.hash('test123', 10),
      role: 'ADMIN'
    }
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: userData
      });
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
