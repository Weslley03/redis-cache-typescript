module.exports = {
    preset: 'ts-jest',  // Define que usaremos TypeScript
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],  // Suporte a arquivos .ts e .js
    transform: {
      '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],  // Mova a configuração ts-jest aqui
    },
  };