import typescript from "rollup-plugin-typescript2";

export default {
    input: "index.ts",
    output: {
        file: "index.js",
        format: "umd",
        name: "test"
    },
    plugins: [
        typescript({
            clean: true,
            tsconfigOverride: {
                compilerOptions: {
                    target: "ES2015",
                    module: "ES2015",
                    declaration: false
                }
            }
        }),
    ]
}
