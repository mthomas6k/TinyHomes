export async function onRequestPost(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path === '/api/submit') {
      const data = await request.json();
      if (data.website) { // honeypot
        return new Response(JSON.stringify({ ok: true, redirect: "/thanks.html" }), { status: 200 });
      }
      
      const submission = {
        id: "req-" + Date.now() + "-" + crypto.randomUUID().slice(0, 6),
        name: data.name,
        email: data.email,
        phone: data.phone,
        town: data.town,
        message: data.message,
        sourcePage: data.sourcePage,
        submittedAt: new Date().toISOString()
      };

      const kv = env.TINYHOMES_KV;
      let submissions = await kv.get('submissions', 'json');
      if (!submissions) submissions = [];
      submissions.unshift(submission); // newest first
      await kv.put('submissions', JSON.stringify(submissions));

      return new Response(JSON.stringify({ ok: true, redirect: "/thanks.html" }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (path === '/api/dashboard') {
      const data = await request.json();
      const passkey = data.passkey;
      let owner = null;
      let ownerName = null;

      if (passkey === env.PASSKEY_A) {
        owner = 'a';
        ownerName = env.OWNER_A_NAME;
      } else if (passkey === env.PASSKEY_B) {
        owner = 'b';
        ownerName = env.OWNER_B_NAME;
      } else {
        return new Response(JSON.stringify({ ok: false }), { status: 401 });
      }

      const kv = env.TINYHOMES_KV;
      let submissions = await kv.get('submissions', 'json') || [];
      
      const initialCount = submissions.length;
      submissions = submissions.filter(sub => !sub.name.toLowerCase().includes('marshall'));
      if (submissions.length !== initialCount) {
        await kv.put('submissions', JSON.stringify(submissions));
      }
      let state = await kv.get(`dashboard-${owner}-state`, 'json') || {};

      const merged = submissions.map(sub => {
        const subState = state[sub.id] || {};
        return { ...sub, ...subState };
      });

      return new Response(JSON.stringify({
        ok: true,
        owner,
        ownerName,
        submissions: merged
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    if (path === '/api/update') {
      const data = await request.json();
      const passkey = data.passkey;
      let owner = null;

      if (passkey === env.PASSKEY_A) {
        owner = 'a';
      } else if (passkey === env.PASSKEY_B) {
        owner = 'b';
      } else {
        return new Response(JSON.stringify({ ok: false }), { status: 401 });
      }

      const { submissionId, patch } = data;
      if (!submissionId || !patch) {
        return new Response(JSON.stringify({ error: "missing fields" }), { status: 400 });
      }

      const kv = env.TINYHOMES_KV;
      let state = await kv.get(`dashboard-${owner}-state`, 'json') || {};
      
      if (!state[submissionId]) state[submissionId] = {};
      state[submissionId] = { ...state[submissionId], ...patch };
      
      await kv.put(`dashboard-${owner}-state`, JSON.stringify(state));

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
