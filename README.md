# Financial Tracker with DeepSeek AI

A modern, AI-powered financial tracking application built with Next.js, featuring intelligent budget analysis powered by DeepSeek Chat V3 (Free).

## 🚀 Features

- **Smart Budget Planning**: Interactive budget calculator with category recommendations
- **AI-Powered Insights**: Advanced financial analysis using DeepSeek AI
- **Real-time Analytics**: Live budget tracking and visualization
- **Personalized Recommendations**: AI-generated insights based on your financial data
- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **Secure Authentication**: Built with Clerk for secure user management

## 🤖 AI Capabilities

This application leverages **DeepSeek AI** to provide intelligent financial insights:

- **Budget Analysis**: AI-powered analysis of your budget allocation
- **Financial Health Assessment**: Emergency fund adequacy, debt-to-income ratios
- **Smart Recommendations**: Personalized suggestions for financial optimization
- **Category Optimization**: AI insights on spending patterns and allocations
- **Real-time Insights**: Instant analysis as you adjust your budget

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: OpenRouter API (DeepSeek Chat V3 - Free)
- **Authentication**: Clerk
- **Database**: Prisma with SQLite
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- OpenRouter API key

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd financial-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (for development)
DATABASE_URL="file:./dev.db"
```

### 4. Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to your API keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

**Note**: OpenRouter offers free credits and DeepSeek Chat V3 is available for free!

### 5. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🎯 How to Use

### Budget Planning

1. **Set Your Income**: Enter your monthly after-tax income
2. **Allocate Categories**: Distribute your income across budget categories
3. **Get AI Insights**: Receive intelligent recommendations from DeepSeek AI
4. **Optimize**: Use AI insights to improve your financial planning

### AI Insights Features

- **Automatic Analysis**: AI analyzes your budget as you make changes
- **Smart Recommendations**: Personalized advice based on your financial situation
- **Real-time Updates**: Instant insights as you adjust allocations
- **Fallback Support**: Local insights if AI is unavailable

## 🔒 Security Features

- **User Authentication**: Secure login with Clerk
- **API Key Protection**: Environment variable-based configuration
- **Data Privacy**: User data isolation and secure storage
- **HTTPS Ready**: Production-ready security configurations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Ensure these are set in your production environment:

```env
OPENROUTER_API_KEY=your_production_openrouter_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
CLERK_SECRET_KEY=your_production_clerk_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/financial-tracker/issues) page
2. Ensure your environment variables are correctly set
3. Verify your OpenRouter API key is valid and has sufficient credits
4. Check the browser console for any error messages

## 🔮 Future Enhancements

- **Multi-currency Support**: International financial tracking
- **Investment Portfolio Integration**: Stock and crypto tracking
- **Advanced AI Models**: Support for additional OpenRouter models
- **Mobile App**: React Native companion application
- **API Endpoints**: Public API for third-party integrations

---

Built with ❤️ using Next.js and DeepSeek AI
