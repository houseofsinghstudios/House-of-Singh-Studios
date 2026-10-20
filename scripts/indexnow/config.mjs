// IndexNow settings. The key is public by design: search engines check it against the key file
// served at KEY_LOCATION (public/<key>.txt), so it lives in the repo.
export const KEY = "e429c4e541804de19f12392ad262cb0f";
export const HOST = "studios.houseofsingh.com";
export const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
export const ENDPOINT = "https://api.indexnow.org/indexnow";
export const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
// IndexNow accepts at most 10,000 URLs per request.
export const BATCH_SIZE = 10000;
