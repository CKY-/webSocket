import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
WS_EVENT_SOURCE,WSEvent
} from "../constants";

export const WSEventSource: EventSource = {
    id: WS_EVENT_SOURCE,
    name: "WS",
    events: [
        {
            id: WSEvent,
            name: "WS Message Received",
            description: "When a message is received",
            manualMetadata: {
                data: "Test data",
            },
        }
    ],
};