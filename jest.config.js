const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
    roots: ['<rootDir>/src'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    // testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: tsjPreset.transform
}
