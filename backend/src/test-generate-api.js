import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );

  const data = await response.json();

  return {
    status: response.status,
    data,
    cookie: response.headers.get("set-cookie")
  };
}

async function main() {
  const email = `test-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  console.log("1. Registering test user...");

  const register = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  console.log("Register status:", register.status);

  if (register.status !== 201) {
    console.log(register.data);
    return;
  }

  const cookie = register.cookie;

  if (!cookie) {
    throw new Error("No session cookie returned.");
  }

  console.log("2. Generating interview kit...");

  const result = await request("/api/kits/generate", {
    method: "POST",
    headers: {
      Cookie: cookie
    },
    body: JSON.stringify({
      jd: `Junior Software Engineer
Requirements:
- Experience with JavaScript.
- Strong knowledge of React.
- Good communication skills.
Responsibilities:
- Build web applications.
- Work with the engineering team.`,
      company_url: "https://www.microsoft.com",
      days: 3
    })
  });

  console.log("Generate status:", result.status);

  if (result.status !== 201) {
    console.log(JSON.stringify(result.data, null, 2));
    return;
  }

  console.log("\n✅ API GENERATION PASSED");

  console.log("\nKit keys:", Object.keys(result.data.data.kit));

  console.log(
    "\nResearch status:",
    JSON.stringify(result.data.data.research_status, null, 2)
  );

  // STEP 3: Fetch the saved kit
  const savedKitId = result.data.data.kit._id;

  console.log("\n3. Fetching saved kit...");

  const getKit = await request(`/api/kits/${savedKitId}`, {
    method: "GET",
    headers: {
      Cookie: cookie
    }
  });

  console.log("Get kit status:", getKit.status);

  if (getKit.status !== 200) {
    console.log(JSON.stringify(getKit.data, null, 2));
    return;
  }

  console.log("\n✅ KIT PERSISTENCE PASSED");
  console.log("Saved kit ID:", getKit.data.kit._id);
  console.log("Saved kit owner:", getKit.data.kit.userId);
}

main().catch((error) => {
  console.error("\n❌ API TEST FAILED");
  console.error(error.message);
});