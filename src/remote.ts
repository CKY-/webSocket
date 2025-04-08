import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { WebSocket } from "ws";
import { logger } from "./logger";
import { WS_EVENT_SOURCE, WSEvent } from "./firebot/constants";
const EventEmitter = require("events");

let eventManager: ScriptModules["eventManager"];
let logging: boolean;
let ws: WebSocket;
let receivedMessage: string;
let connected = false;
let reconnectTimeout: NodeJS.Timeout | null = null;
let isForceClosing = false;

export function initRemote(
  {
    address,
    connectionMessage,
    logging,
  }: {
    address: string;
    connectionMessage: string;
    logging: boolean;
  },
  modules: {
    eventManager: ScriptModules["eventManager"];
  }
) {
  eventManager = modules.eventManager;
  logging = logging ?? false;
  maintainConnection(address, connectionMessage, logging);
}

function maintainConnection(
  address: string,
  connectionMessage: string,
  logging: boolean,
  forceConnect = false
) {
  if (address == "localhost") {
    address = "127.0.0.1";
  }
  ws = new WebSocket(address);

  if (forceConnect && connected) {
    isForceClosing = true;
    ws.close();
    connected = false;
    isForceClosing = false;
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (!connected) {
    try {
      ws.on("open", () => {
        if (logging) {
          logger.debug("Connected to WebSocket server");
        }
        if (connectionMessage != null) {
          ws.send(connectionMessage);
        }
      });

      ws.on("message", (message) => {
        if (logging) {
          logger.debug(`Received: ${JSON.stringify(message.toString())}`);
        }
        receivedMessage = JSON.stringify(message);
        eventManager?.triggerEvent(WS_EVENT_SOURCE, WSEvent, {
          message: JSON.stringify(message),
        });
      });

      ws.on("close", () => {
        if (logging) {
          logger.debug("Disconnected from WebSocket server");
        }
      });

      ws.on("error", (error) => {
        if (logging) {
          logger.debug("WebSocket error:", error);
        }
      });
    } catch (error) {
      logger.debug("WS Failed to connect, attempting again in 10 secs.");
      if (logging) {
        logger.debug(error);
      }
      reconnectTimeout = setTimeout(
        () =>
          maintainConnection(address, connectionMessage, logging, forceConnect),
        10000
      );
    }
  }
}

export function sendMessage(message:string) {
  if (ws.readyState == 1) {
    ws.send(message);
  } else {
    if (logging) {
      console.log("WebSocket is not open.");
    }
  }
}

export function getMessage() {
  return receivedMessage;
}