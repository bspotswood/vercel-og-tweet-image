# Vercel OG Tweet Image Generator

## Question

Can I generate images of tweets from the OG image functionality as an edge function?

## Expected benefits

- Learn about edge functions on Vercel
- Dive a little more into Next
- Learn about the Twitter API
- Fun

## Overview, approach and expectations

This project is attempting to generate an image of a Tweet as a Vercel Edge Function. The intent is to use the Twitter API to fetch the data for a given tweet and then format it in an appropriate manner for rendering within the OG Image Generation.

My intention is to replicate what Lee Robinson did on his website, using TailwindCSS and the Twitter API to generate a custom Tweet preview structure. Assuming that the experimental support for TailwindCSS in the OG image functionality works, this might be the quickest avenue to achieve what I'm attempting to tryout here.

## Fallback Approaches

An **inline styling approach** would be to use inline CSS rather than tailwind. This should be fairly simple to pull off, and I might go there eventually anyways as a test. But TailwindCSS is "experimental" so this could even be necessary to try.

A **simulate and re-render approach** may be to use JSDom to simulate the browser, load the oembed HTML and script (enable scripting in JSDom), and then scrape/rework the rendered HTML into a form that we want.

The **custom image manipulator approach** may be to use the "jimp" library and a bunch of draw instructions to just reproduce. This might really present issues with rendering anything for embedded media. But maybe the OG image stuff could be used to create a preview of any linked-to sites and then that image is loaded into jimp for those types of tweets. This seems extreme and not somewhere I want to go, but very plausible to make it work.

The **real-render approach** could be to abandon the OG image functionality and pursue using something like Puppeteer to render and capture the image.

An **abandonment approach** would be to just giveup, swallow your pride as a developer, and use TweetPik's API. 😆

## Final thoughts

As I start this out, I'm currently not clear what will happen when links are used from within a tweet or certain other embedded media.

I'll try to remember to update this readme as things evolve. Feel free to pester me if it's looking out of date and you have any questions.

# Reference Materials

## Intended solution references

- [Vercel OG](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation) rreference documentation
- [Vercel Examples → vercel-og-nextjs ](https://github.com/vercel/examples/tree/main/edge-functions/vercel-og-nextjs) base example and what the initial commit of this repo was based on
- [Rebuilding the Twitter Embed Widget! (Next.js + Tailwind)](https://www.youtube.com/watch?v=xZ9OzPQORtw) - YouTube demo of how Lee Robinson implemented code for converting Twitter API data into a preview using TailwindCSS
- [leerob.io commit for embedded tweet widget](https://github.com/leerob/leerob.io/pull/257/files#diff-33ef282f1e4d357eec528ffec87fcd7b2fe76adfe3edab628223e1d96cda383f) - The code changes referenced by Lee Robinson's video
- [Twitter Publish](https://publish.twitter.com/#) Quick tool for seeing how Twitter would render an embed
- [Twitter API Examples](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/example-payloads) Examples of different tweets from the official API documentation
- [Twitter API Playground](https://oauth-playground.glitch.me/?id=findTweetById&params=%28%27id%21%27939927692643917824%27%29_) Try out APIs
- [Twitter Open API Spec](https://api.twitter.com/2/openapi.json)
- [Swagger UI of Twitter API](https://snowcait.github.io/twitter-swagger-ui/)

## Alternative approach information

- [twitter-status](https://github.com/abraham/twitter-status) A project that implements a custom web component using inline styles and requiring the tweet API data. This could be good fallback reference for another approach.
- [Using Puppeteer and Squoosh to fix the web performance of embedded tweets](https://nooshu.com/blog/2021/02/06/using-puppeteer-and-squoosh-to-fix-twitter-embeds/) Interesting article about issues with the way that the oEmbed functionality for Twitter works. Includes a large number of interesting links at the bottom.
- [tweet-grabber](https://github.com/Nooshu/tweet-grabber) Related to previously linked article, utility that uses puppeteer to snag a tweet screenshot.
- [TweetPik](https://tweetpik.com/) API for rendering tweets (costs $)
- [JSDom](https://github.com/jsdom/jsdom) Perhaps useful if I decide to try simulating the Twitter widget with an oEmbed request and then rewrite the output of that
- [JIMP](https://www.npmjs.com/package/jimp) It's like GIMP but JavaScript, right? Could make our own routines for rendering an image using this library.



## Findings
- Unable to use certain module featuers server side in the edge function
  - I was unable to make use of the twitter-api-v2 library functionality, but I can still use its type defs
- Seems that you can specify 'auto' for ImageResponse width/height options and it works, but typedefs complain
- Some styles are not compatible
  - leading-5 does not work
    - causes it to blow up => TypeError: Cannot read properties of undefined (reading 'fontSize')
    - I can still set the inline style equivalent (`style={{lineHeight: '1.25rem'}}`)
  - leading-normal just complains but doesn't throw the error
    - complains with: relative line-height utilities require that font-size be set
  - The "!" prefix on names doesn't seem to work at all for making them !important
  - whitespace-pre-wrap is unknown
  - inline-grid is unknown
  - grid-cols-1 is unknown
  - gap-x-2 is unknown
  - gap-y-2 is unknown
- Need to specify svg fill color as 'fill' attribute on path rather than in 'style'
- Might need to set div width to 100%? Not sure if something else is interferring or what
- Typescript complains about "tw" attribute on "svg" elements, but it works