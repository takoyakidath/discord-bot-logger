# Discord Bot Logger

A Discord bot that logs various server events including channel updates, member activities, and message changes.

## Features

- Server event logging
- Message tracking (updates & deletions)
- Member activity monitoring
- Channel state tracking
- Voice channel activity logging
- Invite creation tracking
- Guild updates monitoring

## Prerequisites

- Node.js (see `.nvmrc` for version)
- pnpm
- Discord Bot Token and Client ID

## Installation

1. Clone the repository:

```bash
git clone https://github.com/minagishl/discord-bot-logger.git
cd discord-bot-logger
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your Discord bot credentials:

```env
DISCORD_TOKEN='YOUR_DISCORD_BOT_TOKEN'
DISCORD_CLIENT_ID='YOUR_DISCORD_CLIENT_ID'
```

4. Register slash commands:

```bash
pnpm register
```

5. Build and start the bot:

```bash
pnpm build
pnpm start
```

For development:

```bash
pnpm dev
```

## Available Commands

- `/ping` - Check bot latency

## Development Scripts

- `pnpm start` - Start the bot
- `pnpm build` - Build the project
- `pnpm register` - Register slash commands
- `pnpm dev` - Run in development mode

## Docker Support

You can also run the bot using Docker:

```bash
docker build -t discord-bot-logger .
docker run -d --env-file .env discord-bot-logger
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
