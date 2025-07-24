"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useUser } from "@/context/user-context"
import { useFinancialData } from "@/context/financial-data-context"
import { useStyle } from "@/components/style-provider"
import { 
  User, 
  DollarSign, 
  Palette, 
  Upload, 
  PiggyBank, 
  TrendingDown,
  Settings,
  Moon,
  Sun,
  Monitor
} from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { style, setStyle } = useStyle()
  const { user, updateUsername, updateProfilePicture } = useUser()
  const { 
    currency, 
    setCurrency, 
    salaryAmount, 
    setSalaryAmount, 
    monthlyExpenseAmount, 
    setMonthlyExpenseAmount 
  } = useFinancialData()

  const [username, setUsername] = useState(user || "")
  const [tempSalaryAmount, setTempSalaryAmount] = useState(salaryAmount.toString())
  const [tempExpenseAmount, setTempExpenseAmount] = useState(monthlyExpenseAmount.toString())

  const currencyOptions = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
  ]

  const handleProfileUpdate = useCallback(() => {
    if (username.trim()) {
      updateUsername(username.trim())
    }
  }, [username, updateUsername])

  const handleFinancialUpdate = useCallback(() => {
    const salary = parseFloat(tempSalaryAmount) || 0
    const expense = parseFloat(tempExpenseAmount) || 0
    setSalaryAmount(salary)
    setMonthlyExpenseAmount(expense)
  }, [tempSalaryAmount, tempExpenseAmount, setSalaryAmount, setMonthlyExpenseAmount])

  const handleProfilePictureUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateProfilePicture(result)
      }
      reader.readAsDataURL(file)
    }
  }, [updateProfilePicture])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile, financial preferences, and app appearance.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="ui" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            UI Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your username and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={localStorage.getItem(`profile_picture_${user}`) || ""} />
                  <AvatarFallback className="text-lg">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="profile-picture" className="text-sm font-medium">
                    Profile Picture
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('profile-picture')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="flex-1"
                  />
                  <Button onClick={handleProfileUpdate}>
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Settings */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Financial Preferences
              </CardTitle>
              <CardDescription>
                Set your currency, monthly salary, and expenses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        <div className="flex items-center gap-2">
                          <span>{curr.symbol}</span>
                          <span>{curr.name}</span>
                          <span className="text-gray-500">({curr.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Monthly Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4" />
                  Monthly Salary
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="salary"
                    value={tempSalaryAmount}
                    onChange={(e) => setTempSalaryAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button onClick={handleFinancialUpdate}>
                    Update
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  This amount will be used as monthly revenue in analytics.
                </p>
              </div>

              <Separator />

              {/* Monthly Expenses */}
              <div className="space-y-2">
                <Label htmlFor="expenses" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Monthly Expenses/EMI
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="expenses"
                    value={tempExpenseAmount}
                    onChange={(e) => setTempExpenseAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Button onClick={handleFinancialUpdate}>
                    Update
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  This amount will be used as monthly expenses in analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI Settings */}
        <TabsContent value="ui" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the app's appearance and theme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <Sun className="w-6 h-6" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <Moon className="w-6 h-6" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <Monitor className="w-6 h-6" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
              {/* Style Selection */}
              <div className="space-y-4 mt-6">
                <Label className="text-base font-medium">Style</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={style === "normal" ? "default" : "outline"}
                    onClick={() => setStyle("normal")}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700" />
                    <span>Normal</span>
                  </Button>
                  <Button
                    variant={style === "glass" ? "default" : "outline"}
                    onClick={() => setStyle("glass")}
                    className="flex flex-col items-center gap-2 h-auto p-4 border-cyan-400 border-2"
                    style={{ background: style === "glass" ? "rgba(34, 212, 238, 0.12)" : undefined }}
                  >
                    <span className="w-6 h-6 rounded-full bg-white/30 backdrop-blur border border-cyan-400" />
                    <span className="font-semibold text-cyan-700 dark:text-cyan-200">Glass</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Additional UI Settings */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Display Options</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Progress Bars</Label>
                      <p className="text-sm text-gray-500">
                        Display progress bars in goal cards
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-gray-500">
                        Reduce spacing for more content
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-gray-500">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
