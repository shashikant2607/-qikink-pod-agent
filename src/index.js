export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response(
      JSON.stringify({
        status: "online",
        message: "Qikink POD Agent is running"
      }),
      {
        headers: {
          "content-type": "application/json"
        }
      }
    );
  }
};
