"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { CalendarIcon, PiggyBank, TrendingUp, CreditCard, Timer, AlertCircle, CheckCircle2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ListItem {
  id: string
  title: string
  subtitle: string
  icon: any // LucideIcon type
  iconStyle: string
  date: string
  time?: string
  amount?: string
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

interface AddEditEventDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (event: ListItem) => void
  initialData?: ListItem | null
}

const iconOptions = [
  { value: "PiggyBank", label: "Piggy Bank", icon: PiggyBank, style: "savings" },
  { value: "TrendingUp", label: "Trending Up", icon: TrendingUp, style: "investment" },
  { value: "CreditCard", label: "Credit Card", icon: CreditCard, style: "debt" },
]

const statusOptions = [
  { value: "pending", label: "Pending", icon: Timer },
  { value: "in-progress", label: "In Progress", icon: AlertCircle },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
]

export default function AddEditEventDialog({ isOpen, onClose, onSubmit, initialData }: AddEditEventDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "")
  const [selectedIconValue, setSelectedIconValue] = useState(initialData?.icon.displayName || "PiggyBank")
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : undefined)
  const [amount, setAmount] = useState(initialData?.amount || "")
  const [progress, setProgress] = useState(initialData?.progress?.toString() || "")
  const [status, setStatus] = useState<ListItem["status"]>(initialData?.status || "pending")

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setSubtitle(initialData.subtitle)
      setSelectedIconValue(initialData.icon.displayName || "PiggyBank")
      setDate(initialData.date ? new Date(initialData.date) : undefined)
      setAmount(initialData.amount || "")
      setProgress(initialData.progress?.toString() || "")
      setStatus(initialData.status)
    } else {
      setTitle("")
      setSubtitle("")
      setSelectedIconValue("PiggyBank")
      setDate(undefined)
      setAmount("")
      setProgress("")
      setStatus("pending")
    }
  }, [initialData, isOpen])

  function handleSubmit() {
    const selectedIcon = iconOptions.find((opt) => opt.value === selectedIconValue)
    const newEvent: ListItem = {
      id: initialData?.id || `evt-${Date.now()}`,
      title,
      subtitle,
      icon: selectedIcon?.icon || PiggyBank,
      iconStyle: selectedIcon?.style || "savings",
      date: date ? format(date, "MMM yyyy") : "", // Format date for display
      amount: amount || undefined,
      status,
      progress: progress ? Number.parseInt(progress) : undefined,
    }
    onSubmit(newEvent)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Make changes to your event here." : "Add a new upcoming event."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subtitle" className="text-right">
              Subtitle
            </Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Select value={selectedIconValue} onValueChange={setSelectedIconValue}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
                {iconOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      {React.createElement(opt.icon, { className: "w-4 h-4" })} {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="₹0.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="progress" className="text-right">
              Progress (%)
            </Label>
            <Input
              id="progress"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="col-span-3"
              type="number"
              min="0"
              max="100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value: ListItem["status"]) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      {React.createElement(opt.icon, { className: "w-4 h-4" })} {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {initialData ? "Save changes" : "Add Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
