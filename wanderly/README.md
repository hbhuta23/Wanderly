# 🌍 Wanderly - AI-Powered Travel Planning

A modern, full-stack travel planning application that uses AI to create personalized itineraries with real-time location mapping and interactive chat functionality.

![Wanderly Demo](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FinalWanderly-mZZ2dHlHrGtM3v0ojB16DKQ894IAJo.webp)

## ✨ Features

### 🤖 AI-Powered Travel Planning
- **Intelligent Chat Interface**: Natural language conversation with AI travel assistant
- **Personalized Itineraries**: Custom travel plans based on preferences, budget, and dates
- **Real-time Recommendations**: Dynamic suggestions for activities, restaurants, and attractions

### 🗺️ Interactive Mapping
- **Google Maps Integration**: Real-time location visualization
- **Geocoding**: Automatic address-to-coordinates conversion
- **Place Markers**: Interactive markers for attractions and points of interest
- **3D Globe Visualization**: Immersive globe view for destination exploration

### 👤 User Authentication
- **Secure Signup/Login**: JWT-based authentication system
- **User Profiles**: Personalized experience with saved preferences
- **Session Management**: Persistent login with secure token storage

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Dark/Light Mode**: Theme preferences for user comfort
- **Accessibility**: WCAG compliant design patterns

### 🔧 Technical Features
- **Full-Stack Architecture**: Next.js 15 with App Router
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Integration**: OpenAI GPT-4, Google Maps, Geocoding APIs
- **TypeScript**: Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- OpenAI API key
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wanderly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderly
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=sk-your-openai-api-key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
wanderly/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── chat/          # AI chat functionality
│   │   │   └── plan/          # Trip planning API
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── page2/             # Main chat interface
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Shadcn/ui components
│   │   └── SimpleGlobe.tsx   # 3D globe component
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── mongodb.js       # Database connection
│   │   └── utils.ts         # General utilities
│   ├── models/              # MongoDB models
│   │   ├── User.js         # User schema
│   │   └── TripPlan.js     # Trip plan schema
│   └── middleware.ts        # Next.js middleware
├── public/                  # Static assets
├── env.example             # Environment variables template
├── vercel.json            # Vercel deployment config
└── DEPLOYMENT.md          # Detailed deployment guide
```

## 🔑 API Keys Setup

### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Generate an API key
4. Add to your `.env.local` file

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create an API key with appropriate restrictions
5. Add to your `.env.local` file

### MongoDB Atlas
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` with your actual password

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the dashboard
   - Deploy!

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Netlify
- Railway
- DigitalOcean
- AWS

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Chat functionality with AI
- [ ] Map integration and geocoding
- [ ] Responsive design on different devices
- [ ] Authentication flow and protected routes
- [ ] Error handling and validation

### Automated Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |

### Customization

- **Styling**: Modify `tailwind.config.js` for theme changes
- **Components**: Edit components in `src/components/`
- **API**: Customize API routes in `src/app/api/`
- **Database**: Update schemas in `src/models/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Google Maps** for mapping services
- **MongoDB** for database hosting
- **Vercel** for deployment platform
- **Shadcn/ui** for beautiful components
- **Framer Motion** for animations

## 📞 Support

If you encounter any issues:

1. Check the [troubleshooting section](./DEPLOYMENT.md#troubleshooting)
2. Verify your environment variables
3. Check the console for error messages
4. Open an issue in the repository

## 🎯 Roadmap

- [ ] Email verification system
- [ ] Social media authentication
- [ ] Trip sharing and collaboration
- [ ] Offline mode support
- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] Payment integration

---

**Built with ❤️ for travelers worldwide**

*Wanderly - Where AI meets adventure*
