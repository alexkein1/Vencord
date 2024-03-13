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

import { addContextMenuPatch, removeContextMenuPatch } from "@api/ContextMenu";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { Clipboard, Menu, React } from "@webpack/common";
import { definePluginSettings } from "@api/Settings";

interface Emoji {
    type: "emoji",
    id: string,
    name: string;
}

const settings = definePluginSettings({
    formattedString: {
        type: OptionType.BOOLEAN,
        description: "Use formatted string instead of emoji ID.",
        default: false
    }
});

export default definePlugin({
    name: "CopyEmojiID",
    description: "Adds button to copy emoji ID!",
    authors: [Devs.HAPPY_ENDERMAN, Devs.ANIKEIPS],
    settings,
    
    expressionPickerPatch(children, props) {
        if (!props.alreadyPatched) {
            const data = props.target.dataset as Emoji;
            const firstChild = props.target.firstChild as HTMLImageElement;
            const isAnimated = firstChild && new URL(firstChild.src).pathname.endsWith(".gif");
            if (data.type === "emoji" && data.id) {
                children.push(<Menu.MenuItem
                    id="copy-emoji-id"
                    key="copy-emoji-id"
                    label={settings.store.formattedString ? "Copy as formatted string" : "Copy Emoji ID"}
                    action={() => {
                        if (settings.store.formattedString) {
                            const formatted_emoji_string = `${isAnimated ? "<a:" : "<:"}${data.name}:${data.id}>`;
                        } else {
                            const formatted_emoji_string = `${data.id}`;
                        }
                        Clipboard.copy(formatted_emoji_string);
                    }}
                />);
            }
            props.alreadyPatched = true;
        }
    },
    start() {
        addContextMenuPatch("expression-picker", this.expressionPickerPatch);
    },
    stop() {
        removeContextMenuPatch("expression-picker", this.expressionPickerPatch);
    }
});
