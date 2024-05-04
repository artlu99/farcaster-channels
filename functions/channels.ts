import { ExportedHandler, Response } from "@cloudflare/workers-types"

interface Env {}
export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = "https://api.warpcast.com/v2/all-channels";

    // gatherResponse returns both content-type & response body as a string
    async function gatherResponse(response: any) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return { contentType, result: JSON.stringify(await response.json()) };
      }
      return { contentType, result: response.text() };
    }

    const response = await fetch(url);
    const { contentType, result } = await gatherResponse(response);

    const options = { headers: { "content-type": contentType } };
    return new Response(result, options);
  },
} satisfies ExportedHandler<Env>;
