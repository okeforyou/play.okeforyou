import axios from "axios";

import { getAccessToken } from "../../../services/spotify";
import { SearchPlaylists } from "../../../types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchPlaylists | { error: string }>
) {
  try {
    const accessToken = await getAccessToken();
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Step 1: Search for playlists
    const searchResponse = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: "playlist",
          // market: "TH", // Specify market if needed
          limit: 20, // Adjust the limit as needed
        },
      }
    );

    // Step 2: Map the response to match PlaylistCategory format
    const artistCategories = searchResponse.data.playlists.items.map(
      (playlist: any, index: number) => ({
        tag_id: playlist.id,
        tag_name: playlist.name,
        imageUrl: playlist.images[0]?.url || "",
      })
    );

    const response: SearchPlaylists = {
      status: "success",
      artistCategories,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
