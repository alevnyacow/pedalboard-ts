import { input } from "@inquirer/prompts";
import { addLine, newFile } from "./utils/fs.js";
import { toCamelAndPascalFromUnknownCase } from "./utils/formatters.js";
import { fromProjectRoot } from "./utils/path.js";

/**
 *
 * @param {string[]} pathToModule
 */
const scaffoldUseCase = async (pathToModule) => {
    const useCaseName = await input({
        message: "Use-case name",
    });

    const pathToUseCases = [...pathToModule, "application", "use-cases"];

    const { PascalCase } = toCamelAndPascalFromUnknownCase(useCaseName);

    await newFile(
        `
import { UseCase } from "pedalboard-ts";
import z from "zod";

type Context = {};

const inputSchema = z.object({});

const outputSchema = z.object({});

export const ${PascalCase} = UseCase.create({
    input: inputSchema,
    output: outputSchema,
    handler: async (input, ctx: Context) => {
\t\t
    },
});
        `,
        ...pathToUseCases,
        `${useCaseName}.ts`,
    );

    addLine(
        await fromProjectRoot(
            ...pathToModule,
            "application",
            "use-cases",
            "index.ts",
        ),
        `export * from './${useCaseName}'`,
    );
};

export default scaffoldUseCase;
