import axios from "axios";

export default async function handler(req, res) {
  const { videoId } = req.query;

  try {
    const response = await axios.get(
      `https://invidious.fdn.fr/api/v1/videos/${videoId}`,
      {
        params: {
          fields: "recommendedVideos",
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video information" });
  }
}
