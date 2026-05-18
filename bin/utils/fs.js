import fs from "fs";
import { fromProjectRoot } from "./path.js";

/**
 * Creates folder using path parts (from root).
 *
 * @param  {...string} path
 */
export const newFolder = async (...path) => {
    const pathFromRoot = await fromProjectRoot(...path);
    fs.mkdirSync(pathFromRoot, { recursive: true });
};

/**
 * Creates file with given content using path parts (from root). If some
 * folders in file path did not exist, they will be created.
 *
 * @param {string} content
 * @param  {...string} path
 */
export const newFile = async (content, ...path) => {
    if (path.length > 1) {
        const folder = path.slice(0, -1);
        await newFolder(...folder);
    }
    const pathFromRoot = await fromProjectRoot(...path);
    fs.writeFileSync(pathFromRoot, content.trim());
};

/**
 * Reads file content based on file name and path parts (from root).
 *
 * @param {string} fileName
 * @param  {...string} pathFromRoot
 *
 * @throws {Error} If file does not exist.
 */
export const readFileContent = async (fileName, ...pathFromRoot) => {
    const filePath = await fromProjectRoot(...pathFromRoot, fileName);

    if (!fs.existsSync(filePath)) {
        throw new Error("No file was found");
    }

    return fs.readFileSync(filePath, "utf-8");
};

/**
 * Writes file content. Creates, if file did not exist.
 *
 * @param {string} fileName
 * @param {string} content
 * @param  {...string} pathFromRoot
 */
export const writeFile = async (fileName, content, ...pathFromRoot) => {
    const filePath = await fromProjectRoot(...pathFromRoot, fileName);

    fs.writeFileSync(filePath, content);
};

export const insertAfterLineInFile = (filePath, targetLine, newLine) => {
    let content = fs.readFileSync(filePath, "utf8");

    const lines = content.split("\n");
    const index = lines.findIndex((line) => line.includes(targetLine));

    if (index !== -1) {
        lines.splice(index + 1, 0, newLine);
        fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    }
};

export const insertBeforeLineInFile = (
    filePath,
    targetLine,
    newLine,
    offset = 0,
) => {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    const index = lines.findIndex((line) => line.includes(targetLine));

    if (index !== -1) {
        lines.splice(index - offset, 0, newLine);
        fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    }
};

export const addLine = (filePath, newLine) => {
    const content = fs.readFileSync(filePath, "utf8");

    fs.writeFileSync(
        filePath,
        [content.trim(), newLine.trim()].join("\n"),
        "utf8",
    );
};
