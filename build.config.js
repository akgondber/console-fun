export default {
    entries: ["./cli.js"],
    rollup: {
        esbuild: {
            target: "es2022"
        }
    }
};
