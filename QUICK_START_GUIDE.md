# Quick Start Guide - Bank Statement Upload Feature

## 🚀 Getting Started in 5 Minutes

### Step 1: Setup (Optional - for AI processing)

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

**Don't have an API key?** No problem! The feature works without it using a smart fallback parser.

To get an OpenAI API key:
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy and paste it in `.env.local`

### Step 2: Start the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### Step 3: Test the Feature

1. **Navigate to Transactions page** in your browser
   - Click "Transactions" in the sidebar
   - Or go to `http://localhost:3000/transactions`

2. **Click "Upload Statement"** button

3. **Upload the sample file**
   - Use the provided sample: `/public/sample-statement.txt`
   - Or drag and drop your own bank statement

4. **Watch the magic happen!** ✨
   - Transactions are automatically extracted
   - Categorized intelligently
   - Added to your dashboard

5. **View Analytics**
   - Go to Analytics page
   - See charts update with your transaction data

## 📊 What You Can Do

### On Transactions Page:
- ✅ View all transactions in a beautiful table
- ✅ Search by description or category
- ✅ Filter by category or type (income/expense)
- ✅ See real-time statistics
- ✅ Delete unwanted transactions
- ✅ Upload multiple statements

### On Analytics Page:
- ✅ See transaction-based income & expenses
- ✅ View monthly trends
- ✅ Analyze spending by category
- ✅ Track net cashflow

## 🎯 Quick Tips

1. **Best File Formats**: TXT and CSV work best
2. **Sample Data**: Use `/public/sample-statement.txt` for testing
3. **Categories**: Transactions auto-categorize into 12+ categories
4. **Persistence**: All data saved automatically in your browser
5. **No Server Needed**: Everything works locally!

## 📝 Supported Bank Statement Formats

### Text Format (Best)
```
Date       Description           Amount
01/01/2024 Salary Credit        75,000.00 Cr
02/01/2024 UPI-Zomato           850.00 Dr
```

### CSV Format (Great)
```csv
Date,Description,Debit,Credit,Balance
2024-01-01,Salary Credit,,75000,75000
2024-01-02,Zomato,850,,74150
```

### PDF (Good)
- Standard bank statements
- Text must be selectable (not scanned)

## 🎨 Features at a Glance

| Feature | Description |
|---------|-------------|
| 🤖 AI Processing | Smart categorization using GPT-4 |
| 📤 Easy Upload | Drag & drop interface |
| 🔍 Search & Filter | Find transactions quickly |
| 📊 Auto Analytics | Charts update automatically |
| 💾 Data Persistence | Never lose your data |
| 🎯 Smart Categories | 12+ automatic categories |
| 💰 Real-time Stats | Income, expenses, balance |

## ❓ Troubleshooting

**Problem**: Transactions not categorizing correctly
- **Solution**: Edit them manually or improve your statement formatting

**Problem**: Upload seems slow
- **Solution**: Normal for large files (200+ transactions take ~30s)

**Problem**: No AI processing happening
- **Solution**: Add `OPENAI_API_KEY` to `.env.local` or use fallback parser

**Problem**: Chart not updating
- **Solution**: Upload at least a few transactions; charts need data!

## 🎓 Learn More

For detailed documentation, see:
- `BANK_STATEMENT_FEATURE.md` - Complete feature documentation
- `README.md` - Main project documentation

## 💡 Pro Tips

1. **Regular Uploads**: Upload statements monthly for best tracking
2. **Review First**: Check auto-categorized transactions
3. **Clean Statements**: Use official bank exports
4. **Multiple Accounts**: Upload statements from all your accounts
5. **Privacy**: All data stays in your browser - 100% private!

---

**Ready to track your finances like a pro?** Start by clicking "Upload Statement" on the Transactions page! 🚀


