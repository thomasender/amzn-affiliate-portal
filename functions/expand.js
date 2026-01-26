const AFFILIATE_TAG = "blissofkundal-21"; // change to your tag

const handler = async function (event) {
  try {
    const { url } = event.queryStringParameters || {};
    if (!url) {
      return { statusCode: 400, body: "Missing URL parameter" };
    }

    // Browser-like headers to reduce bot blocking
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Amazon returned HTTP ${response.status}`);
    }

    const finalUrl = response.url;
    const parsed = new URL(finalUrl);

    // Extract ASIN
    const asinMatch = parsed.pathname.match(
      /\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})/,
    );
    const asin = asinMatch ? asinMatch[1] || asinMatch[2] : null;

    if (!asin) {
      return { statusCode: 400, body: "Could not extract ASIN from URL" };
    }

    const marketplace = parsed.hostname;
    const affiliateLink = `https://${marketplace}/dp/${asin}?tag=${AFFILIATE_TAG}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ affiliateLink }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return { statusCode: 500, body: "Error: " + err.message };
  }
};

// Export in CommonJS style
module.exports = { handler };
