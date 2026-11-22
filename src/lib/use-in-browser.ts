import { useSyncExternalStore } from "react";

// True once the page runs in the browser. The server (and hydration) sees false, the browser then true,
// so nothing mismatches. For attributes that only make sense with JavaScript, such as inert on a
// collapsed panel: without JavaScript the panel is open and must stay readable.
const noSubscribe = () => () => {};
export const useInBrowser = () => useSyncExternalStore(noSubscribe, () => true, () => false);
