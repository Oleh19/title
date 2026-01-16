module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
  ],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "build/",
    "*.config.{js,mjs,ts}",
    "next-env.d.ts",
  ],
};
