# Showdown Insight Mobile — experimental Android source

This is an **alpha prototype**, not a finished AI assistant or compiled APK. It creates an independent Android WebView app that loads https://play.pokemonshowdown.com/ and injects a compact overlay. The original Showdown Is Fun APK is not modified.

## Build an APK (Android Studio)
1. Install Android Studio and its Android SDK 35.
2. Open this folder as a project. Allow Gradle to sync (internet required).
3. Choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Install the generated debug APK from `app/build/outputs/apk/debug/app-debug.apk` on your phone.

## Use
Open the app, log into Pokémon Showdown, and start a Gen 9 Random Battle. Tap **INSIGHT**. The overlay attempts to detect currently visible move buttons and displays move data. Tap Close to hide it.

## Current limitations
- NOT verified on a physical phone or in a real battle.
- Move detection depends on Showdown's current page structure and can break when the website changes.
- No AI, opponent inference, exact stats, full team, damage calculator, or best-outcome engine yet.
- Move ranking is a preliminary raw base-power × accuracy order only and is explicitly NOT a best-move recommendation.
- WebView sign-in, challenges, and website compatibility may vary. Some external links are blocked rather than opening arbitrary sites in-app.
- This project is an original companion prototype, not a modification of the supplied APK.
- No credentials or battle data are sent to an external assistant service by this app. The embedded Showdown website connects to its normal servers.
