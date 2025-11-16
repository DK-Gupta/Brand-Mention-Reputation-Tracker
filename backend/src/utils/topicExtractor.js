export default function extractTopics(text) {
  if (!text) return ["general"]; // safety check

  text = text.toLowerCase();

  const topics = [];

  if (text.includes("price") || text.includes("cost")) topics.push("pricing");
  if (text.includes("support") || text.includes("help") || text.includes("service")) topics.push("customer_support");
  if (text.includes("delivery") || text.includes("shipping") || text.includes("arrival")) topics.push("delivery");
  if (text.includes("quality") || text.includes("build") || text.includes("material")) topics.push("product_quality");
  if (text.includes("launch") || text.includes("release") || text.includes("event")) topics.push("launch_news");
  if (text.includes("review") || text.includes("rating")) topics.push("reviews");
  if (text.includes("battery") || text.includes("charge") || text.includes("power")) topics.push("battery");

  if (topics.length === 0) topics.push("general");

  return topics;
}
