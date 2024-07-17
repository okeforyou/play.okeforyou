import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

const getAccessToken = async () => {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    null,
    {
      params: {
        grant_type: "client_credentials",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;

  return accessToken;
};

export { getAccessToken };
