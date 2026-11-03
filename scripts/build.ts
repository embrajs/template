import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build as buildDts } from "@hyrious/dts";
import { build } from "esbuild";

const root = fileURLToPath(new URL("../", import.meta.url));
const outdir = join(root, "dist");
const entryPoints = {
  index: join(root, "src/index.ts"),
};
const { name: packageName } = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const cachePath = join(root, "mangle-cache.json");
const mangleCache: Record<string, string | false> = JSON.parse(await readFile(cachePath, "utf8"));

await rm(outdir, { recursive: true, force: true });

for (const [format, extension, declarationExtension] of [
  ["esm", ".mjs", ".d.mts"],
  ["cjs", ".cjs", ".d.cts"],
] as const) {
  const result = await build({
    absWorkingDir: root,
    entryPoints,
    outdir,
    outExtension: { ".js": extension },
    bundle: true,
    format,
    platform: "neutral",
    packages: "external",
    target: "esnext",
    treeShaking: true,
    minify: Boolean(process.env.MINIFY),
    mangleProps: /[^_]_$/,
    mangleQuoted: true,
    mangleCache,
    logLevel: "info",
  });

  Object.assign(mangleCache, result.mangleCache);

  await buildDts({
    entryPoints,
    outdir,
    exclude: [packageName],
    outputOptions: {
      entryFileNames: `[name]${declarationExtension}`,
    },
  });
}

await writeFile(cachePath, `${JSON.stringify(mangleCache, null, 2)}\n`);
