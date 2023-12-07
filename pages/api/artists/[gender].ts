// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";

//https://www.joox.com/th/artists

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { gender } = req.query;
    const genderTagConfig = {
      "1": 193,
      "2": 195,
      "3": 197,
    };
    if (Array.isArray(gender)) gender = gender[0];

    const tag = genderTagConfig[gender];

    const male = await axios.get(
      `https://api-jooxtt.sanook.com/openjoox/v1/tag/${tag}/artists?country=th&lang=th&index=0&num=36`
    );

    const data = male?.data?.artists?.items;

    const artists = {
      status: "success",
      artist: data.map((a) => ({
        name: a.name,
        imageUrl: a.images[0].url,
      })),
    };

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json(error);
  }
}
