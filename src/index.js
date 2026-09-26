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
    if (url.pathname === "/api/qikinik-test") {
      try {
        if (!env.QIKINK_CLIENT_ID || !env.QIKINK_CLIENT_SECRET) {
          return Response.json(
            {
              success: false,
              error: "Qikink credentials are not configured"
            },
            { status: 500 }
          );
        }

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

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          return Response.json(
            {
              success: false,
              qikink_status: response.status,
              error: "Qikink returned a non-JSON response",
              response: text.slice(0, 500)
            },
            { status: 502 }
          );
        }

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

    return Response.json(
      {
        error: "Not Found"
      },
      { status: 404 }
    );
  }
};
