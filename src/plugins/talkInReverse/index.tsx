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

const ReverseMessageToggle: ChatBarButton = ({ isMainChat }) => {
    const [enabled, setEnabled] = useState(lastState);

    function setEnabledValue(value: boolean) {
        lastState = value;

        setEnabled(value);
    }

    useEffect(() => {
        const listener: SendListener = async (_, message) => {
            if (enabled && message.content) message.content = message.content.split("").reverse().join("");
        };

        addPreSendListener(listener);
        return () => void removePreSendListener(listener);
    }, [enabled]);

    if (!isMainChat) return null;

    return (
        <ChatBarButton
            tooltip={enabled ? "Disable Reverse Message" : "Enable Reverse Message"}
            onClick={() => setEnabledValue(!enabled)}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ scale: "1.2" }}
            >
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
    name: "Talk In Reverse",
    authors: [(Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })],
    description: "Reverses the message content before sending it.",
    dependencies: ["MessageEventsAPI", "ChatInputButtonAPI"],

    start: () => addChatBarButton("ReverseMessageToggle", ReverseMessageToggle),
    stop: () => removeChatBarButton("ReverseMessageToggle")
});
