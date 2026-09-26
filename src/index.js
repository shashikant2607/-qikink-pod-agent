export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/api/health") {
      return Response.json({
        status: "online",
        agent: "Qikink POD Agent"
      });
    }

    // Qikink API test
    if (url.pathname === "/api/qikink-test") {
      try {
        const response = await fetch(
          "https://sandbox-api.qikink.com/api/v1/oauth/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              client_id: env.QIKINK_CLIENT_ID,
              client_secret: env.QIKINK_CLIENT_SECRET
            })
          }
        );

        const data = await response.json();

        return Response.json({
          success: response.ok,
          qikink_status: response.status,
          data: data
        });
      } catch (error) {
        return Response.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
