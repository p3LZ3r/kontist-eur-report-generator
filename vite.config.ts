import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	base: "/",
	build: {
		assetsDir: "assets",
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
	},
	publicDir: "public",
});
