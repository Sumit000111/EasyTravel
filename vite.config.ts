import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // ensures correct asset paths on GitBox
  server: {
    host: true, // allow all hosts (GitBox dynamic URL)
    port: 8080, 
    allowedHosts: [
  "8sffry-8080.csb.app"
]
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
