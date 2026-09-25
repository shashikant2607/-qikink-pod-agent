export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        app: "Qikink POD AI Agent",
        qikinkConfigured: Boolean(env.QIKINK_CLIENT_ID && env.QIKINK_CLIENT_SECRET)
      });
    }
    if (url.pathname === "/api/chat" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch {}
      const message = String(body.message || "").trim();
      if (!message) return Response.json({error:"Message is required"},{status:400});
      return Response.json({
        reply: `I received: "${message}". Your Qikink POD Agent is running. Add your Qikink and AI API secrets in Cloudflare to enable live automation.`
      });
    }
    return env.ASSETS.fetch(request);
  }
};