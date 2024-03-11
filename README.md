a cat programmer's crazy vencord plugins

## How to use?

If you want to use these plugins in your Discord client, please follow the instructions below or watch [this tutorial](https://drive.google.com/file/d/1zlWv4t14ORqy7QuF_Sup7DLkf7pAgS90/view?usp=sharing).

1. Download the latest version of Node.js from [here](https://nodejs.org/en/download/current).
2. Download Git from [here](https://git-scm.com/).
3. Open a terminal and run the following commands:
```bash
npm install -g pnpm
git clone https://github.com/Tolga1452/Vencord.git
cd Vencord
pnpm install --frozen-lockfile
pnpm build
pnpm inject
```

When you want to update your Discord client to the latest version of this fork, just run `npm run update`.

## Plugins

- **[MODIFIED] [Client Theme](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/clientTheme):** Added dynamic colors.
- **[MODIFIED] [Experiments](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/experiments):** Added staging toggle.
- **[ADDED] [Become Catgirl](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/becomeCatgirl):** Turns your messages into a catgirl message.
- **[ADDED] [Talk In Reverse](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/talkInReverse):** Reverses the message content before sending it.
- **[ADDED] [God Mode](https://github.com/Tolga1452/Vencord/tree/main/src/plugins/godMode):** Get all permissions (client-side).
