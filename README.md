# Patrick Wingert - Elite Athlete Site

**Life is Hard. Be Harder.**

A revolutionary, immersive website for Patrick Wingert, Dare2tri Elite Team athlete, featuring scroll-driven storytelling, live performance data, and dynamic fundraising visualization.

## 🔥 Features

### Revolutionary Design
- **Breathing Hero Section** - Heartbeat-synced animations with orange glow effects
- **Scroll Physics** - Kinetic, weighted scrolling with momentum
- **Live WHOOP Integration** - Real-time performance metrics affecting page energy
- **Bhutan Trek Panorama** - Horizontal scroll journey with altitude tracking
- **Dynamic Fundraising** - Mountain elevation visualization for funding progress
- **Instagram River Feed** - Flowing photo layout with auto-updates

### Technical Excellence
- Built with **Next.js 14** (App Router)
- **Framer Motion** for physics-based animations
- **Tailwind CSS** with custom orange theme system
- **TypeScript** for type safety
- Optimized images and performance
- Mobile-responsive throughout
- Production-ready architecture

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
patrick-wingert-site/
├── app/
│   ├── page.tsx              # Main homepage with all sections
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and theme
├── components/
│   └── sections/
│       ├── HeroSection.tsx         # Breathing hero with heartbeat
│       ├── LiveStats.tsx           # WHOOP data visualization
│       ├── TheShift.tsx            # Culinary to athletic transition
│       ├── ByTheNumbers.tsx        # Animated stat counters
│       ├── BhutanJourney.tsx       # Horizontal scroll trek
│       ├── TheMission.tsx          # Dare2tri Elite Team info
│       ├── InstagramFeed.tsx       # Live Instagram integration
│       └── SupportCTA.tsx          # Fundraising with sponsors
├── public/                   # Static assets (add photos here)
├── package.json
├── tailwind.config.js        # Orange theme configuration
└── tsconfig.json

```

## 🎨 Design System

### Orange Theme
The site uses a custom orange palette representing determination and energy:

```css
--orange-primary: #f97316
--orange-secondary: #ea580c
--orange-glow: rgba(249, 115, 22, 0.6)
```

All components use this system for consistency and can dynamically adjust intensity based on WHOOP recovery data.

### Typography
- Headlines: Inter Black (font-black)
- Body: Inter Regular/Light
- Data: Monospace for metrics

### Animations
- Scroll-triggered reveals
- Physics-based momentum
- Breathing/pulse effects
- Kinetic text arrivals

## 🔌 API Integrations

### WHOOP API Integration

**Setup:**
1. Register for WHOOP Developer access at https://developer.whoop.com
2. Get API credentials (Client ID, Client Secret)
3. Add to environment variables:

```bash
NEXT_PUBLIC_WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
```

**Implementation:**
Create `/app/api/whoop/route.ts`:

```typescript
export async function GET() {
  const response = await fetch('https://api.whoop.com/developer/v1/cycle', {
    headers: {
      'Authorization': `Bearer ${process.env.WHOOP_ACCESS_TOKEN}`
    }
  });
  const data = await response.json();
  return Response.json(data);
}
```

Update `LiveStats.tsx` to fetch real data instead of mock data.

### Instagram Feed Integration

**Option 1: Instagram Basic Display API**
1. Create Facebook Developer App
2. Add Instagram Basic Display product
3. Generate access token
4. Add to environment:

```bash
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_USER_ID=your_user_id
```

**Option 2: Cross-posting Panel**
Create admin route `/admin/post` where Patrick can post content that goes to both Instagram and the website.

**Implementation:**
Update `InstagramFeed.tsx` to fetch from:
```typescript
const response = await fetch('/api/instagram');
```

## 🏔️ Adding Patrick's Photos

Replace placeholder images with Patrick's actual photos:

1. Add photos to `/public/images/`
2. Update image sources in components:

```typescript
// Before
src="https://images.unsplash.com/..."

// After
src="/images/bhutan-day1.jpg"
```

**Recommended naming:**
- `hero-main.jpg` - Main hero section
- `bhutan-day1.jpg`, `bhutan-day2.jpg`, etc.
- `training-*.jpg` - Training shots
- `race-*.jpg` - Race photos
- `culinary-*.jpg` - Pre-accident culinary work

## 📊 Fundraising Configuration

Update funding data in `SupportCTA.tsx`:

```typescript
const [fundingData] = useState({
  current: 12500,  // Update with actual amount raised
  goal: 25000,     // Update with actual goal
  supporters: 47   // Update with actual count
});
```

For live updates, connect to fundraising platform API (e.g., GoFundMe, Donor Box).

## 🎯 Customization

### Update Personal Information

**In `HeroSection.tsx`:**
- Name display
- Subtitle/credentials
- Mock heartbeat BPM (will connect to WHOOP)

**In `ByTheNumbers.tsx`:**
```typescript
const stats = [
  { label: "Miles Trained", value: 2847 },     // Update values
  { label: "Elevation Climbed", value: 127500 },
  { label: "Records Set", value: 3 },
  { label: "Days Since Accident", value: 892 }
];
```

**In `TheMission.tsx`:**
- Update acceptance year
- Modify cost estimates
- Add specific race information

### Adding New Sections

Create new component in `/components/sections/`:
```typescript
'use client';
import { motion } from 'framer-motion';

export default function NewSection() {
  return (
    <section className="relative min-h-screen py-32 px-6">
      {/* Content */}
    </section>
  );
}
```

Import in `app/page.tsx` and add to the render.

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set in Vercel dashboard or `.env.local`:
```
NEXT_PUBLIC_WHOOP_CLIENT_ID=
WHOOP_CLIENT_SECRET=
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
```

## 📱 Mobile Optimization

The site is fully responsive with:
- Touch-optimized interactions
- Mobile-first breakpoints
- Reduced motion support
- Optimized image loading

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios
- Reduced motion preferences respected

## 🔧 Performance

- Image optimization via Next.js Image component
- Code splitting via Next.js app router
- Lazy loading for off-screen content
- Minimal JavaScript bundles
- CSS animations over JavaScript where possible

## 📈 Analytics (To Add)

Recommended: Vercel Analytics or Google Analytics

```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🎬 Next Steps

1. **Replace placeholder images** with Patrick's 500+ photos
2. **Connect WHOOP API** for live performance data
3. **Set up Instagram integration** for automatic feed updates
4. **Configure fundraising platform** for live donation tracking
5. **Add domain** and custom email (patrick@patrickwingert.com)
6. **Set up analytics** to track visitor engagement
7. **Create blog/news CMS** (Sanity, Contentful, or similar)
8. **Add race calendar** with upcoming events
9. **Build sponsor dashboard** for partner assets
10. **Create press kit** downloadable page

## 🤝 Support

For questions or customization requests, contact the development team.

---

**Built with determination. Powered by orange. Zero limits.**
