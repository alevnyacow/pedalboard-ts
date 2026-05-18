#!/usr/bin/env node
import fs from "fs";
import { select, input } from "@inquirer/prompts";
import scaffoldModule from "./scaffold-module.js";
import initializeProject from "./initialize-project.js";

import * as ConfigFile from "./utils/config-file.js";
import scaffoldUseCase from "./scaffold-use-case.js";
import { fromProjectRoot } from "./utils/path.js";

async function scaffoldInModule() {
    const moduleFolders = fs
        .readdirSync(await fromProjectRoot("modules"), {
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
        await scaffoldUseCase(pathToModule);
    }
}

async function main() {
    try {
        await ConfigFile.read();

        const answer = await select({
            message: "Command",
            choices: [
                "Scaffold something in existing module",
                "Scaffold something in shared layer",
                "Scaffold new module",
            ],
        });

        if (answer === "Scaffold something in existing module") {
            await scaffoldInModule();
        }

        if (answer === "Scaffold new module") {
            await scaffoldModule();
        }
    } catch (e) {
        console.error(e);
        await initializeProject();
    }

    process.exit(0);
}

main();
