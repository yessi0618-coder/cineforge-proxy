export default async function handler(req, res) {
  // Allow requests from any origin (CORS fix)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  if (!PEXELS_KEY) {
    return res.status(500).json({ error: "PEXELS_API_KEY not configured" });
  }

  // Build Pexels URL from query params
  const { query, per_page = 5, orientation = "landscape", size = "large" } = req.query;
  if (!query) {
    return res.status(400).json({ error: "query param required" });
  }

  const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}&orientation=${orientation}&size=${size}`;

  try {
    const response = await fetch(pexelsUrl, {
      headers: { Authorization: PEXELS_KEY },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Pexels error ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
