"use strict";
import { basename } from "path"
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { sendMessage } from "../../remote"
/**
 * The Expression State Effect
 */
export const sendRawMessage: Firebot.EffectType<{
    message: string
}> = {
    /**
    * The definition of the Effect
    */
    definition: {
        id: "WSRAW:sendMessage",
        name: "WSRAW Send Message",
        description: "Send a Message to the connected websocket",
        icon: "fad fa-file-edit",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
        <eos-container header="Data" pad-top="true">
            <p class="muted">This is the data that will be sent to the WebSocket Connection. Can be text or another replace phrase.</p>
            <selectable-input-editors
                editors="editors"
                initial-editor-label="initialEditorLabel"
                model="effect.message"
            />
            <p class="muted" style="font-size: 11px;"><b>Note:</b> If data is a valid JSON string, it will be parsed into an object or array.</p>
        </eos-container>


    `,
    /**
    * The controller for the front end Options
    * Port over from effectHelperService.js
    */
    optionsController: ($scope) => {
        $scope.editors = [
            {
                label: "Basic",
                inputType: "text",
                useTextArea: true,
                placeholderText: "Enter data",
                menuPosition: "under"
            },
            {
                label: "JSON",
                inputType: "codemirror",
                menuPosition: "under",
                codeMirrorOptions: {
                    mode: { name: "javascript", json: true },
                    theme: 'blackboard',
                    lineNumbers: true,
                    autoRefresh: true,
                    showGutter: true
                }
            }
        ];

        $scope.initialEditorLabel = $scope.effect?.message?.startsWith("{") || $scope.effect?.message?.startsWith("[") ? "JSON" : "Basic";  
    },
    /**
    * When the effect is triggered by something
    * Used to validate fields in the option template.
    */
    optionsValidator: effect => {
        const errors = [];
        if (effect.message == null || effect.message === "") {
            errors.push("Message field cant be blank");
        }
        return errors;
    },
    /**
    * When the effect is triggered by something
    */
    onTriggerEvent: async event => {
        sendMessage(event.effect.message);
        return true;
    }
};