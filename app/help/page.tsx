"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  DollarSign, 
  Target, 
  BarChart3, 
  Settings, 
  Shield, 
  HelpCircle, 
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Calendar,
  Palette
} from "lucide-react"
import { useStyle } from "@/components/style-provider"

export default function HelpPage() {
  const { style } = useStyle();
  const isGlass = style === "glass";
  return (
    <div className={isGlass ? "p-6 max-w-4xl mx-auto bg-white/60 dark:bg-[#1F1F23]/60 border-cyan-300/60 shadow-xl backdrop-blur-2xl rounded-2xl" : "p-6 max-w-4xl mx-auto"}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Help & Support</h1>
        <p className="text-gray-600 dark:text-gray-400">Find answers to common questions and learn how to use the Ledger Dashboard effectively.</p>
      </div>

      <div className="grid gap-6">
        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get started with the Ledger Dashboard in just a few steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">1. Login</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter any username to create your account. No password required - data is stored locally in your browser.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">2. Set Up Your Profile</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Go to Settings → Profile to upload a profile picture and customize your username.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">3. Configure Financial Settings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set your currency, monthly salary, and expenses in Settings → Financial.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">4. Add Accounts & Goals</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create accounts and set financial goals with target dates and progress tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Questions about accounts, profiles, and data management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create an account?</AccordionTrigger>
                  <AccordionContent>
                    Simply enter any username on the login page. No password is required. Your data is stored locally in your browser and is private to you.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I change my username?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Go to Settings → Profile and update your username. The change will be reflected immediately across the app.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I upload a profile picture?</AccordionTrigger>
                  <AccordionContent>
                    In Settings → Profile, click the "Upload Image" button next to your avatar. Select any image file and it will be automatically resized and stored.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All data is stored locally in your browser using localStorage. No data is sent to external servers. Each user's data is completely isolated.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I clear my data?</AccordionTrigger>
                  <AccordionContent>
                    Click on your profile picture in the header, then click "Clear Data". This will reset all your accounts, goals, and settings to default values.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Financial Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Features
              </CardTitle>
              <CardDescription>
                Questions about accounts, transactions, and financial tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I add a new account?</AccordionTrigger>
                  <AccordionContent>
                    Click the "Add" button in the Accounts section. Choose an account type (Savings, Checking, Investment, Debt, or Salary), enter the title, description, and balance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger>What are the different account types?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div><Badge variant="outline" className="mr-2">Savings</Badge> For emergency funds and long-term savings</div>
                      <div><Badge variant="outline" className="mr-2">Checking</Badge> For daily expenses and transactions</div>
                      <div><Badge variant="outline" className="mr-2">Investment</Badge> For stocks, bonds, and other investments</div>
                      <div><Badge variant="outline" className="mr-2">Debt</Badge> For credit cards and loans</div>
                      <div><Badge variant="outline" className="mr-2">Salary</Badge> For income tracking</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger>How do I set my monthly salary?</AccordionTrigger>
                  <AccordionContent>
                    Click the "Salary" button in the Accounts section, or go to Settings → Financial. This amount will be used as monthly revenue in analytics.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                  <AccordionTrigger>How do I set monthly expenses?</AccordionTrigger>
                  <AccordionContent>
                    Click the "Expenses" button in the Accounts section, or go to Settings → Financial. This amount will be used as monthly expenses in analytics.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                  <AccordionTrigger>Can I delete accounts?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Click the trash icon next to any account to delete it. You'll be asked to confirm the deletion.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Goals & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Goals & Progress
              </CardTitle>
              <CardDescription>
                Questions about setting and tracking financial goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-11">
                  <AccordionTrigger>How do I create a financial goal?</AccordionTrigger>
                  <AccordionContent>
                    Click "Add New Goal" in the Goals section. Enter a title, description, target amount, completion date, and initial progress percentage.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-12">
                  <AccordionTrigger>What do the goal colors mean?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> 0-19% - Needs attention</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> 20-39% - Getting started</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> 40-59% - Good progress</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> 60-79% - Almost there</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> 80-100% - Excellent progress</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-13">
                  <AccordionTrigger>How do I update goal progress?</AccordionTrigger>
                  <AccordionContent>
                    Click the edit icon on any goal card. You can update the progress percentage, and if you set it to 100%, the status will automatically change to "Completed".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-14">
                  <AccordionTrigger>What happens when a goal is completed?</AccordionTrigger>
                  <AccordionContent>
                    When you set progress to 100%, the goal status automatically changes to "Completed" and the days remaining text becomes dulled to indicate completion.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-15">
                  <AccordionTrigger>Can I edit goal details?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Click the edit icon on any goal to modify the title, description, target amount, completion date, or progress percentage.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Analytics & Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>
                Questions about charts, analytics, and financial insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-16">
                  <AccordionTrigger>How does the analytics work?</AccordionTrigger>
                  <AccordionContent>
                    Analytics combines your account balances, monthly salary, and monthly expenses to provide insights into your financial health. Revenue includes your salary, and expenses include your monthly expense setting.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-17">
                  <AccordionTrigger>What do the charts show?</AccordionTrigger>
                  <AccordionContent>
                    The charts display your total revenue vs expenses, account balances by category, and spending patterns. They update automatically when you modify accounts or financial settings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-18">
                  <AccordionTrigger>How is revenue calculated?</AccordionTrigger>
                  <AccordionContent>
                    Revenue is calculated from your monthly salary setting. If you haven't set a salary, it will show as ₹0. The salary amount appears as monthly revenue in the analytics.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-19">
                  <AccordionTrigger>How are expenses calculated?</AccordionTrigger>
                  <AccordionContent>
                    Expenses are calculated from your monthly expenses setting. If you haven't set monthly expenses, it will show as ₹0. This amount appears as monthly expenses in analytics.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-20">
                  <AccordionTrigger>Can I export my data?</AccordionTrigger>
                  <AccordionContent>
                    Currently, data is stored locally in your browser. You can view your data in the browser's developer tools under Application → Local Storage, but there's no built-in export feature yet.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Settings & Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings & Customization
              </CardTitle>
              <CardDescription>
                Questions about app settings, themes, and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-21">
                  <AccordionTrigger>How do I change the currency?</AccordionTrigger>
                  <AccordionContent>
                    Click the currency selector in the header (shows current currency like "₹ INR") and choose from the available options. The change affects all amounts displayed in the app.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-22">
                  <AccordionTrigger>How do I switch themes?</AccordionTrigger>
                  <AccordionContent>
                    Click the sun/moon icon in the header to toggle between light and dark themes. You can also go to Settings → UI Settings for more theme options including system theme.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-23">
                  <AccordionTrigger>What currencies are supported?</AccordionTrigger>
                  <AccordionContent>
                    The app supports 10 currencies: INR (₹), USD ($), EUR (€), GBP (£), AUD (A$), CAD (C$), SGD (S$), JPY (¥), CNY (¥), and ZAR (R).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-24">
                  <AccordionTrigger>How do I reset all settings?</AccordionTrigger>
                  <AccordionContent>
                    Click on your profile picture in the header, then click "Clear Data". This will reset all accounts, goals, and settings to their default values.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-25">
                  <AccordionTrigger>Is the app mobile-friendly?</AccordionTrigger>
                  <AccordionContent>
                    Yes! The dashboard is fully responsive and works well on mobile devices, tablets, and desktop computers. The sidebar collapses on smaller screens.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Troubleshooting
              </CardTitle>
              <CardDescription>
                Common issues and their solutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-26">
                  <AccordionTrigger>My data disappeared. What happened?</AccordionTrigger>
                  <AccordionContent>
                    Data is stored locally in your browser. If you clear browser data, use incognito mode, or switch browsers, your data won't be available. Make sure you're using the same browser and user account.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-27">
                  <AccordionTrigger>I can't upload a profile picture</AccordionTrigger>
                  <AccordionContent>
                    Make sure you're selecting an image file (JPG, PNG, etc.). The image will be automatically resized. If it still doesn't work, try refreshing the page and uploading again.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-28">
                  <AccordionTrigger>Goals aren't updating properly</AccordionTrigger>
                  <AccordionContent>
                    Try refreshing the page. If the issue persists, clear your browser cache or try the "Clear Data" option from your profile menu to reset everything.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-29">
                  <AccordionTrigger>The app looks broken</AccordionTrigger>
                  <AccordionContent>
                    Try refreshing the page (Ctrl+F5 or Cmd+Shift+R). If that doesn't work, clear your browser cache or try opening the app in an incognito/private window.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-30">
                  <AccordionTrigger>I'm getting error messages</AccordionTrigger>
                  <AccordionContent>
                    Most errors are temporary. Try refreshing the page. If errors persist, clear your browser data or contact support with the specific error message.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Still Need Help?
            </CardTitle>
            <CardDescription>
              Can't find the answer you're looking for? Here are additional resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Reset Everything</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If you're having major issues, you can reset all your data by clicking your profile picture → "Clear Data".
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Browser Compatibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The app works best with Chrome, Firefox, Safari, and Edge. Make sure you're using an updated browser.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Data Privacy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All your data is stored locally in your browser. We don't collect or store any personal information.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Feature Requests</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Have an idea for a new feature? The app is regularly updated with new capabilities based on user feedback.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
