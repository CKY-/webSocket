import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initRemote } from "./remote";
import { getWSMessage } from "./firebot/variables/get-ws-message";
import { sendRawMessage } from "./firebot/effects/ws-send-message";
import { WSEventSource } from "./firebot/events/ws-event-source";

interface Params {
  address: string;
  connectionMessage: string;
  logging: boolean;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "WSRaw",
      description: "WSRaw Client",
      author: "CKY",
      version: "1.0",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {
      address: {
        type: "string",
        default: "ws://localhost:7472",
        description: "Address",
        secondaryDescription: "Enter an address here",
        title: "Address",
      },
      connectionMessage: {
        title: "Default Connection Message",
        type: "string",
        default: "{\"type\": \"subscribe\"}",
        description: "Default Connection Message",
        secondaryDescription: "Default Connection Message",
      },
      logging: {
        title: "Logging",
        type: "boolean",
        default: false,
        description: "Enable logging for WsRaw",
      },
    };
  },
  run: (runRequest) => {
    const { logger } = runRequest.modules;
    logger.info(runRequest.parameters.address);

    const {
      effectManager,
      eventManager,
      replaceVariableManager,
      integrationManager,
    } = runRequest.modules;

    initRemote(
      {
        address: runRequest.parameters.address,
        connectionMessage: runRequest.parameters.connectionMessage,
        logging: runRequest.parameters.logging,
      },
      {
        eventManager,
      }
    );

    effectManager.registerEffect(sendRawMessage);

    eventManager.registerEventSource(WSEventSource);

    replaceVariableManager.registerReplaceVariable(getWSMessage);
  },
};

export default script;
