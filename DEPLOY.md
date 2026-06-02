# Deployment Checklist

Follow these steps to deploy TinyHomes to Cloudflare Pages.

- [ ] Commit and push all changes to the `mthomas6k/TinyHomes` main branch on GitHub.
- [ ] Go to your Cloudflare Dashboard and navigate to **Workers & Pages**.
- [ ] Click **Create Application**, select the **Pages** tab, and click **Connect to Git**.
- [ ] Select the `mthomas6k/TinyHomes` repository.
- [ ] Configure the build settings:
  - **Framework preset**: `None`
  - **Build command**: *(leave empty)*
  - **Build output directory**: `/` (root)
- [ ] Click **Save and Deploy**. (The first deploy will succeed but the API will throw errors without the KV namespace bound).
- [ ] Once deployed, go back to the Cloudflare Dashboard and navigate to **Workers & Pages** -> **KV**.
- [ ] Create a new KV namespace called `TINYHOMES_KV`.
- [ ] Go to your new Pages project settings -> **Settings** -> **Functions** -> **KV namespace bindings**.
- [ ] Add a new binding:
  - **Variable name**: `TINYHOMES_KV`
  - **KV namespace**: Select the `TINYHOMES_KV` you just created.
- [ ] Go to **Settings** -> **Environment variables** (under the Pages project) and add the following:
  - `PASSKEY_A` — A secret string for owner 1 (e.g., 10+ characters, like `marshallpasskey123`).
  - `PASSKEY_B` — A secret string for owner 2.
  - `OWNER_A_NAME` — Display name for owner 1 (e.g., `Marshall`).
  - `OWNER_B_NAME` — Display name for owner 2 (e.g., `Dad`).
- [ ] Go to the **Deployments** tab and **Retry deployment** (or trigger a new deploy from GitHub) so the new bindings and environment variables take effect.

Your site is now fully deployed with the KV backend and hidden admin panel!
