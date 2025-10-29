import { NextRequest, NextResponse } from "next/server"

// Categories for transaction classification
const TRANSACTION_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Bills & Utilities",
  "Education",
  "Travel",
  "Investments",
  "Income",
  "Transfer",
  "Others"
]

interface ProcessedTransaction {
  date: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  paymentMethod?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Read file content
    const text = await file.text()
    
    // Process the statement using AI
    const transactions = await processStatementWithAI(text)
    
    return NextResponse.json({ 
      success: true, 
      transactions,
      message: `Successfully processed ${transactions.length} transactions`
    })
  } catch (error) {
    console.error("Error processing statement:", error)
    return NextResponse.json(
      { error: "Failed to process bank statement" },
      { status: 500 }
    )
  }
}

async function processStatementWithAI(text: string): Promise<ProcessedTransaction[]> {
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
  
  if (!apiKey) {
    // Fallback to rule-based processing if no API key
    return fallbackProcessing(text)
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a financial assistant that extracts and categorizes transactions from bank statements. 
            
Extract each transaction and categorize it into one of these categories:
${TRANSACTION_CATEGORIES.join(", ")}

Return a JSON array of transactions with this exact structure:
[
  {
    "date": "YYYY-MM-DD",
    "description": "transaction description",
    "amount": number (positive for all amounts),
    "type": "income" or "expense",
    "category": "one of the categories above",
    "paymentMethod": "card/upi/netbanking/cash/cheque/etc"
  }
]

Rules:
- Extract ALL transactions from the statement
- Amount should always be positive numbers
- Type should be "income" for credits/deposits and "expense" for debits/withdrawals
- Use best judgment for categorization
- Description should be clean and concise
- If payment method is not clear, use "bank transfer"
- Return ONLY the JSON array, no other text`
          },
          {
            role: "user",
            content: `Extract and categorize all transactions from this bank statement:\n\n${text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "[]"
    
    // Parse the JSON response
    const transactions = JSON.parse(content)
    
    return transactions
  } catch (error) {
    console.error("AI processing error:", error)
    // Fallback to rule-based processing
    return fallbackProcessing(text)
  }
}

function fallbackProcessing(text: string): ProcessedTransaction[] {
  const transactions: ProcessedTransaction[] = []
  const lines = text.split('\n')
  
  // Common patterns for bank statements
  const datePattern = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/
  const amountPattern = /(?:₹|INR|Rs\.?|USD|\$|EUR|€)\s*(\d+(?:,\d+)*(?:\.\d{2})?)|(\d+(?:,\d+)*(?:\.\d{2}))\s*(?:Dr|Cr|DB|CR)?/i
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.length < 10) continue
    
    const dateMatch = line.match(datePattern)
    const amountMatches = Array.from(line.matchAll(new RegExp(amountPattern, 'gi')))
    
    if (dateMatch && amountMatches.length > 0) {
      // Extract date
      let dateStr = dateMatch[1]
      // Normalize date format
      const dateParts = dateStr.split(/[-\/]/)
      let year, month, day
      
      if (dateParts[0].length === 4) {
        // YYYY-MM-DD format
        [year, month, day] = dateParts
      } else if (dateParts[2].length === 4) {
        // DD-MM-YYYY format
        [day, month, year] = dateParts
      } else {
        // DD-MM-YY format
        [day, month, year] = dateParts
        year = `20${year}`
      }
      
      const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      
      // Extract amount (last amount in line is usually the balance or transaction amount)
      const amountMatch = amountMatches[amountMatches.length - 1]
      const amountStr = (amountMatch[1] || amountMatch[2] || "0").replace(/,/g, '')
      const amount = parseFloat(amountStr)
      
      if (amount > 0) {
        // Determine type based on keywords
        const lowerLine = line.toLowerCase()
        let type: "income" | "expense" = "expense"
        
        if (
          lowerLine.includes('credit') || 
          lowerLine.includes('deposit') || 
          lowerLine.includes('salary') ||
          lowerLine.includes('cr ') ||
          lowerLine.match(/\bcr\b/)
        ) {
          type = "income"
        }
        
        // Extract description (remove date and amount)
        let description = line
          .replace(datePattern, '')
          .replace(amountPattern, '')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (description.length > 100) {
          description = description.substring(0, 100) + '...'
        }
        
        // Simple categorization
        let category = "Others"
        const descLower = description.toLowerCase()
        
        if (descLower.includes('food') || descLower.includes('restaurant') || descLower.includes('zomato') || descLower.includes('swiggy')) {
          category = "Food & Dining"
        } else if (descLower.includes('amazon') || descLower.includes('flipkart') || descLower.includes('shop')) {
          category = "Shopping"
        } else if (descLower.includes('uber') || descLower.includes('ola') || descLower.includes('petrol') || descLower.includes('fuel')) {
          category = "Transportation"
        } else if (descLower.includes('movie') || descLower.includes('netflix') || descLower.includes('spotify')) {
          category = "Entertainment"
        } else if (descLower.includes('hospital') || descLower.includes('medical') || descLower.includes('pharmacy')) {
          category = "Healthcare"
        } else if (descLower.includes('electricity') || descLower.includes('water') || descLower.includes('bill')) {
          category = "Bills & Utilities"
        } else if (descLower.includes('salary') || descLower.includes('income')) {
          category = "Income"
        } else if (descLower.includes('transfer') || descLower.includes('upi')) {
          category = "Transfer"
        }
        
        // Detect payment method
        let paymentMethod = "bank transfer"
        if (descLower.includes('upi')) paymentMethod = "upi"
        else if (descLower.includes('card')) paymentMethod = "card"
        else if (descLower.includes('atm')) paymentMethod = "atm"
        else if (descLower.includes('cheque') || descLower.includes('check')) paymentMethod = "cheque"
        
        transactions.push({
          date,
          description: description || "Bank transaction",
          amount,
          type,
          category,
          paymentMethod
        })
      }
    }
  }
  
  return transactions
}

