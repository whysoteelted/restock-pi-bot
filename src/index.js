import Parser from "rss-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const parser = new Parser();

const RSS_FEED = process.env.RSS_FEED || 'https://rpilocator.com/feed/?country=IT';
const REQUEST_INTERVAL = process.env.REQUEST_INTERVAL || 300000;

const BOT_TOKEN = process.env.BOT_API_TOKEN || ''
const CHANNEL_ID = process.env.CHANNEL_ID || ''

const sendTelegramMessage = (msg) => {
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHANNEL_ID}&text=${msg}`, {method: 'POST'})
    .then((response) => response.json())
    .then((data) => console.log(data));
}

const getFeedAndSend = async () => {
  const feed = await parser.parseURL(RSS_FEED);
  feed.items.forEach(item => {
    sendTelegramMessage(item.title + ': ' + item.link)
  });
}

setInterval(() => {
  getFeedAndSend();
}, REQUEST_INTERVAL);
