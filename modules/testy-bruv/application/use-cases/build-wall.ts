import { UseCase } from "pedalboard-ts";
import z from "zod";

type Context = {
    sup: number;
};

const inputSchema = z.object({});

const outputSchema = z.object({});

export const BuildWallWithoutCtx = UseCase.create({
    input: inputSchema,
    output: outputSchema,
    handler: async (input, ctx: Context) => {
        return {};
    },
});
