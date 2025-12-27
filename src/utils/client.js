const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Test connection on startup
prisma.$connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(' Prisma Client connected to database');
    }
  })
  .catch((error) => {
    console.error(' Prisma Client connection error:', error.message);
  })

module.exports = prisma

