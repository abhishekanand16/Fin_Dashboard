# Financial Dashboard - Kite & Groww Integration Setup

This guide will help you configure the Kite Connect and Groww API integrations for seamless account connection and portfolio synchronization.

## Prerequisites

- Node.js 18+ installed
- A Zerodha Kite account (for Kite Connect)
- A Groww account (for Groww API)
- Basic understanding of environment variables

## API Configuration

### 1. Kite Connect Setup

1. **Create Developer Account:**
   - Visit [Kite Connect Developer Portal](https://www.kite.trade/)
   - Sign up with your Zerodha credentials
   - Complete the developer verification process

2. **Create Application:**
   - Log in to the developer portal
   - Click "Create App" and fill in the details:
     - App Name: Your app name
     - Redirect URL: `http://localhost:3000/stocks/callback` (for development)
     - Description: Brief description of your app
   - Note down your `API Key` and `API Secret`

3. **Configure Environment Variables:**
   Create a `.env.local` file in your project root with:
   ```env
   KITE_API_KEY=your_kite_api_key_here
   KITE_API_SECRET=your_kite_api_secret_here
   NEXT_PUBLIC_KITE_API_KEY=your_kite_api_key_here
   ```

### 2. Groww API Setup

1. **Enable Trading APIs:**
   - Log in to your Groww account
   - Navigate to Settings > Trading APIs
   - Enable API access and generate credentials
   - Note down your `API Key` and `API Secret`

2. **Configure Environment Variables:**
   Add to your `.env.local` file:
   ```env
   GROWW_API_KEY=your_groww_api_key_here
   GROWW_API_SECRET=your_groww_api_secret_here
   ```

## Features

### ✅ Implemented Features

- **Kite Connect Integration:**
  - OAuth authentication flow
  - Automatic holdings synchronization
  - Real-time portfolio updates
  - P&L calculations

- **Groww Integration:**
  - API route setup
  - Holdings data structure
  - Manual entry fallback

- **Enhanced UI:**
  - Modern connection cards
  - Portfolio overview dashboard
  - Broker-wise performance tracking
  - Analytics integration

- **Data Management:**
  - Financial data context integration
  - Local storage persistence
  - Error handling and user feedback

### 🔄 User Flow

1. **Connect Account:**
   - User clicks "Connect Kite Account" or "Connect Groww Account"
   - Redirected to broker's OAuth page
   - User authorizes the application
   - Redirected back with authentication token

2. **Data Synchronization:**
   - Backend exchanges token for access token
   - Fetches holdings data from broker API
   - Transforms data to application format
   - Stores in financial data context

3. **Portfolio Display:**
   - Holdings displayed on stocks page
   - Analytics updated with portfolio data
   - Real-time P&L calculations
   - Broker performance comparison

## Security Considerations

- **API Keys:** Never commit API keys to version control
- **Environment Variables:** Use `.env.local` for local development
- **HTTPS:** Use HTTPS in production for secure token exchange
- **Token Storage:** Access tokens are not stored permanently (session-based)

## Troubleshooting

### Common Issues

1. **"API Key not found" error:**
   - Ensure `.env.local` file exists and contains correct API keys
   - Restart your development server after adding environment variables

2. **"Invalid redirect URI" error:**
   - Verify redirect URI in Kite Connect app settings matches your callback URL
   - For development: `http://localhost:3000/stocks/callback`

3. **"Failed to fetch holdings" error:**
   - Check if your Kite account has 2FA enabled
   - Verify API credentials are correct
   - Ensure your account has trading permissions

4. **Groww connection issues:**
   - Groww API may require additional verification
   - Use manual entry as fallback option

### Debug Mode

Enable debug logging by adding to `.env.local`:
```env
DEBUG=true
```

## Production Deployment

1. **Update Redirect URIs:**
   - Change redirect URIs to your production domain
   - Update Kite Connect app settings

2. **Environment Variables:**
   - Set production environment variables
   - Use secure secret management

3. **HTTPS:**
   - Ensure all API communications use HTTPS
   - Update callback URLs to use HTTPS

## API Documentation

- [Kite Connect API Docs](https://kite.trade/docs/connect/v3)
- [Groww API Docs](https://groww.in/trade-api/docs/python-sdk)

## Support

For issues related to:
- **Kite Connect:** Contact Zerodha support
- **Groww API:** Contact Groww support
- **Application bugs:** Check the GitHub issues

---

**Note:** This integration requires active trading accounts with the respective brokers. Demo accounts may have limited API access.
