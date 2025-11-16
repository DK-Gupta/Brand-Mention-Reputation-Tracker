import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const REDDIT_TOKEN_URL = "https://www.reddit.com/api/v1/access_token";

let redditToken = null;

// Get Reddit OAuth Token
export const getRedditToken = async () => {
  const creds = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    REDDIT_TOKEN_URL,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  redditToken = res.data.access_token;
  return redditToken;
};

// Fetch mentions from Reddit search API
export const fetchRedditMentions = async (keyword) => {
  if (!redditToken) await getRedditToken();

  const url = `https://oauth.reddit.com/search?q=${encodeURIComponent(
    keyword
  )}&limit=10`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${redditToken}` }
  });

  return res.data.data.children.map((post) => ({
    content: post.data.title,
    username: post.data.author,
    timestamp: new Date(post.data.created_utc * 1000),
    url: `https://reddit.com${post.data.permalink}`,
    source: "reddit"
  }));
};
