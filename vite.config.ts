import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"
import dts from "vite-plugin-dts"
import pkg from "./package.json"

const __dirname = dirname(fileURLToPath(import.meta.url))

const componentsDir = resolve(__dirname, "src/components")
const componentEntries = Object.fromEntries(
  readdirSync(componentsDir)
    .filter((name) => statSync(resolve(componentsDir, name)).isDirectory())
    .map((name) => [name, resolve(componentsDir, name, "index.tsx")])
)

function copyCssPlugin(): Plugin {
  const stylesSrc = resolve(__dirname, "src/styles")
  const stylesOut = resolve(__dirname, "dist/styles")
  return {
    apply: "build",
    closeBundle() {
      mkdirSync(stylesOut, { recursive: true })
      for (const f of readdirSync(stylesSrc)) {
        if (f.endsWith(".css")) {
          copyFileSync(resolve(stylesSrc, f), resolve(stylesOut, f))
        }
      }
    },
    name: "komorebi-copy-css"
  }
}

export default defineConfig(({ mode }) => {
  const isDev = mode === "development"
  const peerDependencies = Object.keys(pkg.peerDependencies ?? {})

  // id.startsWith(${dependency}/) is important because scoped
  // package names like @phosphor-icons/react must not accidentally
  // match unrelated packages like @phosphor-icons/reactive.
  // This predicate avoids that.
  const isExternal = (id: string) =>
    id === "react/jsx-runtime" ||
    peerDependencies.some(
      (dependency) => id === dependency || id.startsWith(`${dependency}/`)
    )

  return {
    build: {
      cssCodeSplit: false,
      emptyOutDir: !isDev,
      lib: {
        entry: {
          "index": resolve(__dirname, "src/index.ts"),
          "utils/index": resolve(__dirname, "src/utils/index.ts"),
          ...componentEntries
        },
        fileName: (_format, entryName) =>
          entryName === "index"
            ? "index.js"
            : entryName.includes("/")
              ? `${entryName}.js`
              : `${entryName}/index.js`,
        formats: ["es"]
      },
      minify: isDev ? false : "esbuild",
      rollupOptions: {
        cache: isDev,
        external: isExternal,
        output: {
          banner: '"use client";\n',
          chunkFileNames: (chunkInfo) => {
            const name = chunkInfo.name.replace(/[-_]+$/, "") || "chunk"
            return `chunks/${name}-[hash:16].js`
          },
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "index") {
              return "index.js"
            }
            if (chunkInfo.name === "utils/index") {
              return "utils/index.js"
            }
            return `${chunkInfo.name}/index.js`
          },
          globals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "react/jsx-runtime": "jsxRuntime"
          },
          hashCharacters: "base36",
          hoistTransitiveImports: false,
          preserveModules: false
        }
      },
      sourcemap: isDev ? "inline" : true,
      watch: isDev
        ? {
            exclude: ["**/*.test.*", "**/*.stories.*", "**/__tests__/**"],
            include: "src/**"
          }
        : undefined
    },
    plugins: [
      dts({
        beforeWriteFile(filePath, content) {
          // Flatten dist/components/<Name>/… → dist/<Name>/…
          return {
            content: content.replaceAll("./components/", "./"),
            filePath: filePath.replace("/dist/components/", "/dist/")
          }
        },
        compilerOptions: {
          incremental: isDev,
          tsBuildInfoFile: isDev ? "./.tsbuildinfo" : undefined
        },
        entryRoot: "src",
        exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
        include: ["src/**/*"]
      }),
      copyCssPlugin()
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    }
  }
})
