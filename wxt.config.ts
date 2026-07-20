import { defineConfig, type UserManifest } from "wxt";

export default defineConfig({
  manifest: ({ browser }) => {
    const baseManifest: UserManifest = {
      name: "Shorts Simple Redirector",
    };
    const firefoxManifest: UserManifest = {
      browser_specific_settings: {
        gecko: {
          id: "shorts-simple-redirector@signote.cc",
          data_collection_permissions: {
            required: ["none"],
          },
        },
      },
    };
    return browser === "firefox"
      ? { ...baseManifest, ...firefoxManifest }
      : { ...baseManifest };
  },
  modules: ["@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/icon.svg",
  },
  imports: false,
  srcDir: "src",
});
