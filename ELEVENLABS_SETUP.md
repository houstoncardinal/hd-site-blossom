# 🎤 ElevenLabs Voice AI Agent Setup

Your ElevenLabs VoiceAgentWidget is now installed and ready! Here's how to activate it.

---

## 📋 What You Have

✅ **VoiceAgentWidget Component** - Installed and added to homepage
✅ **Supabase Edge Function** - Already created at `supabase/functions/elevenlabs-conversation-token`
✅ **@elevenlabs/react Package** - Installed (v0.13.0)

---

## 🔑 What You Need

To make the voice agent work, you need:

1. **ElevenLabs API Key**
2. **ElevenLabs Agent ID**
3. **Deploy the Edge Function to Supabase**

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your ElevenLabs Credentials

#### 1a. Get Your API Key

1. Go to **https://elevenlabs.io/app/speech-synthesis**
2. Click your **profile icon** (top right)
3. Select **"Profile + API Key"**
4. Copy your **API Key** (starts with `sk_...`)

#### 1b. Create or Get Your Agent ID

1. Go to **https://elevenlabs.io/app/conversational-ai**
2. Either:
   - **Create a new agent** → Click "Create Agent"
   - **Use existing agent** → Select an agent from your list
3. Copy the **Agent ID** from the URL or agent settings
   - URL format: `https://elevenlabs.io/app/conversational-ai/[AGENT_ID]`
   - Agent ID is a long alphanumeric string

---

### Step 2: Configure Supabase Secrets

You need to add your ElevenLabs credentials as **secrets** in Supabase:

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref tereunndfdpxylcvtkqm

# Set your ElevenLabs API Key
supabase secrets set ELEVENLABS_API_KEY=sk_your_api_key_here

# Set your ElevenLabs Agent ID
supabase secrets set ELEVENLABS_AGENT_ID=your_agent_id_here
```

#### Option B: Using Supabase Dashboard

1. Go to **https://supabase.com/dashboard/project/tereunndfdpxylcvtkqm**
2. Navigate to **Settings** → **Edge Functions** → **Secrets**
3. Click **"Add Secret"**
4. Add two secrets:
   ```
   Name: ELEVENLABS_API_KEY
   Value: sk_your_api_key_here
   ```
   ```
   Name: ELEVENLABS_AGENT_ID
   Value: your_agent_id_here
   ```

---

### Step 3: Deploy the Edge Function

#### Using Supabase CLI:

```bash
# Make sure you're in your project directory
cd /Users/hunainqureshi/Desktop/hd-site-blossom

# Deploy the Edge Function
supabase functions deploy elevenlabs-conversation-token
```

#### Output should look like:
```
Deploying elevenlabs-conversation-token (project ref: tereunndfdpxylcvtkqm)
Bundled elevenlabs-conversation-token size: XX KB
Deployed!
```

---

### Step 4: Test the Voice Agent

1. **Visit your website** (locally or on Lovable)
2. You should see a **phone icon button** on the right side of the screen
3. **Click the button** to open the voice agent
4. **Click "Start Call"** and allow microphone access
5. **Start speaking!** The AI agent will respond

---

## 🎨 How It Works

### User Experience

1. **Button appears** on the right edge of screen (purple/gold gradient)
2. **User clicks** → Panel slides open
3. **User clicks "Start Call"** → Browser asks for microphone permission
4. **Connection establishes** → Green "Connected" status appears
5. **User speaks** → AI agent listens and responds in real-time
6. **Visual feedback** → Animated pulse shows when agent is speaking
7. **End call** → Click "End Call" or X button

### Technical Flow

```
1. User clicks "Start Call"
   ↓
2. Widget requests microphone permission
   ↓
3. Widget calls Supabase Edge Function
   ↓
4. Edge Function fetches token from ElevenLabs API
   ↓
5. Widget receives token and connects to ElevenLabs
   ↓
6. Real-time voice conversation begins (WebRTC)
```

---

## 🔍 Troubleshooting

### Problem: "Failed to connect" error

**Possible causes:**
1. Edge Function not deployed
2. Secrets not configured
3. Invalid API key or Agent ID

**Solution:**
1. Open browser console (F12)
2. Check for error messages
3. Verify Edge Function is deployed:
   ```bash
   supabase functions list
   ```
4. Test Edge Function directly:
   ```bash
   curl -X POST \
     https://tereunndfdpxylcvtkqm.supabase.co/functions/v1/elevenlabs-conversation-token \
     -H "apikey: sb_publishable_POz2v8itiTOT351-9RrE3Q_JhcSMmXM" \
     -H "Authorization: Bearer sb_publishable_POz2v8itiTOT351-9RrE3Q_JhcSMmXM"
   ```

### Problem: "Microphone access denied"

**Solution:**
1. Browser is blocking microphone access
2. Go to site settings (lock icon in address bar)
3. Allow microphone access
4. Refresh page and try again

### Problem: "No audio from agent"

**Possible causes:**
1. Browser audio is muted
2. System volume is low
3. Agent not configured with voice in ElevenLabs

**Solution:**
1. Check browser audio settings
2. Check system volume
3. Go to ElevenLabs dashboard and verify agent has a voice selected

### Problem: Button doesn't appear

**Possible causes:**
1. JavaScript error preventing component from rendering
2. CSS conflict hiding the button

**Solution:**
1. Open browser console (F12)
2. Look for React errors
3. Check that VoiceAgentWidget is imported in Index.tsx
4. Verify the component is rendering: look for element with `z-[80]` class

---

## 🎛️ Customization Options

### Change Button Position

Edit `/src/components/VoiceAgentWidget.tsx`:

```typescript
// Current: Right side, centered
className="fixed right-0 top-1/2 -translate-y-1/2 z-[80]"

// Bottom right corner:
className="fixed right-6 bottom-6 z-[80]"

// Top right corner:
className="fixed right-6 top-6 z-[80]"
```

### Change Button Colors

Edit the gradient in VoiceAgentWidget.tsx:

```typescript
// Current: Purple/gold gradient
className="... bg-gradient-to-br from-purple-600 via-purple-700 to-amber-600"

// Blue gradient:
className="... bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600"

// Green gradient:
className="... bg-gradient-to-br from-green-600 via-green-700 to-emerald-600"
```

### Change Agent Behavior

1. Go to **https://elevenlabs.io/app/conversational-ai**
2. Select your agent
3. Configure:
   - **Voice** - Choose from 1000+ voices
   - **System Prompt** - Define agent personality and knowledge
   - **First Message** - What agent says when call starts
   - **Language** - English, Spanish, etc.
   - **Response Speed** - Balance between speed and quality

---

## 📊 Current Configuration

**Widget Location:** Right side of screen (centered vertically)
**Button Style:** Rotating phone icon with gradient
**Connection Type:** WebRTC (real-time voice)
**Audio:** Two-way (agent speaks and listens)
**Microphone:** Required (browser will ask for permission)

**Supabase Project:** `tereunndfdpxylcvtkqm`
**Edge Function:** `elevenlabs-conversation-token`
**Function URL:** `https://tereunndfdpxylcvtkqm.supabase.co/functions/v1/elevenlabs-conversation-token`

---

## 💡 Pro Tips

### 1. Test Your Agent First
Before deploying, test your ElevenLabs agent in their dashboard to make sure it responds correctly.

### 2. Use a Custom Domain
For production, set up a custom domain for your Supabase project to avoid rate limits.

### 3. Monitor Usage
ElevenLabs has usage limits based on your plan. Monitor your usage in their dashboard.

### 4. Add Error Handling
The widget already has error handling, but you can customize error messages in the component.

### 5. Analytics Integration
Add analytics to track:
- How many users click the button
- Average call duration
- Most common user questions

---

## 🔒 Security Notes

✅ **API Key is secure** - Stored in Supabase secrets, never exposed to client
✅ **CORS configured** - Edge Function only accepts requests from your domain
✅ **Token-based auth** - Each conversation gets a temporary token
✅ **Microphone permission** - Browser handles user consent

**Do NOT:**
- ❌ Add ELEVENLABS_API_KEY to .env file
- ❌ Commit secrets to Git
- ❌ Expose API key in client-side code

---

## 📞 Need Help?

### ElevenLabs Documentation
- **Voice AI Docs:** https://elevenlabs.io/docs/conversational-ai/overview
- **API Reference:** https://elevenlabs.io/docs/api-reference/conversational-ai

### Supabase Documentation
- **Edge Functions:** https://supabase.com/docs/guides/functions
- **Secrets Management:** https://supabase.com/docs/guides/functions/secrets

### Common Issues
If you're stuck, check:
1. Browser console for errors (F12)
2. Supabase Edge Function logs
3. ElevenLabs dashboard for API usage and errors

---

## ✅ Quick Checklist

Before going live, verify:

- [ ] ElevenLabs API key added to Supabase secrets
- [ ] ElevenLabs Agent ID added to Supabase secrets
- [ ] Edge Function deployed to Supabase
- [ ] Agent configured in ElevenLabs dashboard
- [ ] Tested voice call on your website
- [ ] Microphone permission works
- [ ] Audio quality is good
- [ ] Agent responds appropriately

---

**Last Updated:** January 15, 2026
**Status:** ✅ Widget Installed - Needs Configuration
**Next Step:** Add ElevenLabs credentials to Supabase secrets
