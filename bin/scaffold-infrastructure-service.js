import { input } from "@inquirer/prompts";
import { addLine, newFile } from "./utils/fs.js";
import { toCamelAndPascalFromUnknownCase } from "./utils/formatters.js";
import { fromProjectRoot } from "./utils/path.js";

/**
 *
 * @param {string[]} pathToModule
 */
const scaffoldInfrastructureService = async (pathToModule) => {
    const name = await input({
        message: "Infrastructure service name",
    });

    const pathToInfrastructureServices = [
        ...pathToModule,
        "application",
        "infrastructure-services",
    ];

    const type = await input({
        message: "Infrastructure service type",
        default: "API",
    });

    const { PascalCase: nameInPascalCase } =
        toCamelAndPascalFromUnknownCase(name);

    await newFile(
        `
export abstract class ${nameInPascalCase}InfrastructureService {
\t
}
        `,
        ...pathToInfrastructureServices,
        `${name}.infrastructure-service.ts`,
    );

    addLine(
        await fromProjectRoot(...pathToInfrastructureServices, "index.ts"),
        `export * from './${name}.infrastructure-service'`,
    );

    const pathToInfrastructure = [...pathToModule, "infrastructure"];

    await newFile(
        `
import { ${nameInPascalCase}InfrastructureService } from '../../../application/infrastructure-services'

export class ${nameInPascalCase}MockInfrastructureService extends ${nameInPascalCase}InfrastructureService {
\t
}
        `,
        ...pathToInfrastructure,
        "mock",
        "infrastructure-services",
        `${name}.infrastructure-service.mock.ts`,
    );

    const { PascalCase: typeInPascal } = toCamelAndPascalFromUnknownCase(type);

    await newFile(
        `
import { ${nameInPascalCase}InfrastructureService } from '../../../application/infrastructure-services'

export class ${nameInPascalCase}${typeInPascal}InfrastructureService extends ${nameInPascalCase}InfrastructureService {
\t
}
        `,
        ...pathToInfrastructure,
        type,
        "infrastructure-services",
        `${name}.infrastructure-service.${type}.ts`,
    );
};

export default scaffoldInfrastructureService;
