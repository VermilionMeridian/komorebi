#!/usr/bin/env tsx
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const componentsDir = resolve(root, "src/components")
const pkgPath = resolve(root, "package.json")
const check = process.argv.includes("--check")

const components = readdirSync(componentsDir)
  .filter((n) => statSync(resolve(componentsDir, n)).isDirectory())
  .sort()

const exportTarget = (types: string, importPath: string) =>
  Object.fromEntries([
    ["types", types],
    ["import", importPath]
  ]) as { import: string; types: string }

const componentExports = Object.fromEntries(
  components.map((name) => [
    `./${name}`,
    exportTarget(`./dist/${name}/index.d.ts`, `./dist/${name}/index.js`)
  ])
)

const exportsMap = {
  ".": exportTarget("./dist/index.d.ts", "./dist/index.js"),
  "./utils": exportTarget(
    "./dist/utils/index.d.ts",
    "./dist/utils/index.js"
  ),
  ...componentExports,
  "./package.json": "./package.json",
  "./styles/default-theme.css": "./dist/styles/default-theme.css",
  "./styles/globals.css": "./dist/styles/globals.css",
  "./styles/komorebi.css": "./dist/styles/komorebi.css",
  "./styles/tailwind.css": "./dist/styles/tailwind.css"
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const current = JSON.stringify(pkg.exports, null, 2)
const desired = JSON.stringify(exportsMap, null, 2)

if (check) {
  if (current !== desired) {
    process.stderr.write(
      "package.json exports is out of sync with src/components/.\n"
    )
    process.stderr.write("Run `pnpm sync-exports` to fix.\n")
    process.exit(1)
  }
  process.exit(0)
}

pkg.exports = exportsMap
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
process.stdout.write("package.json exports updated.\n")
