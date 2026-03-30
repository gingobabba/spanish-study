# Spanish for Guadalajara — Daily Telegram Reminders

Get a Telegram message at **8 AM** and **8 PM** Pacific every day with your Spanish phrases, study routine, and an evening recall quiz — until your trip on May 22.

---

## How it works

| Time (Pacific) | UTC | What you get |
|---|---|---|
| 8:00 AM | 15:00 | Full phrase list for the week + daily routine |
| 8:00 PM | 03:00 | 4 random phrases with spoiler-tag translations + evening task |

The current week is calculated automatically from the study start date (March 29). No database, no server — just a Node script run by GitHub Actions.

---

## Setup

### 1. Create a Telegram bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the prompts (pick any name and username)
3. BotFather will give you a token like `123456789:ABCDefghIJKlmnoPQRsTUVwxyz`
4. Copy it — this is your `TELEGRAM_BOT_TOKEN`

### 2. Get your chat ID

1. Start a conversation with your new bot (search its username and press **Start**)
2. Send any message to the bot (e.g. `/start` or `hello`)
3. Open this URL in your browser, replacing `<token>` with your bot token:
   ```
   https://api.telegram.org/bot<token>/getUpdates
   ```
4. Find `"chat":{"id":` in the JSON response — the number after it is your `TELEGRAM_CHAT_ID`

   Example response snippet:
   ```json
   "chat": { "id": 987654321, "type": "private" }
   ```

### 3. Install dependencies (local testing only)

```bash
npm install
```

### 4. Set up your local `.env` file

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:
```
TELEGRAM_BOT_TOKEN=123456789:ABCDefghIJKlmnoPQRsTUVwxyz
TELEGRAM_CHAT_ID=987654321
```

### 5. Test locally

Send a morning message right now:
```bash
npm run test-message
```

Or test a specific time of day:
```bash
npm run test-morning
npm run test-evening
```

### 6. Push to GitHub

```bash
git init
git add .
git commit -m "Add Spanish study Telegram notifier"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 7. Add GitHub Actions secrets

1. Go to your repo on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret** and add both:

   | Name | Value |
   |---|---|
   | `TELEGRAM_BOT_TOKEN` | your bot token from BotFather |
   | `TELEGRAM_CHAT_ID` | your chat ID number |

That's it. GitHub Actions will pick up the workflow and fire at 8 AM and 8 PM Pacific automatically.

---

## Manual trigger

You can send a message on demand without waiting for the schedule:

1. Go to **Actions** tab in your GitHub repo
2. Select **Daily Spanish Reminder**
3. Click **Run workflow**
4. Choose `morning` or `evening` and run

---

## Files

```
├── send-message.js               # Main notification script
├── package.json                  # npm scripts + dotenv dependency
├── .env.example                  # Credential template (safe to commit)
├── .env                          # Your real credentials (gitignored)
├── .gitignore
├── .github/
│   └── workflows/
│       └── daily-message.yml     # GitHub Actions schedule
├── index.html                    # The study web app
└── spanish_study_plan.md         # Source study plan
```

---

## Cron schedule note

GitHub Actions uses UTC. The workflow is set for:
- `0 15 * * *` → 15:00 UTC = **8:00 AM PDT** (UTC-7, used May–Nov)
- `0 3 * * *`  → 03:00 UTC = **8:00 PM PDT**

In winter (PST, UTC-8) the messages will arrive at 7 AM / 7 PM instead. Adjust the cron values if needed.
