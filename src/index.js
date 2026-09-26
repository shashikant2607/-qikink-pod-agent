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

    // Qikink API connection test
    if (url.pathname === "/api/qikink-test") {
      try {
        const response = await fetch(
          "https://sandbox.qikink.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              ClientId: env.QIKINK_CLIENT_ID,
              client_secret: env.QIKINK_CLIENT_SECRET
            })
          }
        );

        const data = await response.json();

        if (!response.ok || !data.AccessToken) {
          return Response.json(
            {
              success: false,
              qikink_status: response.status,
              error: data
            },
            { status: 502 }
          );
        }

        return Response.json({
          success: true,
          message: "Qikink API connected successfully",
          clientId: data.ClientId,
          expires_in: data.expires_in
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
