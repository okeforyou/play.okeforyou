// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

//https://www.joox.com/th/artists
let cachedData; // Variable to cache the fetched data
let cacheExpiryTime = 24 * 60 * 60 * 1000; //  milliseconds

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let artistList = [];
    let artistCategories = [];

    // Check if cached data exists and is not expired
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiryTime) {
      res.status(200).json(cachedData.data);
      return;
    }

    const jooxData = await fetch(`https://www.joox.com/th/artists`);
    const data = await jooxData.text();

    try {
      var match = data.match(
        /(?<=<script id="__NEXT_DATA__" type="application\/json">)(.*?)(?=<\/script>)/
      );
      const jsonData = JSON.parse(match[0]);
      artistList = jsonData.props.pageProps.artistList;
      const artistCategoriesData = jsonData.props.pageProps.artistCategories;

      const artistCategoriesRaw = artistCategoriesData.categories.reduce(
        (acc, cur) => {
          return [...acc, ...cur.tag_list];
        },
        []
      );

      artistCategories = [];

      for (let i = 0; i < artistCategoriesRaw.length; i++) {
        const data = artistCategoriesRaw[i];
        const jooxTagImgData = await axios.get(
          `https://api-jooxtt.sanook.com/openjoox/v1/tag/${data.tag_id}/artists?country=th&lang=th&index=0&num=1`
        );

        const jooxTagImg = jooxTagImgData?.data?.artists?.items;

        artistCategories.push({
          ...data,
          imageUrl: jooxTagImg[0].images[0].url,
        });
      }
    } catch (error) {
      console.log(error);
    }

    const artists = {
      status: "success",
      artist: artistList.map((a) => ({
        name: a.name,
        imageUrl: a.image,
      })),
      artistCategories,
    };

    cachedData = {
      data: artists,
      timestamp: Date.now(),
    };

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json(error);
  }
}
