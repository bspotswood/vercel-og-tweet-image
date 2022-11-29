// Based on Lee Robinson's Twitter API wrapper

import { TweetV2, TwitterApi } from "twitter-api-v2";

const twitterApi = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// https://github.com/leerob/leerob.io/blob/main/lib/twitter.ts
export const getTweets = async (ids) => {
  if (ids.length === 0) {
    return [];
  }

  const tweets = await twitterApi.v2.tweets(ids, {
    expansions: [
      "author_id",
      "attachments.media_keys",
      "referenced_tweets.id",
      "referenced_tweets.id.author_id",
    ],
    "tweet.fields": [
      "attachments",
      "author_id",
      "public_metrics",
      "created_at",
      "id",
      "in_reply_to_user_id",
      "referenced_tweets",
      "text",
    ],
    "user.fields": [
      "id",
      "name",
      "profile_image_url",
      "protected",
      "url",
      "username",
      "verified",
    ],
    "media.fields": [
      "duration_ms",
      "height",
      "media_key",
      "preview_image_url",
      "type",
      "url",
      "width",
      "public_metrics",
    ],
  });

  const getAuthorInfo = (author_id) => {
    return tweets.includes.users.find((user) => user.id === author_id);
  };

  const getReferencedTweets = (mainTweet: TweetV2) => {
    return (
      mainTweet?.referenced_tweets?.map((referencedTweet) => {
        const fullReferencedTweet = tweets.includes.tweets.find(
          (tweet) => tweet.id === referencedTweet.id
        );

        return {
          type: referencedTweet.type,
          author: getAuthorInfo(fullReferencedTweet.author_id),
          ...fullReferencedTweet,
        };
      }) || []
    );
  };

  const buildMappedTweet = (tweet: TweetV2) => {
    return {
      ...tweet,
      media:
        tweet?.attachments?.media_keys.map((key) =>
          tweets.includes.media.find((media) => media.media_key === key)
        ) || [],
      referenced_tweets: getReferencedTweets(tweet),
      author: getAuthorInfo(tweet.author_id),
    };
  };

  return (tweets.data.reduce((allTweets, tweet) => {
    return [buildMappedTweet(tweet), ...allTweets];
  }, []) || []) as typeof buildMappedTweet[];
};
