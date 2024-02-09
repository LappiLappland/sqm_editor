const config = {
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__jest__/mocks/filesMock.js",
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testMatch: ["**/?(*.)(spec|test).[jt]s?(x)"],
  testEnvironment: "jsdom",
};

export default config;
