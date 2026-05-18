import type { REST } from "pedalboard-ts";
import * as UseCases from "../application/use-cases";

export const TestyBruvController = {
    // Methods
    GET: UseCases.BuildWallWithoutCtx({ sup: 44 }).REST(null as any),
};

export type TestyBruvAPI = REST.ControllerContracts<typeof TestyBruvController>;
