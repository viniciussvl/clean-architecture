const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
    roots: ['<rootDir>/src'],
    coverageDirectory: 'coverage',
    coverageProvider: 'babel',
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**', '!<rootDir>/src/**/*-protocols.ts', '!**/protocols/**', '!**/test/**'],
    // testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: tsjPreset.transform,
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1'
    }
}
