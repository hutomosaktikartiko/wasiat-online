// Polyfills for browser compatibility with Solana packages
if (typeof window !== "undefined") {
  // Dynamic imports to avoid SSR issues
  Promise.all([
    import("buffer"),
    import("process")
  ]).then(([bufferModule, processModule]) => {
    window.Buffer = bufferModule.Buffer;
    window.process = processModule.default || processModule;
    window.global = globalThis;
  }).catch(console.error);
}
