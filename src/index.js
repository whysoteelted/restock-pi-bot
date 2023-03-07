import Parser from "rss-parser";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";

dotenv.config();

const RSS_FEED = process.env.RSS_FEED || 'https://rpilocator.com/feed/?country=IT';
const REQUEST_INTERVAL = process.env.REQUEST_INTERVAL || 300000;
const BOT_TOKEN = process.env.BOT_API_TOKEN || '';
const CHANNEL_ID = process.env.CHANNEL_ID || '';

const parser = new Parser();
const bot = new Telegraf(BOT_TOKEN);
let lastGuid = '';
let feedItems = [];

const sendTelegramMessage =async (msg) => {
  await bot.telegram.sendMessage(CHANNEL_ID, msg);
}

const checkFeed = async () => {
  const feed = await parser.parseURL(RSS_FEED);
  for (const item of feed.items) {
    if (item.guid === lastGuid) {
      break;
    }
    feedItems.push(item);
  }
  return feedItems;
};

const bulkSendTelegramMessages = async (filteredFeedItems) => {
  const messagesToBeSent = filteredFeedItems.slice().reverse();
  if (messagesToBeSent.length > 0) {
    for (let i = 0; i < messagesToBeSent.length; i++) {
      const item = messagesToBeSent[i];
      if (i === messagesToBeSent.length - 1) { lastGuid = item.guid };
      setTimeout(async () => sendTelegramMessage(item.title + ': ' + item.link), 2000 * i);
    }
  }
}

setInterval(async () => {
  const newFeed = await checkFeed();
  bulkSendTelegramMessages(newFeed);
  feedItems = [];
}, REQUEST_INTERVAL);
