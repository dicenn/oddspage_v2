export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Parse the URL and get the pathname
    const url = new URL(request.url);
    const path = url.pathname;
    const searchParams = url.searchParams;

    // Construct the target URL (ensure HTTPS)
    let targetUrl = 'https://api.opticodds.com/api/v3';
    
    // Add the path (everything after /api/)
    if (path.startsWith('/api/')) {
      targetUrl += path.substring(4);
    }

    // Add query parameters
    const finalUrl = `${targetUrl}?${searchParams.toString()}`;

    // Check if this is a stream request
    if (path.includes('/stream/')) {
      // Transform the response into a WebSocket connection
      const response = await fetch(finalUrl, {
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });

      // Stream the response
      return new Response(response.body, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For regular REST API calls
    const apiResponse = await fetch(finalUrl, {
      method: request.method,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Get the response body
    const body = await apiResponse.json();

    // Return the response with CORS headers
    return new Response(JSON.stringify(body), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    });
  },
};
