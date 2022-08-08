module.exports = {
    jest: {
        preset: 'ts-jest',
        testEnvironment: 'node',
        transform: {
            'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
        },
    },
};