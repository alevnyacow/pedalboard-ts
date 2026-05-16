import path from "path";
import fs from "fs";
import * as ConfigFile from "./config-file.js";

/**
 * Finds project root by the nearest `package.json` file.
 *
 * @throws {Error} If no package.json file was found.
 *
 * @returns {string}
 */
export const findProjectRoot = () => {
    let dir = process.cwd();
    while (dir !== path.parse(dir).root) {
        if (fs.existsSync(path.join(dir, "package.json"))) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    throw new Error("No package.json was found");
};

/**
 * Returns full path, based on subfolders from project root.
 *
 * @param  {...string} subfolderPath
 *
 * @returns {Promise<string>}
 */
export const fromProjectRoot = async (...subfolderPath) => {
    const root = findProjectRoot();

    const config = await ConfigFile.read();

    return path.resolve(root, config.rootFolder, ...subfolderPath);
};
