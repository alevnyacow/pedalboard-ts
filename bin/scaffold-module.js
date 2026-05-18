import { input, select } from "@inquirer/prompts";
import { newFile } from "./utils/fs.js";
import { toCamelAndPascalFromUnknownCase } from "./utils/formatters.js";

const scaffoldModule = async () => {
    const name = await input({
        message: "Provide module name",
    });

    const { PascalCase } = toCamelAndPascalFromUnknownCase(name);

    const presentation = await select({
        message: "Presentation type",
        choices: ["REST"],
    });

    await newFile(
        `
import { DI } from 'pedalboard-ts'
import { container as rootContainer } from "../../../../infrastructure/di";

export const container = DI.newContainer({}, rootContainer)
`,
        "modules",
        name,
        "infrastructure",
        "di",
        "container.ts",
    );

    await newFile(
        `
export * from './container'
        `,
        "modules",
        name,
        "infrastructure",
        "di",
        "index.ts",
    );

    await newFile("", "modules", name, "application", "use-cases", "index.ts");

    if (presentation === "REST") {
        await newFile(
            `
import type { REST } from 'pedalboard-ts'
import * as UseCases from '../application/use-cases'

export const ${PascalCase}Controller = {
\t
}

export type ${PascalCase}API = REST.ControllerContracts<
    typeof ${PascalCase}Controller
>
`,
            "modules",
            name,
            "presentation",
            "REST.ts",
        );
    }
};

export default scaffoldModule;
