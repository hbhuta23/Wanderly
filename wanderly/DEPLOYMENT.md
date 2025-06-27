# Wanderly - Deployment Guide

## 🚀 Quick Start

Wanderly is a modern AI-powered travel planning application built with Next.js, MongoDB, and OpenAI. This guide will help you deploy it to production.

## 📋 Prerequisites

Before deploying, you'll need:

1. **MongoDB Atlas Account** - For database
2. **OpenAI API Key** - For AI travel planning
3. **Google Maps API Key** - For location services
4. **Vercel Account** - For hosting (recommended)

## 🔧 Environment Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd wanderly
npm install
```

### 2. Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required environment variables:

```env
# MongoDB Connection (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderly

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Get API Keys

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` with your actual password

#### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get API key
3. Add billing information (required for API usage)

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Maps JavaScript API and Geocoding API
4. Create API key with restrictions

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables in Vercel**
   - Go to your project settings
   - Add all variables from `.env.local`
   - Redeploy

### Option 2: Netlify

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository
   - Add environment variables in Netlify dashboard

### Option 3: Railway

1. **Connect to Railway**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, random string
2. **API Keys**: Never commit to version control
3. **MongoDB**: Use connection string with username/password
4. **CORS**: Configure properly for production domains

## 📊 Database Setup

The application will automatically create the necessary collections:

- `users` - User accounts and authentication
- `tripplans` - Generated travel itineraries

## 🧪 Testing

1. **Local Testing**
   ```bash
   npm run dev
   ```

2. **Production Testing**
   - Test signup/login flow
   - Test chat functionality
   - Test itinerary generation
   - Test map integration

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string
   - Verify network access in MongoDB Atlas
   - Check username/password

2. **API Key Errors**
   - Verify API keys are correct
   - Check billing status (OpenAI)
   - Verify API restrictions (Google Maps)

3. **Build Errors**
   - Check Node.js version (18+ recommended)
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors

### Support

If you encounter issues:
1. Check the console logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB connection

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster running
- [ ] API keys working
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Error monitoring set up
- [ ] Performance monitoring configured

## 📈 Scaling Considerations

- **Database**: MongoDB Atlas scales automatically
- **API**: Consider rate limiting for OpenAI calls
- **CDN**: Vercel provides global CDN
- **Caching**: Implement Redis for session storage if needed

## 🔄 Updates and Maintenance

1. **Regular Updates**
   ```bash
   npm update
   npm audit fix
   ```

2. **Database Backups**
   - MongoDB Atlas provides automatic backups
   - Consider manual exports for critical data

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API usage and costs
   - Track user engagement metrics

---

**Happy Deploying! 🎉**

For more help, check the main README or open an issue in the repository. 