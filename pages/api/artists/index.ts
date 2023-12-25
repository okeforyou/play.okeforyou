// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

//https://www.joox.com/th/artists

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let artistList = [];
    let artistCategories = [];

    const jooxData = await axios.get(`https://www.joox.com/th/artists`);
    try {
      var match = jooxData.data.match(
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

        artistCategories.push({ ...data, image: jooxTagImg[0].images[0].url });
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

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json(error);
  }
}
