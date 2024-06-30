/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Logger } from "@utils/Logger";

import randomId from "./randomId";

export default function overwriteRequest(method: string, endpoint: string, ...overwrites: string[]) {
    try {
        const id = randomId();
        const run = `
                        const ${id} = Vencord.Webpack.findByProps("J9", "Jt", "tn").tn.${method};

                        Vencord.Webpack.findByProps("J9", "Jt", "tn").tn.${method} = async (...parameters) => {
                            if (parameters?.[0]?.url?.startsWith('${endpoint}')) {
                                const result = {
                                    ok: true,
                                    status: 200,
                                    statusText: "OK"
                                };

                                ${overwrites.join("\n\n")}

                                return result;
                            } else return ${id}(...parameters);
                        };
                    `;

        eval(run);
    } catch (error) {
        new Logger("Saved Messages").error(`${error}\n\nIf you didn't receive the "Failed to start Saved Messages" error, the means the plugin fixed itself.`);

        throw error;
    }
}
