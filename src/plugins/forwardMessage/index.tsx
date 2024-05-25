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

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { classNameFactory } from "@api/Styles";
import { CheckedTextInput } from "@components/CheckedTextInput";
import { Devs } from "@utils/constants";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { closeModal, ModalContent, ModalHeader, ModalRoot, openModalLazy } from "@utils/modal";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Button, ChannelStore, Forms, GuildStore, Menu, MessageActions, React, UserStore } from "@webpack/common";
import { Message } from "discord-types/general";

function ForwardMessageIcon({ className }: { className?: string; }) {
    return (
        <svg
            viewBox="0 0 24 24"
            height={24}
            width={24}
            className={classes(classNameFactory("vc-forward-")("icon"), className)}
        >
            <path fill="currentColor" d="M21.7 7.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L18.58 9H13a7 7 0 0 0-7 7v4a1 1 0 1 1-2 0v-4a9 9 0 0 1 9-9h5.59l-3.3-3.3a1 1 0 0 1 1.42-1.4l5 5Z"></path>
        </svg>
    );
}

function forwardMessage(content: string, message: Message, channelId: string) {
    const channel = ChannelStore.getChannel(channelId);
    const guild = GuildStore.getGuild(channel.guild_id);
    const user = UserStore.getCurrentUser();

    findByPropsLazy("preload").preload(guild ?? "@me", channelId);

    MessageActions.receiveMessage(channelId, {
        type: 0,
        channel_id: channelId,
        content: content,
        attachments: [],
        embeds: [],
        timestamp: new Date().toISOString(),
        edited_timestamp: null,
        flags: 0,
        components: [],
        id: message.id.replace("1", "2"),
        author: user,
        mentions: [],
        mention_roles: [],
        pinned: false,
        mention_everyone: false,
        tts: false,
        reactions: [],
        message_reference: {
            type: 1,
            channel_id: message.channel_id,
            message_id: message.id,
            guild_id: guild?.id
        },
        message_snapshots: [
            {
                message,
                guild
            }
        ]
    });
}

function validateChannel(input: string) {
    const snowflakeRegex = /^[0-9]{17,19}$/;
    const isSnowflake = snowflakeRegex.test(input);

    if (!isSnowflake) return "Invalid channel ID.";

    const channel = ChannelStore.hasChannel(input);

    if (!channel) return "Invalid channel ID. If the channel exists, please load it by switching first.";

    return true;
}

function ForwardModal({ message }: { message: Message; }) {
    const [channelId, setChannelId] = React.useState(message.channel_id);
    const [messageContent, setMessageContent] = React.useState("");

    return (
        <>
            <Forms.FormTitle className={Margins.top20}>Channel ID to Forward</Forms.FormTitle>
            <br />
            <CheckedTextInput
                value={channelId}
                onChange={setChannelId}
                validate={validateChannel}
            />
            <br />
            <Forms.FormTitle className={Margins.top20}>Message</Forms.FormTitle>
            <br />
            <CheckedTextInput
                value={messageContent}
                onChange={setMessageContent}
                validate={() => true}
            />
            <br />
            <Button onClick={() => {
                forwardMessage(messageContent, message, channelId);
                closeModal("vc-forward-modal");
            }}>
                Forward
            </Button>
            <br />
        </>
    );
}

const messageCtxPatch: NavContextMenuPatchCallback = (children, { message }: { message: Message; }) => {
    const group = findGroupChildrenByChildId("copy-text", children);
    if (!group) return;

    group.splice(group.findIndex(c => c?.props?.id === "reply") + 1, 0, (
        <Menu.MenuItem
            id="vc-forward"
            label="Forward"
            icon={ForwardMessageIcon}
            action={() => openModalLazy(async () => {
                return modalProps => (
                    <ModalRoot {...modalProps}>
                        <ModalHeader>
                            <Forms.FormText>Forward Message</Forms.FormText>
                        </ModalHeader>
                        <ModalContent>
                            <ForwardModal message={message} />
                        </ModalContent>
                    </ModalRoot>
                );
            }, {
                modalKey: "vc-forward-modal"
            })}
        />
    ));
};

export default definePlugin({
    name: "Message Forwarding",
    description: "Allows you to use the Message Forwarding feature (client-side).",
    authors: [(Devs.Tolgchu ?? { name: "✨Tolgchu✨", id: 329671025312923648n })],
    contextMenus: {
        "message": messageCtxPatch
    },
    start() { },
    stop() { },
});
