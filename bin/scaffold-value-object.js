import { input } from "@inquirer/prompts";
import { addLine, newFile } from "./utils/fs.js";
import { toCamelAndPascalFromUnknownCase } from "./utils/formatters.js";
import { fromProjectRoot } from "./utils/path.js";

/**
 *
 * @param {string[]} pathToModule
 */
const scaffoldValueObject = async (pathToModule) => {
    const valueObjectName = await input({
        message: "Provide value object name",
    });

    const valueObjectsPath = [...pathToModule, "domain", "value-objects"];
    const { PascalCase } = toCamelAndPascalFromUnknownCase(valueObjectName);

    await newFile(
        `
import { Domain } from 'pedalboard-ts'
import z from 'zod'

const schema = z.object({})

export class ${PascalCase} extends Domain.ValueObject(schema) {

}
       `,
        ...valueObjectsPath,
        `${valueObjectName}.ts`,
    );

    addLine(
        await fromProjectRoot(...valueObjectsPath, "index.ts"),
        `export * from './${valueObjectName}'`,
    );
};

export default scaffoldValueObject;
