import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";

const banner = `/**
 * @license
 * Ideal Postcodes <https://ideal-postcodes.co.uk>
 * Magento Integration
 * Copyright IDDQD Limited, all rights reserved
 */`;

// Configure terser to ignore build info banner
const terserConfig = {
  output: {
    comments: (_, { value, type }) => {
      if (type === "comment2") return /@license/i.test(value);
    }
  }
};

const targets = "ie 11";

const config = file => {
  return {
    output: {
      file,
      banner,
      format: "iife",
      name: "IdealPostcodes",
      exports: "named"
    },
    plugins: [
      resolve({ extensions: [".js", ".ts"] }),
      commonjs(),
      ts({
        transpiler: "babel",
        browserslist: [targets],
        babelConfig: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets,
                useBuiltIns: "usage",
                corejs: 3
              }
            ]
          ]
        }
      }),
      terser(terserConfig)
    ]
  };
};

export default [
  {
    ...config("./view/base/web/binding.js"),
    input: "./lib/store.ts"
  },
  {
    ...config("./view/base/web/admin.js"),
    input: "./lib/admin.ts"
  }
];
