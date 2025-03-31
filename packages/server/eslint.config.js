import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      // Ignorar directorios comunes
      'node_modules/**',
      'dist/**',
      'coverage/**',
      // Ignorar archivos de configuración
      '.prettierrc',
      'jest.config.js',
      // Puedes agregar más patrones según necesites
      'build/**',
      'temp/**',
      '**/src/**/__tests__/**/*.test.ts',
      '**/src/**/*.spec.ts',
      '**/src/**/*.test.ts',
    ],
  },
  eslint.configs.recommended,
  {
    // Configuración base
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        NodeJS: 'readonly',
      },
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    // Plugins
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    // Reglas
    rules: {
      //'@typescript-eslint/explicit-function-return-type': 'error',
      // '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'prettier/prettier': 'error',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-unused-vars': 'off',
    },
  },
  // Configuración para archivos de prueba
  {
    files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Incluir la configuración de Prettier
  prettierConfig,
];
