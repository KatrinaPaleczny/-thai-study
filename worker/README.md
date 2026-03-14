# API Proxy (Cloudflare Worker)

A lightweight proxy that keeps your Claude API key on the server instead of in the browser.

## Setup

1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up
2. Install the Wrangler CLI:
   ```
   npm install -g wrangler
   ```
3. Log in:
   ```
   wrangler login
   ```
4. Deploy the worker:
   ```
   cd worker
   wrangler deploy
   ```
5. Set your API key as a secret (it will prompt you to paste it):
   ```
   wrangler secret put ANTHROPIC_API_KEY
   ```
6. Copy the Worker URL from the deploy output (looks like `https://katthai-api-proxy.<your-subdomain>.workers.dev`)
7. Paste it into the app: **Settings > API Proxy > Proxy URL**

## How it works

- Your browser sends conversation data to the Worker (no API key included)
- The Worker adds your API key server-side and forwards to Anthropic
- The API key never touches the browser

## Cost

Cloudflare Workers free tier includes 100,000 requests/day — more than enough for personal use.
