import { defineContentScript } from "#imports";

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

function getShortsId(pathname: string): string | null {
  const segments = pathname.split("/");
  if (segments.length !== 3 || segments[1] !== "shorts") {
    return null;
  }
  return segments[2];
}

function redirectIfShorts({ trigger }: RedirectContext) {
  const shortsId = getShortsId(location.pathname);
  if (shortsId) {
    console.debug(`Redirect triggered at ${trigger}`);
    location.replace(`/watch?v=${shortsId}`);
  }
}
