import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next", "next/typescript"),
  {
    "rules": {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_"
        }
      ]
    }
  }
];

export default eslintConfig;
