/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { showToast, Toasts } from "@webpack/common";

import overwriteRequest from "./utils/overwriteRequest";

const settings = definePluginSettings({
    databaseId: {
        type: OptionType.STRING,
        description: "[DEVELOPER ONLY] Database ID",
        default: "saved_messages",
        restartNeeded: true
    }
});

export default definePlugin({
    name: "Saved Messages",
    description: "Makes the Message Reminders and Message Bookmarks features work client-side. Make sure to enable the experiments.",
    authors: [(Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })],
    settings,
    start() {
        function getSavedMessages() {
            overwriteRequest("get", "/saved-messages", `
            const savedMessages = (await eval('Vencord.Api.DataStore.get("${settings.store.databaseId}")')) ?? [];

            result.body = {
                saved_messages: savedMessages
            };
        `);
        }

        try {
            getSavedMessages();
        } catch (error) {
            try {
                getSavedMessages();
            } catch (e) {
                showToast("Failed to load a function for Saved Messages plugin. Please reload Discord to try again.", Toasts.Type.FAILURE);
            }
        }

        function postSavedMessages() {
            overwriteRequest("post", "/saved-messages", `const databaseId = "${settings.store.databaseId}";`, "const added = parameters[0].body.added; const removed = parameters[0].body.removed; await eval(`Vencord.Api.DataStore.update(\"${databaseId}\", messages => { let newMessages = (messages ?? []).filter(message => !${JSON.stringify(removed)}.some(m => m.message_id === message.message_id && m.type === message.type)); newMessages = newMessages.concat(${JSON.stringify(added)}); return newMessages; })`); const messages = (await eval(`Vencord.Api.DataStore.get(\"${databaseId}\")`)) ?? []; result.body = { saved_messages: messages };");
        }

        try {
            postSavedMessages();
        } catch (error) {
            try {
                postSavedMessages();
            } catch (e) {
                showToast("Failed to load a function for Saved Messages plugin. Please reload Discord to try again.", Toasts.Type.FAILURE);
            }
        }
    },
    stop() { }
});
