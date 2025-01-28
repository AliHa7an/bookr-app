module.exports = {
  env: {
    node: true,
    es2020: true,
    jest: true,  // Enable Jest testing environment (if you plan to use it)
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // For TypeScript support
    'prettier', // Disable ESLint rules that conflict with Prettier
    'plugin:prettier/recommended', // Activate Prettier as an ESLint rule
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allow modern JavaScript features
    sourceType: 'module', // Allows the use of ES modules
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // Show Prettier issues as ESLint errors
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: disable module boundary type checks
  },
};
