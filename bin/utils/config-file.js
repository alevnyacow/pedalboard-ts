import z from "zod";
import fs from "fs";
import path from "path";
import { writeFile } from "./fs.js";
import { findProjectRoot } from "./path.js";

const configFileName = "pedalboard.config.json";

export const read = async () => {
    const root = findProjectRoot();
    const filePath = path.resolve(root, configFileName);
    if (!fs.existsSync(filePath)) {
        throw new Error("No file was found");
    }

    const rawData = fs.readFileSync(filePath, "utf-8");

    const configObject = JSON.parse(rawData);
    return z
        .object({
            ORM: z.enum(["Prisma", "None"]),
            rootFolder: z.string(),
            presentation: z.enum(["React"]),
        })
        .parse(configObject);
};

export const write = async (config) => {
    const root = findProjectRoot();

    fs.writeFileSync(
        path.resolve(root, config.rootFolder, configFileName),
        JSON.stringify(config, null, "\t"),
    );
};
