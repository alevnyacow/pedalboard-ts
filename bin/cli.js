#!/usr/bin/env node
import fs from "fs";
import { select, input } from "@inquirer/prompts";
import scaffoldModule from "./scaffold-module.js";
import initializeProject from "./initialize-project.js";

async function scaffoldInModule() {
    const moduleFolders = fs
        .readdirSync(await projectPaths.source("modules"), {
            withFileTypes: true,
        })
        .filter((x) => x.isDirectory)
        .map((x) => x.name);

    const module = await select({
        choices: moduleFolders,
        message: "Select module",
    });

    const type = await select({
        message: "What to scaffold",
        choices: [
            "Use-case",
            "Repository",
            "Entity",
            "Event",
            "Provider",
            "Value Object",
        ],
    });

    const pathToModule = ["modules", module];

    if (type === "Use-case") {
        const useCaseName = await input({
            message: "Use-case name",
        });

        const pathToUseCases = [...pathToModule, "application", "use-cases"];
        await createFile(
            `
export const sup = 22

export const suppy42 = 532
`,
            ...pathToUseCases,
            `${useCaseName}.ts`,
        );
    }
}

async function main() {
    const answer = await select({
        message: "Command",
        choices: [
            "Scaffold something in existing module",
            "Scaffold something in shared layer",
            "Scaffold new module",
            "Initialize",
        ],
    });

    if (answer === "Scaffold something in existing module") {
        await scaffoldInModule();
    }

    if (answer === "Scaffold new module") {
        // await scaffoldNewModule();
        await scaffoldModule();
    }

    if (answer === "Initialize") {
        await initializeProject();
    }

    process.exit(0);
}

main();
