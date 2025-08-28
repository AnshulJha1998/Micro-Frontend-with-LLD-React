import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app", //Host apps use this name in their config and when importing modules
      filename: "remoteEntry.js", //Hosts will fetch this file to access exposed components
      exposes: {
        // Comps that are exposed to HOST
        //Maps public module names ("./Button") to their actual source in the remote ("./src/components/Button").
        //  Host applications use the key to import modules, e.g., import Button from "remote_app/Button";
        // "./Button": "./src/components/Button",  // If you want to export individually
        "./components/lld-comps": "./src/components/lld-comps/index.ts", // if you want to export all comps at once
        "./components/misc-comps": "./src/components/misc-comps/index.ts", // if you want to export all comps at once
      },
      shared: ["react", "react-dom"],
    }),
    {
      name: "vite-plugin-notify-host-on-rebuild", // simulation for hot reload on build of Remote
      apply(config, { command }) {
        return Boolean(command === "build" && config.build?.watch);
      },
      async buildEnd(error) {
        if (!error) {
          try {
            await fetch("http://localhost:5000/__fullReload"); // port name of HOST
          } catch (e) {
            console.log(e);
          }
        }
      },
    },
  ],
  build: {
    modulePreload: false,
    target: "esnext", // Latest JS version for new features
    minify: false,
    cssCodeSplit: false,
  },
});
