# Ledger - Financial Dashboard

A modern financial dashboard built with Next.js 15, React 19, and Tailwind CSS for managing accounts, goals, and financial analytics.

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

### 📊 Analytics & Reporting
- **Dynamic Charts**: Revenue, expenses, and account category charts
- **Salary Integration**: Uses monthly salary as revenue when no data exists
- **Real-time Calculations**: All analytics update based on user data
- **Zero State**: New users start with empty analytics

### ⚙️ Settings & Customization
- **Profile Management**: Upload profile pictures and set usernames
- **Currency Selection**: Support for 10+ currencies worldwide
- **Theme Toggle**: Light, dark, and system themes
- **Financial Preferences**: Set salary and currency preferences

### 🆘 Help & Support
- **Comprehensive FAQs**: Organized by categories (Getting Started, Accounts, Goals, etc.)
- **Troubleshooting Guide**: Common issues and solutions
- **Privacy Information**: Clear explanation of data storage

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Run Development Server**:
   ```bash
   pnpm dev
   ```

3. **Access the Dashboard**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Enter any name/email to log in
   - Start managing your financial data!

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Cookies**: js-cookie

## 📁 Project Structure

```
dashboard_v8/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard page
│   ├── analytics/         # Analytics page
│   ├── goals/            # Goals management page
│   ├── settings/         # Settings page
│   └── help/             # Help & support page
├── components/            # Reusable UI components
│   ├── ledger/           # Dashboard-specific components
│   ├── ui/               # Base UI components
│   └── dialogs/          # Modal dialogs
├── context/              # React Context providers
│   ├── user-context.tsx  # User authentication
│   └── financial-data-context.tsx # Financial data management
└── lib/                  # Utility functions
```

## 🔧 Key Features Implementation

### User Context (`context/user-context.tsx`)
- Manages login/logout state
- Stores user data in cookies
- Provides user information throughout the app

### Financial Data Context (`context/financial-data-context.tsx`)
- Manages accounts, goals, and analytics data
- Handles localStorage persistence per user
- Provides CRUD operations for all financial data

### Goals System
- Transformed from "Upcoming Events" to "Financial Goals"
- Added target completion dates with days remaining
- Color-coded status indicators
- Progress tracking with visual bars

### Settings Page
- Profile picture upload and management
- Currency selection with 10+ options
- Salary and financial preferences
- Theme toggling

### Help System
- Comprehensive FAQ organized by categories
- Troubleshooting guide
- Privacy and security information

## 🎨 UI/UX Improvements

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop and mobile
- **Dark Mode**: Full dark mode support
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Smooth transitions and feedback

## 🔒 Privacy & Security

- **Local Storage**: All data stays on your device
- **No Passwords**: Simple demo authentication
- **Data Isolation**: Each user has separate data
- **Clear Data**: Option to reset all data

## 🚀 Future Enhancements

- [ ] Real authentication system
- [ ] Cloud data synchronization
- [ ] Export/import functionality
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-currency support
- [ ] Budget planning tools

## 📝 License

This project is for demonstration purposes. Feel free to use and modify as needed.