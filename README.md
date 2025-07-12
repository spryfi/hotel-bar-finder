# Hotel Bar Finder

A Next.js application for finding hotels with exceptional bars and lounges.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
hotel-bar-finder/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── common/           # Shared components
│   ├── hotels/           # Hotel-related components
│   ├── layout/           # Layout components
│   └── search/           # Search components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API
└── public/               # Static assets
```

## 🔧 Configuration

### Database Setup (Supabase)
1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/`
3. Update your environment variables

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## 📱 Features

- **Search Hotels**: Find hotels by location or city
- **Filter Options**: Filter by amenities, bar types, and more
- **Real-time Status**: See which bars are open now
- **Favorites**: Save your preferred hotels
- **Responsive Design**: Works on all devices

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `out/` directory to Netlify
3. Configure environment variables in Netlify dashboard

### Other Platforms
The project exports as static files and can be deployed to any static hosting service.

## 🎨 Customization

The design system uses CSS custom properties defined in `app/globals.css`. Key colors and styling can be customized there.

## 📄 License

This project is licensed under the MIT License.