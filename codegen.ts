import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://147.182.237.252:8090/graphql",
    documents: "src/**/*.gql",
    watch: true,
    generates: {
        "src/gql/schema.tsx": {
            plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
            config: {
                withHooks: true,
                flattenGeneratedTypes: true,
                flattenGeneratedTypesIncludeFragments: true,
                withMutationFn: true,
                declarationKind: "interface",
                preResolveTypes: true,
                withComponent: true,
            },
        },
        "graphql.config.json": {
            plugins: ["introspection"],
        },
    },
    hooks: { afterOneFileWrite: ["prettier --write"] },
    //hooks: { afterOneFileWrite: ["tslint --fix"] },
}

export default config
