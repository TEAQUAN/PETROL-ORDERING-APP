const crypto = require('crypto');

// Generate a secure random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex'); // Generates a 256-bit (32-byte) random key
};

const secretKey = generateSecretKey();
console.log('Secure Secret Key:', secretKey);
