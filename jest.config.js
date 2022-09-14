module.exports = {
  preset: 'ts-jest',
  rootDir: './',
  transform: {
    '^.+\\.jsx?$': 'babel-jest', //这个是jest的默认配置
    '^.+\\.ts?$': 'ts-jest', //typescript转换
  },
  testRegex: '(/test/.*\\.(test|spec))\\.[tj]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
