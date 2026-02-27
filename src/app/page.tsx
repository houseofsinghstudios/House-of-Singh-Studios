import { client } from "@/lib/sanity/client";

export default async function Home() {
  const connected = await client
    .fetch('*[_type == "sanity.imageAsset"][0...1]')
    .then(() => true)
    .catch(() => false);

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>House of Singh Studios</h1>
      <p>
        Sanity Connection:{" "}
        {connected ? "Connected Successfully" : "Connection Failed"}
      </p>
      <p>Project ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}</p>
      <p>Dataset: {process.env.NEXT_PUBLIC_SANITY_DATASET}</p>
    </main>
  );
}