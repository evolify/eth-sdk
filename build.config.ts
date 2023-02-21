import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: ["src/index"],
  clean: true,
  declaration: true,
  externals: ["vite", "astro", "webpack", "@unocss/webpack"],
  rollup: {
    emitCJS: true,
  },
})
