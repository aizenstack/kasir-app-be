/**
 * Environment Configuration Utility
 * 
 * Utility ini membantu mengelola environment variables dengan aman
 * dan memastikan semua required variables tersedia.
 * 
 * Best Practice:
 * 1. Di Development: Gunakan .env file (tidak di-commit ke git)
 * 2. Di Production (Vercel): Set environment variables di Vercel dashboard
 * 3. Jangan hardcode sensitive values di code
 */

/**
 * Validasi environment variables yang required
 * @throws {Error} Jika required variable tidak ditemukan
 */
function validateRequiredEnvVars() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const env = process.env.NODE_ENV || 'development';
    throw new Error(
      `Missing required environment variables in ${env}:\n` +
      `  - ${missing.join('\n  - ')}\n\n` +
      `For development: Create .env file with these variables\n` +
      `For production: Set these in Vercel dashboard under Settings > Environment Variables`
    );
  }
}

/**
 * Get environment variable dengan default value
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value jika tidak ditemukan
 * @returns {string} Environment variable value atau default
 */
function getEnv(key, defaultValue = null) {
  return process.env[key] || defaultValue;
}

/**
 * Get environment variable dengan validasi required
 * @param {string} key - Environment variable key
 * @param {string} errorMessage - Custom error message
 * @returns {string} Environment variable value
 * @throws {Error} Jika variable tidak ditemukan
 */
function getRequiredEnv(key, errorMessage = null) {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      errorMessage || 
      `Required environment variable ${key} is not set`
    );
  }
  return value;
}

/**
 * Check jika aplikasi berjalan di Vercel
 * @returns {boolean}
 */
function isVercel() {
  return process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
}

/**
 * Check jika aplikasi berjalan di production
 * @returns {boolean}
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check jika aplikasi berjalan di development
 * @returns {boolean}
 */
function isDevelopment() {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

/**
 * Get current environment name
 * @returns {string} 'development' | 'production' | 'test'
 */
function getEnvironment() {
  return process.env.NODE_ENV || 'development';
}

/**
 * Get API URL berdasarkan environment
 * @returns {string} API URL
 */
function getApiUrl() {
  if (isVercel()) {
    // Di Vercel, gunakan URL dari environment atau construct dari VERCEL_URL
    return process.env.API_URL || 
           (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
           'http://localhost:3000';
  }
  return process.env.API_URL || 'http://localhost:3000';
}

/**
 * Get CORS origin berdasarkan environment
 * @returns {string|string[]} CORS origin
 */
function getCorsOrigin() {
  if (isProduction()) {
    // Di production, gunakan specific origin dari env atau default ke *
    return process.env.CORS_ORIGIN || '*';
  }
  // Di development, allow semua origin untuk kemudahan development
  return process.env.CORS_ORIGIN || '*';
}

/**
 * Initialize dan validasi environment configuration
 * Panggil function ini di awal aplikasi
 */
function initEnv() {
  try {
    validateRequiredEnvVars();
    
    if (isDevelopment()) {
      console.log('✅ Environment variables validated');
      console.log(`📍 Environment: ${getEnvironment()}`);
      console.log(`🌐 API URL: ${getApiUrl()}`);
    }
  } catch (error) {
    console.error('❌ Environment configuration error:');
    console.error(error.message);
    
    // Di production, throw error untuk fail fast
    if (isProduction()) {
      throw error;
    }
    
    // Di development, hanya warn
    console.warn('⚠️  Continuing with missing environment variables...');
  }
}

module.exports = {
  validateRequiredEnvVars,
  getEnv,
  getRequiredEnv,
  isVercel,
  isProduction,
  isDevelopment,
  getEnvironment,
  getApiUrl,
  getCorsOrigin,
  initEnv
};

