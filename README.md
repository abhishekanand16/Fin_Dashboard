# Ledger - Financial Dashboard

A modern financial dashboard built with Next.js 15, React 19, and Tailwind CSS for managing accounts, goals, stock portfolios, transactions, and financial analytics.

## ✨ Features

### 🔐 User Authentication & Data Persistence
- **Simple Login System**: Enter any name/email to log in (no passwords required)
- **Per-User Data Storage**: All data is stored locally per user in localStorage
- **Session Management**: Login state persists across browser sessions using cookies
- **Data Isolation**: Each user has their own separate data

### 💰 Account Management
- **Multiple Account Types**: Savings, Checking, Investment, Debt, and Salary accounts
- **Add/Edit/Delete**: Full CRUD operations for accounts
- **Salary Integration**: Set monthly salary that appears in analytics
- **Visual Indicators**: Color-coded account types with appropriate icons

### 🎯 Financial Goals System
- **Target Dates**: Set completion dates for each goal
- **Progress Tracking**: Visual progress bars and percentage completion
- **Days Remaining**: Automatic calculation of days until target date
- **Status Indicators**: Overdue (red), due today (orange), upcoming (gray)
- **Amount Tracking**: Set target amounts and track remaining amounts

### 📈 Stock Portfolio Management
- **Multi-Broker Support**: Connect Kite (Zerodha) and Groww accounts
- **Auto-Sync Holdings**: Automatically import stock holdings from broker APIs
- **Portfolio Statistics**: Total invested, current value, and P&L calculations
- **Manual Entry**: Add stocks manually if broker API is unavailable
- **Real-time P&L**: Track profit/loss with percentage calculations
- **Broker Filtering**: Filter holdings by broker (Kite, Groww, or all)
- **Transaction Details**: View quantity, average price, LTP, and investment details

### 💳 Transaction Management
- **Bank Statement Upload**: Upload bank statements in text format
- **AI-Powered Processing**: Uses OpenAI GPT-4 to extract and categorize transactions
- **Fallback Processing**: Rule-based extraction when AI is unavailable
- **Transaction Categories**: Auto-categorize into Food & Dining, Shopping, Transportation, etc.
- **Search & Filter**: Search by description or category, filter by type (income/expense)
- **Transaction Statistics**: View total income, expenses, and net balance
- **Payment Method Tracking**: Track payment methods (UPI, Card, Net Banking, etc.)

### 📊 Analytics & Reporting
- **Dynamic Charts**: Revenue, expenses, and account category charts
- **Salary Integration**: Uses monthly salary as revenue when no data exists
- **Real-time Calculations**: All analytics update based on user data
- **Zero State**: New users start with empty analytics

### ⚙️ Settings & Customization
- **Profile Management**: Upload profile pictures and set usernames
- **Currency Selection**: Support for 10+ currencies worldwide (INR, USD, EUR, GBP, etc.)
- **Theme Toggle**: Light, dark, and system themes
- **Style Variants**: Choose between standard and glass morphism styles
- **Financial Preferences**: Set salary and currency preferences

### 🆘 Help & Support
- **Comprehensive FAQs**: Organized by categories (Getting Started, Accounts, Goals, etc.)
- **Troubleshooting Guide**: Common issues and solutions
- **Privacy Information**: Clear explanation of data storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/abhishekanand16/Fin_Dashboard
   cd Fin_Dashboard
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables** (optional):
   ```bash
   # For Kite/Zerodha integration
   NEXT_PUBLIC_KITE_API_KEY=your_kite_api_key
   
   # For AI-powered bank statement processing
   OPENAI_API_KEY=your_openai_api_key
   # OR
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run Development Server**:
   ```bash
   pnpm dev
   ```

5. **Access the Dashboard**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Enter any name/email to log in
   - Start managing your financial data!

### Production Build

```bash
pnpm build
pnpm start
```

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Cookies**: js-cookie
- **Form Validation**: React Hook Form + Zod
- **Toast Notifications**: Sonner
- **Theme Management**: next-themes

## 📁 Project Structure

```
Fin_Dashboard/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── kite-holdings/        # Kite broker integration
│   │   ├── groww-holdings/       # Groww broker integration
│   │   └── process-statement/    # Bank statement processing
│   ├── dashboard/                # Main dashboard page
│   ├── analytics/                # Analytics page
│   ├── goals/                    # Goals management page
│   ├── stocks/                   # Stock portfolio page
│   │   ├── callback/             # Kite OAuth callback
│   │   └── groww-callback/       # Groww OAuth callback
│   ├── transactions/             # Transaction management page
│   ├── settings/                 # Settings page
│   ├── organization/             # Organization page
│   └── help/                     # Help & support page
├── components/                   # Reusable UI components
│   ├── ledger/                   # Dashboard-specific components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── dialogs/                  # Modal dialogs
│   │   ├── add-groww-holding-dialog.tsx
│   │   └── upload-statement-dialog.tsx
│   └── providers.tsx             # Context providers
├── context/                      # React Context providers
│   ├── user-context.tsx          # User authentication
│   └── financial-data-context.tsx # Financial data management
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── public/                       # Static assets
```

## 🔧 Key Features Implementation

### User Context (`context/user-context.tsx`)
- Manages login/logout state
- Stores user data in cookies (30-day expiry)
- Provides user information throughout the app
- Handles profile picture storage in localStorage

### Financial Data Context (`context/financial-data-context.tsx`)
- Manages accounts, goals, transactions, and holdings
- Handles localStorage persistence per user
- Provides CRUD operations for all financial data
- Debounced localStorage writes for performance
- Supports multiple brokers (Kite, Groww, other)

### Stock Portfolio System
- **Kite Integration**: OAuth flow with Zerodha Kite API
- **Groww Integration**: Manual entry with future API support
- **Portfolio Calculations**: Automatic P&L and percentage calculations
- **Multi-Broker Management**: Track holdings across multiple brokers

### Transaction Management
- **AI Processing**: Uses OpenAI GPT-4o-mini for smart extraction
- **Rule-Based Fallback**: Pattern matching when AI unavailable
- **Category Auto-Detection**: Intelligently categorizes transactions
- **Payment Method Detection**: Identifies UPI, card, netbanking, etc.

### Goals System
- Transformed from "Upcoming Events" to "Financial Goals"
- Target completion dates with days remaining calculation
- Color-coded status indicators (overdue, due today, upcoming)
- Progress tracking with visual progress bars

### Settings Page
- Profile picture upload and management
- Currency selection with 10+ options
- Salary and financial preferences
- Theme toggling (light/dark/system)
- Style variant selection (standard/glass)

### Help System
- Comprehensive FAQ organized by categories
- Troubleshooting guide for common issues
- Privacy and security information

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with glass morphism option
- **Responsive Layout**: Fully responsive design for desktop, tablet, and mobile
- **Dark Mode**: Full dark mode support with system preference detection
- **Accessibility**: ARIA labels and keyboard navigation support
- **Loading States**: Smooth transitions and user feedback
- **Toast Notifications**: User-friendly notifications for actions
- **Data Validation**: Form validation with helpful error messages

## 🔒 Privacy & Security

- **Local Storage**: All data stays on your device
- **No Passwords**: Simple demo authentication system
- **Data Isolation**: Each user has separate data storage
- **Clear Data**: Option to reset all user data
- **No External Data Transmission**: Data processing happens locally (except API integrations when used)

## 📝 API Integrations

### Kite (Zerodha) Integration
1. Connect your Kite account via OAuth
2. Automatically sync stock holdings
3. View real-time portfolio data

### Groww Integration
- Manual entry support
- Future API integration planned

### Bank Statement Processing
- AI-powered extraction (requires OpenAI API key)
- Fallback rule-based processing
- Supports multiple statement formats

## 🚀 Future Enhancements

- [ ] Real authentication system with secure passwords
- [ ] Cloud data synchronization
- [ ] Export/import functionality (CSV, PDF)
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Multi-currency conversion with live rates
- [ ] Budget planning and tracking tools
- [ ] Recurring transaction management
- [ ] Investment tracking for mutual funds and ETFs
- [ ] Tax calculation and reporting
- [ ] Expense sharing and splitting
- [ ] Bill reminders and notifications
- [ ] Financial goal templates
- [ ] Data backup and restore

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is for demonstration purposes. Feel free to use and modify as needed.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)

---

**Made with ❤️ for better financial management**
