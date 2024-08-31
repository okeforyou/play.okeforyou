import axios from "axios";

export default async function handler(req, res) {
  const { q, type, page, region, fields } = req.query;
  try {
    const response = await axios.get(
      `https://${process.env.NEXT_PUBLIC_INVIDIOUS_URL}/api/v1/search`,
      {
        params: { q, type, page, region, fields },
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
