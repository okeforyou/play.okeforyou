// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let songList = [];

    const jooxData = await axios.get(`https://www.joox.com/th/chart/128`);
    try {
      var match = jooxData.data.match(
        /(?<=<script id="__NEXT_DATA__" type="application\/json">)(.*?)(?=<\/script>)/
      );
      const jsonData = JSON.parse(match[0]);
      songList = jsonData.props.pageProps.trackList.tracks.items;
    } catch (error) {
      console.log(error);
    }

    const topics = {
      status: "success",
      singles: songList.map((a) => ({
        title: a.name,
        artist_name: a.artist_list[0].name,
        coverImageURL: a.images[0].url,
      })),
    };

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json(error);
  }
}
