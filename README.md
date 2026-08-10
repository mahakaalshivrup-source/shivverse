# ShivVerse

ShivVerse is a premium digital sanctuary dedicated to exploring the divine universe, sacred traditions, and timeless philosophy of Lord Shiva. Built with Next.js, Framer Motion, and Tailwind CSS, it bridges ancient spiritual heritage with modern interactive experiences.

## Features

- **Interactive 3D Book Experience:** Read sacred texts like the Shiva Purana through an immersive, physics-based 3D flipbook interface.
- **Divine Guide AI Chatbot:** An intelligent, context-aware chatbot that answers questions exclusively about Sanatan Dharma, Hindu deities, scriptures, and temples, featuring real-time temple news capabilities.
- **Jyotirlinga Interactive Map & Timeline:** Explore the 12 sacred Jyotirlingas with an interactive map (Mapbox/Maplibre) and a beautifully animated scrolling timeline.
- **Mantra Audio Player:** Listen to powerful chants, stotras, and mantras with a custom global audio player that persists across page navigations.
- **Cinematic UI/UX:** A stunning dark-mode aesthetic featuring glassmorphism, smooth Framer Motion animations, typewriter text effects, and interactive hover states.
- **Trip Planner:** A smart travel assistant (powered by Groq & Gemini) to help devotees plan routes and journeys to sacred sites.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Maps:** `react-map-gl`, `maplibre-gl`
- **Icons:** `lucide-react`
- **Markdown:** `react-markdown`
- **3D Book UI:** `react-pageflip`, `react-pdf`
- **AI Integration:** Direct fetch to Groq (Llama-3.3-70b) with Gemini 2.5 Flash fallback

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/geekysandy11/shivverse1.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add the necessary API keys:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   GROK_API_KEY=your_groq_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Philosophy

*"Namaste 🙏 My purpose is to guide you through the sacred wisdom of Sanatan Dharma."*

ShivVerse aims to provide a modern, highly polished, and respectful digital space for seekers worldwide to explore the greatness of Mahadev. Har Har Mahadev!
