import { input, select } from "@inquirer/prompts";
import { newFile, newFolder } from "./utils/fs.js";
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

    await newFolder("modules", name, "infrastructure", "di");
    await newFolder("modules", name, "domain");

    await newFile("", "modules", name, "application", "use-cases", "index.ts");

    if (presentation === "REST") {
        await newFile(
            `
import type { REST } from 'pedalboard-ts'
import * as UseCases from '../application/use-cases'

export const ${PascalCase}Controller = {
\t// Methods
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
