/**
 * Transforms string of unknown case (camel, pascal, kebab) to
 * `camelCase` and `PascalCase`.
 *
 * @param {string} source
 * @returns {{camelCase: string, PascalCase: string}}
 */
export const toCamelAndPascalFromUnknownCase = (source) => {
    if (!source.includes("-")) {
        return {
            camelCase:
                source.substring(0, 1).toLowerCase() + source.substring(1),
            PascalCase:
                source.substring(0, 1).toUpperCase() + source.substring(1),
        };
    }

    /**
     * Logic for kebab-case.
     */
    const words = source.split("-");

    const camelCase = words
        .map((word, index) =>
            index === 0
                ? word.toLowerCase()
                : word[0].toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join("");

    const PascalCase = words
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join("");

    return {
        camelCase,
        PascalCase,
    };
};

/**
 * Finds name of imported module. Works for absolute and not-absolute imports.
 *
 * @param {string} source
 *
 * @returns {string}
 */
export const getImportName = (source) => {
    const match = source.match(
        /import\s+(?:\{\s*([^}]+)\s*\}|([^\s]+))\s+from/,
    );

    return match?.[1] || match?.[2];
};
