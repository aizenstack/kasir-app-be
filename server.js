require('dotenv').config();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const app = require('./src/index');

const PORT = process.env.PORT || 3000;

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

if (process.env.NODE_ENV !== 'production' || process.env.FORCE_LOCAL_SERVER === 'true') {
  app.listen(PORT, () => {
    // console.log('='.repeat(50));
    console.log(` Server is running`);
    // console.log(` Port: ${PORT}`);
    // console.log(` Environment: ${process.env.NODE_ENV}`);
    // console.log(` API Docs: http://localhost:${PORT}/sikas/docs`);
    // console.log('='.repeat(50));
  });
} else {
  console.warn('  Warning: This file is for development only.');
  console.warn('   For production, use src/index.js as serverless function.');
}