import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: ["src/index", "src/dom", "src/env", "src/math", "src/request"],
  clean: true,
  declaration: true,
  externals: ["vite", "astro", "webpack", "@unocss/webpack"],
  rollup: {
    emitCJS: true,
  },
})
