import { format } from 'date-fns';
import { MediaObjectV2, TweetPublicMetricsV2, UserV2 } from 'twitter-api-v2';
import { ReferencedTweetWithAuthor } from '../../lib/twitter';

/**
 * Supports plain text, images, quote tweets.
 *
 * Needs support for images, GIFs, and replies maybe?
 * Styles use !important to override Tailwind .prose inside MDX.
 */
export default function Tweet({
  text,
  id,
  author,
  media,
  created_at,
  public_metrics,
  referenced_tweets,
  scale = 1,
}: {
  text: string;
  id: string;
  author: UserV2;
  media: MediaObjectV2[];
  created_at?: string;
  public_metrics?: TweetPublicMetricsV2;
  referenced_tweets?: ReferencedTweetWithAuthor[];
  scale?: number;
}) {
  const authorUrl = `https://twitter.com/${author.username}`;
  const likeUrl = `https://twitter.com/intent/like?tweet_id=${id}`;
  const retweetUrl = `https://twitter.com/intent/retweet?tweet_id=${id}`;
  const replyUrl = `https://twitter.com/intent/tweet?in_reply_to=${id}`;
  const tweetUrl = `https://twitter.com/${author.username}/status/${id}`;
  const createdAt = new Date(created_at);

  const formattedText = text
    .replace(/https:\/\/[\n\S]+/g, '')
    .replace('&amp;', '&');
  const quoteTweet =
    referenced_tweets && referenced_tweets.find((t) => t.type === 'quoted');

  return (
    <div tw="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 px-6 py-4 my-4 w-full bg-white dark:bg-gray-900"
      style={{
        fontSize: 16 * scale,
      }}
    >
      <div tw="flex w-full">
        <a
          tw="flex"
          style={{
            height: 48 * scale,
            width: 48 * scale,
          }}
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            height={48 * scale}
            width={48 * scale}
            src={author.profile_image_url}
            tw="rounded-full"
          />
        </a>
        <a
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          tw="flex flex-col ml-4"
        >
          <span
            tw="flex items-center font-bold text-gray-900 dark:text-gray-100"
            style={{
              lineHeight: '1.25rem',
            }}
            title={author.name}
          >
            {author.name}
            {author.verified ? (
              <svg
                aria-label="Verified Account"
                className="ml-1 text-blue-500 dark:text-white inline h-4 w-4"
                viewBox="0 0 24 24"
              >
                <g fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </g>
              </svg>
            ) : null}
          </span>
          <span tw="text-gray-500" title={`@${author.username}`}>
            @{author.username}
          </span>
        </a>
        <a
          tw="ml-auto"
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            viewBox="328 355 335 276"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 630, 425    A 195, 195 0 0 1 331, 600    A 142, 142 0 0 0 428, 570    A  70,  70 0 0 1 370, 523    A  70,  70 0 0 0 401, 521    A  70,  70 0 0 1 344, 455    A  70,  70 0 0 0 372, 460    A  70,  70 0 0 1 354, 370    A 195, 195 0 0 0 495, 442    A  67,  67 0 0 1 611, 380    A 117, 117 0 0 0 654, 363    A  65,  65 0 0 1 623, 401    A 117, 117 0 0 0 662, 390    A  65,  65 0 0 1 630, 425    Z"
              fill='#3BA9EE'
            />
          </svg>
        </a>
      </div>
      <div tw="mt-4 mb-1 text-gray-700 dark:text-gray-200">
        {formattedText}
      </div>
      {media && media.length ? (
        <Media media={media} />
      ) : null}
      {quoteTweet ? <Tweet {...quoteTweet} /> : null}
      <a
        tw="text-gray-500 text-sm hover:!underline"
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <time
          title={`Time Posted: ${createdAt.toUTCString()}`}
          dateTime={createdAt.toISOString()}
        >
          {format(createdAt, 'h:mm a - MMM d, y')}
        </time>
      </a>
      <div tw="flex text-sm text-gray-700 mt-2">
        <a
          tw="flex items-center mr-4 text-gray-500"
          href={replyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg tw="mr-2" width="18" height="18" viewBox="0 0 24 24">
            <path
              fill='#666'
              d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.045.286.12.403.143.225.385.347.633.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.368-3.43-7.788-7.8-7.79zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.334-.75-.75-.75h-.395c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
            />
          </svg>
          <span>
            {new Number(public_metrics.reply_count).toLocaleString('en', {
              notation: 'compact'
            })}
          </span>
        </a>
        <a
          tw="flex items-center mr-4 text-gray-500"
          href={retweetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg tw="mr-2" width="18" height="18" viewBox="0 0 24 24">
            <path
              fill='#666'
              d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
            />
          </svg>
          <span>
            {new Number(public_metrics.retweet_count).toLocaleString('en', {
              notation: 'compact'
            })}
          </span>
        </a>
        <a
          tw="flex items-center mr-4 text-gray-500"
          href={likeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg tw="mr-2" width="18" height="18" viewBox="0 0 24 24">
            <path
              fill='#666'
              d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.813-1.148 2.353-2.73 4.644-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.375-7.454 13.11-10.037 13.156H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.035 11.596 8.55 11.658 1.52-.062 8.55-5.917 8.55-11.658 0-2.267-1.822-4.255-3.902-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.015-.03-1.426-2.965-3.955-2.965z"
            />
          </svg>
          <span>
            {new Number(public_metrics.like_count).toLocaleString('en', {
              notation: 'compact'
            })}
          </span>
        </a>
      </div>
    </div>
  );
}

function Media({ media, scale = 1 }: { media: MediaObjectV2[], scale?: number }) {
  if (!media || media.length == 0) return null;

  const previewBox: Rect = {
    width: 620 * scale,
    height: 340 * scale,
  };

  const mediaTiles = calculatePreviewTiles(previewBox, media);

  return (
    <div tw="flex justify-between w-full">
      {mediaTiles.map((column, colIdx) => {
        console.log("column", column);
        return (
          <div
            key={column.tiles.map((tile) => tile.media.media_key).join('+')}
            tw="flex flex-col justify-between"
            style={{
              height: previewBox.height,
              width: column.width,
              overflow: 'hidden',
            }}>
            {column.tiles.map((tile, tileIdx) => {
              const isFirstColumn = colIdx === 0;
              const isLastColumn = colIdx === mediaTiles.length - 1;
              const isFirstRow = tileIdx === 0;
              const isLastRow = tileIdx === column.tiles.length - 1;
              const twWithRounding = "flex overflow-hidden"
                + (isFirstColumn && isFirstRow ? " rounded-tl-2xl" : "")
                + (isFirstColumn && isLastRow ? " rounded-bl-2xl" : "")
                + (isLastColumn && isFirstRow ? " rounded-tr-2xl" : "")
                + (isLastColumn && isLastRow ? " rounded-br-2xl" : "");

              return (
                <div
                  tw={twWithRounding}
                  key={tile.media.media_key}
                  style={{
                    height: column.height,
                  }}>
                  <img
                    style={{
                      height: tile.height,
                      width: tile.width,
                      marginLeft: tile.offsetX,
                      marginTop: tile.offsetY,
                    }}
                    src={tile.media.url}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>);
}

type Rect = {
  width: number;
  height: number;
}

type Offset = {
  offsetX: number;
  offsetY: number;
}

function scaleToFit(img: Partial<Rect>, window: Rect) {
  if (!img.width || !img.height) {
    return {
      width: window.width,
      height: window.height,
      offsetX: 0,
      offsetY: 0,
    }
  }

  const deltaX = window.width - img.width;
  const deltaY = window.height - img.height;
  const scaleDirection = deltaX > 0 || deltaY > 0 ? 'up' : 'down';
  const scaleRatio = scaleDirection == 'up' ?
    Math.max(window.width / img.width, window.height / img.height) :
    Math.max(window.width / img.width, window.height / img.height);

  const finalHeight = img.height * scaleRatio;
  const finalWidth = img.width * scaleRatio;

  const offsetX = (window.width - finalWidth) / 2;
  const offsetY = (window.height - finalHeight) / 2;

  return {
    height: finalHeight,
    width: finalWidth,
    offsetX,
    offsetY,
  }
}

type PositionedMedia = {
  media: MediaObjectV2;
} & Rect & Offset;

type TiledMedia = ({
  tiles: PositionedMedia[];
} & Rect);


function calculatePreviewTiles(previewBox: Rect, media: MediaObjectV2[]): TiledMedia[] {
  const groupedMedia = groupMedia(media);
  const colWidths = previewBox.width / groupedMedia.length;

  return groupedMedia.map((column) => {
    const rowHeights = previewBox.height / column.length - column.length + 1;
    return {
      width: colWidths,
      height: rowHeights,
      tiles: column.map((mediaItem) => ({
        media: mediaItem,
        ...scaleToFit(mediaItem, {
          width: colWidths,
          height: rowHeights,
        })
      })),
    };
  });
}

function groupMedia(media: MediaObjectV2[]) {
  return media.reduceRight((groupedMedia, mediaItem) => {
    const curSet = groupedMedia[0];
    if (curSet && curSet.length < 2 && media.length != 2) {
      curSet.unshift(mediaItem);
    } else {
      groupedMedia.unshift([mediaItem]);
    }
    return groupedMedia;
  }, [] as MediaObjectV2[][]);
}
