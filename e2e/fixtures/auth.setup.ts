import { test as setup } from "@playwright/test";

const PB_URL = "http://localhost:8090";
const SUPERUSER_EMAIL = "admin@example.com";
const SUPERUSER_PASS = "admin123456";

const TEST_USER = {
  email: "testuser@example.com",
  password: "testpassword123",
  passwordConfirm: "testpassword123",
  name: "Test User",
};

setup("create test users", async ({ request }) => {
  // Authenticate as superuser
  const authResponse = await request.post(
    `${PB_URL}/api/collections/_superusers/auth-with-password`,
    {
      data: {
        identity: SUPERUSER_EMAIL,
        password: SUPERUSER_PASS,
      },
    },
  );

  const authData = await authResponse.json();
  const token = authData.token;

  // Create test user (ignore error if already exists)
  const createResponse = await request.post(
    `${PB_URL}/api/collections/users/records`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: TEST_USER,
    },
  );

  if (!createResponse.ok()) {
    const body = await createResponse.json();
    // 400 with existing email is expected on re-runs
    if (body?.data?.email?.code !== "validation_not_unique") {
      throw new Error(`Failed to create test user: ${JSON.stringify(body)}`);
    }
  }

  // Authenticate as the test user and save storageState
  // We use the PocketBase JS SDK approach via the browser to get localStorage-based auth
  // But since auth setup should use API directly, we'll create a minimal storageState
  const userAuthResponse = await request.post(
    `${PB_URL}/api/collections/users/auth-with-password`,
    {
      data: {
        identity: TEST_USER.email,
        password: TEST_USER.password,
      },
    },
  );

  const userAuthData = await userAuthResponse.json();

  // PocketBase JS SDK stores auth in localStorage under "pocketbase_auth"
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: "http://localhost:5173",
        localStorage: [
          {
            name: "pocketbase_auth",
            value: JSON.stringify({
              token: userAuthData.token,
              record: userAuthData.record,
            }),
          },
        ],
      },
    ],
  };

  // Write storageState file
  const fs = await import("fs");
  const path = await import("path");
  const authDir = path.join(import.meta.dirname, "..", ".auth");
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(
    path.join(authDir, "user.json"),
    JSON.stringify(storageState, null, 2),
  );
});
