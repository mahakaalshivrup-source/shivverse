Act as an expert React/Next.js developer and UI/UX designer. I want to build a fully interactive "Retro Live Darshan TV" component for my website. 

I want a modular setup where all live YouTube stream links are managed through a single JSON file inside a folder (e.g., `public/data/livestreams.json`). The user will view these streams inside a realistic retro CRT television frame with physical working controls (Power, Play, Pause, Channel Next, Channel Previous) and an on-screen display (OSD) showing the channel number and stream title.

Please provide the code and architecture following these strict specifications:

---

### 1. The Data Layer (`public/data/livestreams.json`)
Create a dedicated JSON configuration file structure so I can easily add or edit live links like plugging in TV channels:

```json
[
  {
    "id": "ch-1",
    "channelNumber": "01",
    "title": "Mahakaleshwar Live Darshan",
    "temple": "Ujjain, Madhya Pradesh",
    "youtubeUrl": "[https://www.youtube.com/watch?v=YOUR_LIVE_ID_1](https://www.youtube.com/watch?v=YOUR_LIVE_ID_1)"
  },
  {
    "id": "ch-2",
    "channelNumber": "02",
    "title": "Kashi Vishwanath Live Darshan",
    "temple": "Varanasi, Uttar Pradesh",
    "youtubeUrl": "[https://www.youtube.com/watch?v=YOUR_LIVE_ID_2](https://www.youtube.com/watch?v=YOUR_LIVE_ID_2)"
  },
  {
    "id": "ch-3",
    "channelNumber": "03",
    "title": "Somnath Temple Live Stream",
    "temple": "Prabhas Patan, Gujarat",
    "youtubeUrl": "[https://www.youtube.com/watch?v=YOUR_LIVE_ID_3](https://www.youtube.com/watch?v=YOUR_LIVE_ID_3)"
  }
]

2. The Retro TV Casing & Screen Design (components/RetroLiveTV.tsx)
Build the TV housing using Tailwind CSS and Framer Motion:

TV Cabinet: Dark metallic or vintage dark-wood frame (bg-[#121212] border-8 border-[#222] rounded-[2.5rem] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)]).

CRT Glass Screen:

Aspect ratio 16:9 or 4:3 style with heavy rounded inner edges (rounded-[2rem] bg-black overflow-hidden relative border-4 border-black).

Scanline & Glare Effect: Over the video container, place a pointer-events-none absolute inset-0 z-20 div with a subtle repeating linear gradient (CRT scanlines) and a faint radial highlight to mimic curved glass reflection.

On-Screen Display (OSD):

When the TV is ON or changing channels, display retro green/amber glowing text (font-mono text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]) in the top-left of the screen showing: CH {channelNumber} • {title} [LIVE].

The OSD text should fade out after 4 seconds or remain subtly visible.

3. Video Integration (react-player)
Integrate react-player inside the screen container.

Disable default YouTube controls (playerVars: { controls: 0, modestbranding: 1, rel: 0, disablekb: 1 }).

Handle playing={isPlaying && isPowerOn} state.

Static Glitch Effect: When changing channels (nextChannel / prevChannel), trigger a brief 300ms "noise/static glitch" animation over the screen before the new channel plays.

4. Physical Control Panel (Right Side or Bottom Panel)
Create a tactile, retro physical control section on the TV cabinet:

Power Switch / Button:

Toggles isPowerOn state. Includes a glowing red/green LED indicator dot near the button.

Turning Power OFF shuts down the screen into a black state with a quick collapse animation.

Play / Pause Tactile Button:

Toggles isPlaying state with Framer Motion press animations (whileTap={{ scale: 0.95 }}).

Channel Knobs / Buttons (Next & Previous):

CH + (Next Channel) and CH - (Previous Channel). Cycles seamlessly through the imported JSON array.

Mute / Unmute Button:

Controls audio state with a visual sound wave icon indicator on the OSD.

5. Implementation Instructions
Provide the exact JSON file structure for public/data/livestreams.json.

Provide the complete, production-ready RetroLiveTV.tsx component using react-player, framer-motion, and lucide-react icons.

Ensure all styling aligns with a dark mode, cinematic website design.