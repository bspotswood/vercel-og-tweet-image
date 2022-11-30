import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import Tweet from "../../components/og/Tweet";
import { getTweets } from "../../lib/twitter";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const tid = searchParams.get("tid");
    if (!tid) {
      return new Response("No tid provided", { status: 400 });
    }

    const tweets = await getTweets([tid]);
    if (tweets.length === 0) {
      return new Response("No tweets found", { status: 404 });
    }

    const tweet = tweets[0];

    return new ImageResponse(
      (
        // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Tweet
            id={tweet.id}
            text={tweet.text}
            author={tweet.author}
            media={tweet.media}
            created_at={tweet.created_at}
            public_metrics={tweet.public_metrics}
            referenced_tweets={tweet.referenced_tweets}
          />
        </div>
      ),
      {
        width: 672,
        height: 'auto',
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
