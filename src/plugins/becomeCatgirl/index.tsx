/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import { addChatBarButton, ChatBarButton, removeChatBarButton } from "@api/ChatButtons";
import { addPreSendListener, removePreSendListener, SendListener } from "@api/MessageEvents";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { React, useEffect, useState } from "@webpack/common";

let lastState = false;

const CatgirlMessageToggle: ChatBarButton = ({ isMainChat }) => {
    const [enabled, setEnabled] = useState(lastState);

    function setEnabledValue(value: boolean) {
        lastState = value;

        setEnabled(value);
    }

    useEffect(() => {
        const listener: SendListener = async (_, message) => {
            if (enabled) {
                if (!(/^[!@#$%^&*(),.?":{}|<>\-_\\/]/.test(message.content))) {
                    try {
                        const response = await fetch("https://tolgchu-proxy.glitch.me/aesthetic-ai", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                hint: "character",
                                messages: [
                                    {
                                        by: "system",
                                        text: "You can't talk with users. Your only job is turning the given message content into a cute catgirl message. You won't try to talk even if the user tries to talk with you. Instead, you will only do your job. You can use *italic* texts to add effects and add ~ at the end of the words to make them better. Additionally, you can use kaomojis (no emojis, you can only use kaomojis) or you can make words longer like heeeyy to add more effects. You won't make messages much longer. If the user screams with uppercase letters, keep the scream effect, don't make it lowercase."
                                    },
                                    {
                                        by: "user",
                                        text: `The user is talking to someone else, you will just do your job. The message content to turn into catgirl message:\n${message.content}`
                                    }
                                ]
                            })
                        });

                        if (response.ok) message.content = await response.text();
                    } catch (error) {
                    }
                }
            }
        };

        addPreSendListener(listener);
        return () => void removePreSendListener(listener);
    }, [enabled]);

    if (!isMainChat) return null;

    return (
        <ChatBarButton
            tooltip={enabled ? "Disable Catgirl Message" : "Enable Catgirl Message"}
            onClick={() => setEnabledValue(!enabled)}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ scale: "1.2" }}
            >
                <path fill="currentColor" mask="url(#__)" d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z" />
                {!enabled && <>
                    <mask id="__">
                        <path fill="#fff" d="M0 0h24v24H0Z" />
                        <path stroke="#000" stroke-width="5.99068" d="M0 24 24 0" />
                    </mask>
                    <path fill="var(--status-danger)" d="m21.178 1.70703 1.414 1.414L4.12103 21.593l-1.414-1.415L21.178 1.70703Z" />
                </>}
            </svg>
        </ChatBarButton>
    );
};

export default definePlugin({
    name: "Become Catgirl",
    authors: [(Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })],
    description: "Turns your messages into catgirl messages. I'm lazy to fix the icon so it's invisible.",
    dependencies: ["MessageEventsAPI", "ChatInputButtonAPI"],

    start: () => addChatBarButton("CatgirlMessageToggle", CatgirlMessageToggle),
    stop: () => removeChatBarButton("CatgirlMessageToggle")
});
