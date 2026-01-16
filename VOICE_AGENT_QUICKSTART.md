# Voice Agent Quick Setup Guide

## The Error You're Seeing

```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

This means the Edge Function hasn't been deployed to Supabase yet. The widget is trying to call a function that doesn't exist, so Supabase is returning a 404 HTML error page.

---

## 3-Step Quick Fix

### Step 1: Get Your ElevenLabs Credentials

**Get API Key:**
1. Go to https://elevenlabs.io/app/speech-synthesis
2. Click profile icon (top right) → "Profile + API Key"
3. Copy your API key (starts with `sk_...`)

**Get Agent ID:**
1. Go to https://elevenlabs.io/app/conversational-ai
2. Create a new agent or select existing one
3. Copy the Agent ID from the URL or settings
   - URL format: `https://elevenlabs.io/app/conversational-ai/[AGENT_ID]`

### Step 2: Configure Supabase Secrets

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref tereunndfdpxylcvtkqm

# Set secrets
supabase secrets set ELEVENLABS_API_KEY=sk_your_actual_api_key_here
supabase secrets set ELEVENLABS_AGENT_ID=your_actual_agent_id_here
```

**Option B: Using Supabase Dashboard**

1. Go to https://supabase.com/dashboard/project/tereunndfdpxylcvtkqm/settings/functions
2. Click "Secrets" tab
3. Add two secrets:
   - Name: `ELEVENLABS_API_KEY` / Value: `sk_your_api_key`
   - Name: `ELEVENLABS_AGENT_ID` / Value: `your_agent_id`

### Step 3: Deploy the Edge Function

```bash
# Make sure you're in the project directory
cd /Users/hunainqureshi/Desktop/hd-site-blossom

# Deploy the Edge Function
supabase functions deploy elevenlabs-conversation-token
```

You should see:
```
Deploying elevenlabs-conversation-token (project ref: tereunndfdpxylcvtkqm)
Bundled elevenlabs-conversation-token size: XX KB
Deployed!
```

---

## Test It Works

1. Refresh your website
2. Click the "Talk to Huda" button on the right
3. Click "Start Voice Call"
4. Allow microphone access
5. Start speaking!

If it works, you'll see:
- ✅ "Connected! Start speaking..." message
- ✅ Green dot showing connection status
- ✅ Audio visualization when the AI speaks

---

## Still Getting Errors?

**Check browser console (F12):**
The improved error handling now shows exactly what's wrong:

- `"Supabase configuration missing"` → Add environment variables to Lovable
- `"Voice agent not configured yet"` → Edge Function not deployed (follow Step 3)
- `"ElevenLabs API key not configured"` → Secrets not set (follow Step 2)
- `"ElevenLabs Agent ID not configured"` → Agent ID secret missing (follow Step 2)

**Test Edge Function directly:**

```bash
curl -X POST \
  https://tereunndfdpxylcvtkqm.supabase.co/functions/v1/elevenlabs-conversation-token \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

Expected response:
```json
{"token": "eyJhbGciOiJ..."}
```

---

## File Locations

- **Edge Function:** `/supabase/functions/elevenlabs-conversation-token/index.ts`
- **Widget Component:** `/src/components/VoiceAgentWidget.tsx`
- **Full Setup Guide:** See `ELEVENLABS_SETUP.md` for detailed instructions

---

## Quick Checklist

- [ ] Got ElevenLabs API key
- [ ] Got ElevenLabs Agent ID
- [ ] Set secrets in Supabase (both ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID)
- [ ] Deployed Edge Function with `supabase functions deploy`
- [ ] Tested on website - voice call works!

Once all checked, the voice agent will work perfectly!
