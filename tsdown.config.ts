import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
  },
  fixedExtension: true,
  format: ["cjs", "esm"],
  minify: Boolean(process.env.MINIFY),
  sourcemap: false,
  target: "esnext",
  treeshake: false,
});
