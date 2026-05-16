import { insertBeforeLineInFile } from "./fs.js";
import { fromProjectRoot } from "./path.js";

/**
 *
 * @param {string} importString
 * @param {string | undefined} module
 */
export const addImport = async (importString, module) => {
    const path = module
        ? await fromProjectRoot(
              "modules",
              module,
              "infrastructure",
              "di",
              "container.ts",
          )
        : await fromProjectRoot("infrastructure", "di", "container.ts");

    insertBeforeLineInFile(
        path,
        "export const container = DI.newContainer({",
        importString,
        1,
    );
};

/**
 *
 * @param {string} rule
 * @param {string | undefined} module
 */
export const addEntryRule = async (rule, module) => {
    const path = module
        ? await fromProjectRoot(
              "modules",
              module,
              "infrastructure",
              "di",
              "container.ts",
          )
        : await fromProjectRoot("infrastructure", "di", "container.ts");

    insertBeforeLineInFile(path, "})", `\t${rule.trim()},`);
};
