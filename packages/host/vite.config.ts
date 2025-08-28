import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// IMP : Host will run on dev mode but for remote we need a build
// For remote, we can use "vite build" or  "vite build --watch" : This is a vite doc ref

// But there is another way : we can create a command to build and preview (serve files) of remote
// command for remote package.json => concurrently \"vite build --watch\" \"vite preview --port 5450 --strictPort\"
// using this "concurrently" npm package to create a workable command for windows

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        //Tells Vite where to fetch remote modules remoteApp is the key used when importing
        // , and its value is the URL to remoteEntry.js served by the remote app.
        remoteApp: "http://localhost:5450/assets/remoteEntry.js", // this is an ALIAS
      },
      shared: ["react", "react-dom"], //Specifies dependencies to be shared between host and remote,
      //  avoiding duplication and maintaining a single instance.
    }),
    {
      name: "vite-plugin-reload-endpoint", //  simulation for hot reload on build of Remote
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/__fullReload") {
            server.hot.send({ type: "full-reload" });

            res.end("Full reload triggered");
          } else {
            next();
          }
        });
      },
    },
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

// modulePreload: false
// This option controls whether Vite injects <link rel="modulepreload"> tags for dynamic imports and chunks in the build HTML. Setting it to false disables this behavior.

// Purpose: Module preload helps browsers load JS modules earlier improving startup performance.

// When false: You might disable it if you want manual control of preload or for compatibility reasons.

// minify: false
// Controls whether the build output JavaScript and CSS code are minified (compressed and whitespace removed).

// false: No minification, so output files are larger but easier to read and debug. Usually used during development or debugging builds.

// true: Enables minification, making bundles smaller for production.

// cssCodeSplit: false
// Controls whether CSS imported in JS files gets extracted into separate CSS files per chunk or bundled together.

// false: All CSS is combined into a single CSS file in the build output.

// true: CSS will be split per JavaScript chunk, creating multiple CSS files matching chunk outputs. This can improve caching and load performance if only some parts of CSS change.
