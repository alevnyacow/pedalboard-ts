import { input, select } from "@inquirer/prompts";
import * as ConfigFile from "./utils/config-file.js";
import * as DIUtils from "./utils/di.js";
import { newFile, newFolder } from "./utils/fs.js";
import { getImportName } from "./utils/formatters.js";

const initializeProject = async () => {
    const rootFolder = await input({
        message: "Root folder",
        default: ".",
    });

    const ORM = await select({
        message: "Choose your ORM",
        choices: ["Prisma"],
    });

    const presentation = await select({
        message: "Choose your root presentation layer",
        choices: ["React"],
    });

    await ConfigFile.write({ rootFolder, ORM, presentation });

    /**
     * Scaffolding infrastructure
     */
    await newFolder("infrastructure");
    await newFolder("infrastructure", "di");

    await newFile(
        `
import { DI } from 'pedalboard-ts'

export const container = DI.newContainer({
})
`,
        "infrastructure",
        "di",
        "container.ts",
    );

    await newFile(
        `
export * from './container'
        `,
        "infrastructure",
        "di",
        "index.ts",
    );

    if (ORM === "Prisma") {
        const pathToClient = await input({
            message: "Provide absolute path to your Prisma client",
        });

        const adapterImport = await input({
            message: "Provide `import` string for your Prisma adapter",
        });

        await newFile(
            `
import { PrismaClient } from '${pathToClient}'
${adapterImport}

const connectionString = \`\$\{process.env.DATABASE_URL\}\`;
const adapter = new ${getImportName(adapterImport)}({ connectionString });

export const prismaClient = new PrismaClient({ adapter });
            `,
            "infrastructure",
            "prisma",
            "client.ts",
        );

        await newFile(
            `
export * from './client'
            `,
            "infrastructure",
            "prisma",
            "index.ts",
        );

        await DIUtils.addImport("import { prismaClient } from '../prisma'");
        await DIUtils.addEntryRule(
            "Prisma: DI.Scope.ConstantValue(prismaClient)",
        );
    }

    await newFolder("presentation");

    if (presentation === "React") {
        await newFolder("presentation", "shared");
        await newFolder("presentation", "shared", "ui-kit");
        await newFolder("presentation", "shared", "queries");
        await newFolder("presentation", "shared", "hooks");
        await newFolder("presentation", "widgets");
        await newFolder("presentation", "pages");
    }
};

export default initializeProject;
