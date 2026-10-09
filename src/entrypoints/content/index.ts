import { defineContentScript } from "#imports";
import { extractShortsId } from "./utils";

type RedirectContext = {
  trigger: string;
};

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    redirectIfShorts({ trigger: "document_start" });

    const events = ["yt-navigate-start", "yt-navigate-finish"];
    for (const event of events) {
      ctx.addEventListener(document, event, () => {
        if (ctx.isValid) {
          redirectIfShorts({ trigger: event });
        }
      });
    }
  },
});

function redirectIfShorts({ trigger }: RedirectContext) {
  const shortsId = extractShortsId(location.href);
  if (shortsId) {
    console.debug(`Redirect triggered at ${trigger}`);
    location.replace(`/watch?v=${shortsId}`);
  }
}
