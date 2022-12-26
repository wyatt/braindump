# Brain Dump
I made this small app to help me relieve stress before I went to bed by putting all my thoughts, worries and things I needed to get done into a nicely formatted, approachable list and journal entry. Brain dumping is a [well known](https://psychcentral.com/health/using-brain-dumping-to-manage-anxiety-and-over-thinking) strategy for better sleep, greater productivity and overall a sense of wellbeing. I hope my app can give you some value too! I welcome any suggestions, feel free to Fork and remix it however you want 😊 If you find real value from this and want to support me, please consider donating a few dollars 💸.

<a href="https://www.buymeacoffee.com/wyattsell" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 30px !important;width: 109px !important;" ></a>

## Technologies
- 🌐 NextJS (w/ API routes)
- 🤖 OpenAI GPT-3 (text-davinci-003)
- 🎙️ Browser speech recognition w/ Speechly as a fallback (react-speech-recongition)
- 🎨 Chakra UI

## Usage
Demo: https://braindump-liart.vercel.app (This has a fairly restrictive rate limit of 5 reqs per hour, as GPT-3 is not cheap!)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwyatt%2Fbraindump&env=OPENAI_API_KEY,NEXT_PUBLIC_SPEECHLY_APP_ID&envDescription=Your%20API%20key%20for%20OpenAI%20and%20your%20Speechly%20App%20ID&envLink=https%3A%2F%2Fgithub.com%2Fwyatt%2Fbraindump%2FREADME.md&project-name=braindump&repository-name=braindump&demo-title=Brain%20Dump&demo-description=A%20GPT-3%20powered%20Braimdump%20tool%2C%20to%20help%20relieve%20stress.%20It%20will%20generate%20a%20todo%20list%20and%20a%20helpful%20journal%20entry%20based%20on%20what%20you%20say.&demo-url=https%3A%2F%2Fbraindump.wyattsell.com)

The above button will allow you to easily deploy this app to your own Vercel account. It'll do most of the heavy-lifting for you, but there are two environment variables you'll need to set:
- `OPENAI_API_KEY`: You can create one in your OpenAI account page (https://beta.openai.com/account/api-keys), here's a nice [blog post](https://elephas.app/blog/how-to-create-openai-api-keys-cl5c4f21d281431po7k8fgyol0) explaining it step-by-step
- `NEXT_PUBLIC_SPEECHLY_APP_ID`: Create a Speechly account and a new application (https://docs.speechly.com/basics/getting-started), and copy the App ID

Have fun! 🥳
