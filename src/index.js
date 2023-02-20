import Parser from "rss-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const RSS_FEED = process.env.RSS_FEED || 'https://rpilocator.com/feed/?country=IT';
export const REQUEST_INTERVAL = 20000;

const parser = new Parser();
const BOT_TOKEN = process.env.BOT_API_TOKEN || ''
const CHANNEL_ID = process.env.CHANNEL_ID || ''

const sendTelegramMessage = (msg) => {
  console.log('bot', BOT_TOKEN, 'cid', CHANNEL_ID, 'msg', msg);
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHANNEL_ID}&text=${msg}`, {method: 'POST'})
    .then((response) => response.json())
    .then((data) => console.log(data));
}

const getFeed = async () => {
  const feed = await parser.parseURL(RSS_FEED);
  console.log(feed);
  feed.items.forEach(item => {
    sendTelegramMessage(item.title + ': ' + item.link)
  });
}

setInterval(() => {
  getFeed();
}, REQUEST_INTERVAL);
