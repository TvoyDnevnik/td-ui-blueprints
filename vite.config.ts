import { defineConfig } from "vite";

export default defineConfig({
	root: "./src",
	build: { outDir: "../dist/app", emptyOutDir: true, sourcemap: true },
	resolve: {
		alias: [{ find: "@shared", replacement: "/app/shared" }],
	},
});
