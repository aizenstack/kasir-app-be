require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {

  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin';
  const role = process.argv[4] || 'administrator';

  // Validasi role
  if (role !== 'administrator' && role !== 'petugas') {
    console.error('❌ Error: Role harus "administrator" atau "petugas"');
    process.exit(1);
  }

  try {

    const existingUser = await prisma.users.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.error(`❌ Error: Username "${username}" sudah ada!`);
      console.log('   Gunakan username lain atau hapus user yang sudah ada terlebih dahulu.');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: role
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    });

    console.log('\n✅ User berhasil dibuat!');
    console.log('='.repeat(50));
    console.log('📋 Detail User:');
    console.log(`   ID       : ${user.id}`);
    console.log(`   Username : ${user.username}`);
    console.log(`   Role     : ${user.role}`);
    console.log(`   Created  : ${user.createdAt}`);
    console.log('='.repeat(50));
    console.log(`\n🔐 Login dengan:`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  PENTING: Ganti password setelah login pertama kali!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Gagal membuat user:', error.message);
    
    if (error.code === 'P2002') {
      console.error('   Username sudah digunakan!');
    } else if (error.code === 'P1001') {
      console.error('   Tidak dapat terhubung ke database!');
      console.error('   Pastikan DATABASE_URL sudah benar di file .env');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan script
createAdmin();