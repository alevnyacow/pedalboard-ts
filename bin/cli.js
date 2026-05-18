#!/usr/bin/env node
import fs from "fs";
import { select } from "@inquirer/prompts";
import initializeProject from "./initialize-project.js";
import * as ConfigFile from "./utils/config-file.js";
import scaffoldUseCase from "./scaffold-use-case.js";
import { fromProjectRoot } from "./utils/path.js";
import scaffoldModule from "./scaffold-module.js";
import scaffoldEntity from "./scaffold-entity.js";
import scaffoldValueObject from "./scaffold-value-object.js";
import scaffoldInfrastructureService from "./scaffold-infrastructure-service.js";

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
            "Infrastructure Service",
            "Value Object",
        ],
    });

    const pathToModule = ["modules", module];

    if (type === "Use-case") {
        await scaffoldUseCase(pathToModule);
    }

    if (type === "Entity") {
        await scaffoldEntity(pathToModule);
    }

    if (type === "Value Object") {
        await scaffoldValueObject(pathToModule);
    }

    if (type === "Infrastructure Service") {
        await scaffoldInfrastructureService(pathToModule);
    }
}

async function main() {
    try {
        await ConfigFile.read();
    } catch (e) {
        await initializeProject();
        process.exit(0);
    }

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

    process.exit(0);
}

main();
