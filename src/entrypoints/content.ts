import { defineContentScript } from "#imports";

type RedirectOptions = {
  phase: string;
};

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    redirectIfOnShorts({ phase: "document_start" });

    const events = [
      /**
       * YouTube SPA navigation start event. Fires on internal navigations.
       */
      "yt-navigate-start",
      /**
       * Handle direct visits to the /shorts page.
       */
      "yt-page-data-updated",
    ];
    for (const event of events) {
      ctx.addEventListener(document, event, () => {
        if (ctx.isValid) {
          redirectIfOnShorts({ phase: event });
        }
      });
    }
  },
});

function extractShortsId() {
  const segments = location.pathname.split("/");
  if (segments.length !== 3 || segments[1] !== "shorts") {
    return "";
  }
  return segments[2];
}

function redirectIfOnShorts({ phase }: RedirectOptions) {
  const shortsId = extractShortsId();
  if (shortsId !== "") {
    console.debug(`Redirect triggered at ${phase}`);
    location.replace(`/watch?v=${shortsId}`);
  }
}
