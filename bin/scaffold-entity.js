import { input } from "@inquirer/prompts";
import { addLine, newFile } from "./utils/fs.js";
import { toCamelAndPascalFromUnknownCase } from "./utils/formatters.js";
import { fromProjectRoot } from "./utils/path.js";

/**
 *
 * @param {string[]} pathToModule
 */
const scaffoldEntity = async (pathToModule) => {
    const entityName = await input({
        message: "Provide entity name",
    });

    const entitiesPath = [...pathToModule, "domain", "entities"];
    const { PascalCase } = toCamelAndPascalFromUnknownCase(entityName);

    await newFile(
        `
import { Domain } from 'pedalboard-ts'
import z from 'zod'

const schema = z.object({})

export class ${PascalCase} extends Domain.Entity(schema) {

}
       `,
        ...entitiesPath,
        `${entityName}.entity.ts`,
    );

    addLine(
        await fromProjectRoot(...entitiesPath, "index.ts"),
        `export * from './${entityName}.entity'`,
    );
};

export default scaffoldEntity;
