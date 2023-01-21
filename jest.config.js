module.exports = {
  silent: true,
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(graphql-subscriptions-client)/)"
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/', 
    '<rootDir>/src/utils/locacao',
    '<rootDir>/src/router/',
    '<rootDir>/src/constants/',
    '<rootDir>/src/store/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/**/*_test.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  collectCoverage: true,
  verbose: true,
  collectCoverageFrom: [
    '!src/api/**/*',
    'src/**/*.{js,vue}',
    'src/plugins/editor-tinymce/composicao-variaveis/**/*.{js,vue}',
    '!src/main.js',
    '!src/App.vue',
    '!src/plugins/*.*',
    '!src/plugins/editor-tinymce/*.*',
  ],
  'coverageThreshold': {
    'global': { // ir aumentando esses limites ate 80 ~ 90
      'branches': 80.50,
      'functions': 80,
      'lines': 80,
      'statements': 80
    }
  },
  'setupTestFrameworkScriptFile': '<rootDir>/tests/jest/jest-globals.js'
};
