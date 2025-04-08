import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getMessage } from "../../remote";

export const getWSMessage: ReplaceVariable = {
    definition: {
        handle: "WSMessage",
        description: "The received message from the connected websocket",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const message = getMessage();
        return JSON.stringify(message) ?? "Unknown";
    },
};
