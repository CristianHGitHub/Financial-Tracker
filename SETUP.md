# 🚀 Setup Guide for Financial Tracker with DeepSeek AI

This guide will help you set up the Financial Tracker application with DeepSeek AI integration via OpenRouter.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- An OpenRouter account (free tier available)
- A Clerk account for authentication

## 🔧 Step-by-Step Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd financial-tracker
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="file:./dev.db"
```

### 3. Get Your OpenRouter API Key

1. **Visit OpenRouter**: Go to [https://openrouter.ai/](https://openrouter.ai/)
2. **Sign Up**: Create a free account
3. **Navigate to API Keys**: Go to your dashboard → API Keys
4. **Create Key**: Generate a new API key
5. **Copy Key**: Copy the key to your `.env.local` file

**Note**: OpenRouter offers free credits and DeepSeek Chat V3 is completely free to use!

### 4. Set Up Clerk Authentication

1. **Visit Clerk**: Go to [https://clerk.com/](https://clerk.com/)
2. **Create Application**: Set up a new application
3. **Get Keys**: Copy your publishable and secret keys
4. **Configure**: Add the keys to your `.env.local` file

### 5. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View your data
npx prisma studio
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 🔍 Testing the AI Integration

1. **Navigate to Budget Page**: Go to `/budget` in your application
2. **Enter Income**: Set a monthly income amount
3. **Allocate Budget**: Distribute money across categories
4. **Watch AI Insights**: The AI will automatically analyze your budget
5. **Refresh Insights**: Click "Refresh AI Insights" to get new recommendations

## 🚨 Troubleshooting

### AI Insights Not Working?

- **Check API Key**: Ensure your OpenRouter API key is correct
- **Verify Credits**: Check if you have available credits in OpenRouter
- **Environment Variables**: Make sure `.env.local` is in the root directory
- **Restart Server**: Restart your development server after adding environment variables

### Authentication Issues?

- **Clerk Keys**: Verify your Clerk publishable and secret keys
- **Redirect URLs**: Ensure your Clerk app has the correct redirect URLs
- **Environment**: Check that you're using the right keys for your environment

### Database Problems?

- **Prisma Client**: Run `npx prisma generate` to regenerate the client
- **Migrations**: Use `npx prisma db push` to apply schema changes
- **Reset**: If needed, delete `dev.db` and run migrations again

## 💡 Pro Tips

- **Free Tier**: OpenRouter offers free credits - perfect for development
- **Model Selection**: The app uses DeepSeek Chat V3 for optimal financial analysis (completely free!)
- **Real-time Updates**: AI insights update automatically as you change your budget
- **Fallback Support**: Local insights are available if AI is unavailable
- **Responsive Design**: Test on mobile devices for the best experience

## 🔗 Useful Links

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [DeepSeek AI](https://www.deepseek.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Need Help?

If you're still having issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your API keys have sufficient permissions
4. Check the [Issues](https://github.com/yourusername/financial-tracker/issues) page
5. Create a new issue with detailed error information

---

Happy coding! 🎉
