const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  const username = 'admin';
  const password = 'passwordkuat123'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: 'administrator'
      }
    });
    console.log(' User berhasil dibuat:', {
      id: admin.id,
      username: admin.username,
      role: admin.role
    });
    console.log(' Jangan lupa ganti password setelah login pertama kali!');
  } catch (error) {
    console.error(' Gagal membuat admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();