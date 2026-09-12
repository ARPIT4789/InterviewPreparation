export function validateCompanyUrl(input) {
  let url;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid company URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed.");
  }

  const hostname = url.hostname.toLowerCase();

  // Block localhost
  if (hostname === "localhost") {
    throw new Error("Localhost URLs are not allowed.");
  }

  // Block IPv4 loopback
  if (hostname === "127.0.0.1") {
    throw new Error("Loopback URLs are not allowed.");
  }

  // Block IPv6 loopback
  if (hostname === "::1" || hostname === "[::1]") {
    throw new Error("Loopback URLs are not allowed.");
  }

  return url;
}