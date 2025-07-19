"use client"

import { cn } from "@/lib/utils"
import { Calendar, type LucideIcon, ArrowRight, CheckCircle2, Timer, AlertCircle, Pencil, Plus, PiggyBank, TrendingUp, CreditCard, Trash2 } from "lucide-react"
import React, { useState } from "react"
import AddEditEventDialog from "../dialogs/add-edit-event-dialog"
import { Button } from "@/components/ui/button"
import { useFinancialData } from "@/context/financial-data-context" // Import useFinancialData
import { format } from "date-fns"

interface ListItem {
  id: string
  title: string
  subtitle: string
  icon: string // Store as string instead of LucideIcon
  iconStyle: string
  targetDate: string // Change from date to targetDate for completion
  time?: string
  amount?: string
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

interface List03Props {
  className?: string
}

const iconStyles = {
  savings: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  investment: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
  debt: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
}

const statusConfig = {
  pending: {
    icon: Timer,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  "in-progress": {
    icon: AlertCircle,
    class: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  completed: {
    icon: CheckCircle2,
    class: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
}

// Map icon string to component
const iconMap = {
  PiggyBank,
  TrendingUp,
  CreditCard,
  // Add more icons here if needed
}

export default function List03({ className }: List03Props) {
  const { events, addEvent, updateEvent, deleteEvent } = useFinancialData() // Use data from context
  const [isAddEditEventDialogOpen, setIsAddEditEventDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ListItem | null>(null)

  const handleAddEditEvent = (event: ListItem) => {
    if (event.id.startsWith("evt-")) {
      addEvent(event) // Use context's addEvent
    } else {
      updateEvent(event) // Use context's updateEvent
    }
    setIsAddEditEventDialogOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEvent(eventId)
    }
  }

  const calculateDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatTargetDate = (targetDate: string) => {
    const date = new Date(targetDate)
    return format(date, "MMM dd, yyyy")
  }

  const openEditDialog = (event: ListItem) => {
    setEditingEvent(event)
    setIsAddEditEventDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingEvent(null)
    setIsAddEditEventDialogOpen(true)
  }

  return (
    <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
      <div className="flex gap-3 min-w-full p-1">
        {events.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap]
          const daysRemaining = calculateDaysRemaining(item.targetDate)
          const isOverdue = daysRemaining < 0
          const isToday = daysRemaining === 0
          const isUpcoming = daysRemaining > 0
          
          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col",
                "w-[280px] shrink-0",
                "bg-white dark:bg-zinc-900/70",
                "rounded-xl",
                "border border-zinc-100 dark:border-zinc-800",
                "hover:border-zinc-200 dark:hover:border-zinc-700",
                "transition-all duration-200",
                "shadow-sm backdrop-blur-xl",
              )}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2 rounded-lg", iconStyles[item.iconStyle as keyof typeof iconStyles])}>
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                        statusConfig[item.status].bg,
                        statusConfig[item.status].class,
                      )}
                    >
                      {React.createElement(statusConfig[item.status].icon, { className: "w-3.5 h-3.5" })}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => openEditDialog(item)}
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:text-red-500"
                      onClick={() => handleDeleteEvent(item.id, item.title)}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{item.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.subtitle}</p>
                </div>

                {typeof item.progress === "number" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                      <span className="text-zinc-900 dark:text-zinc-100">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {item.amount && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.amount}</span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">target</span>
                  </div>
                )}

                {item.amount && typeof item.progress === "number" && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {(() => {
                        const targetAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""))
                        const completedAmount = (targetAmount * item.progress) / 100
                        const remainingAmount = targetAmount - completedAmount
                        return `${remainingAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} remaining`
                      })()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    <span>{formatTargetDate(item.targetDate)}</span>
                  </div>
                  <div className={cn(
                    "text-xs font-medium",
                    isOverdue ? "text-red-600 dark:text-red-400" : 
                    isToday ? "text-orange-600 dark:text-orange-400" : 
                    "text-zinc-600 dark:text-zinc-400"
                  )}>
                    {isOverdue ? `${Math.abs(daysRemaining)} days overdue` :
                     isToday ? "Due today" :
                     `${daysRemaining} days left`}
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => alert(`Viewing details for ${item.title}`)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "py-2.5 px-3",
                    "text-xs font-medium",
                    "text-zinc-600 dark:text-zinc-400",
                    "hover:text-zinc-900 dark:hover:text-zinc-100",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                    "transition-colors duration-200",
                  )}
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
        {/* Add New Goal Card */}
        <div
          onClick={openAddDialog}
          className={cn(
            "flex flex-col items-center justify-center",
            "w-[280px] shrink-0",
            "bg-white dark:bg-zinc-900/70",
            "rounded-xl",
            "border border-dashed border-zinc-300 dark:border-zinc-700",
            "hover:border-zinc-400 dark:hover:border-zinc-600",
            "transition-all duration-200",
            "shadow-sm backdrop-blur-xl",
            "cursor-pointer p-4 text-center",
          )}
        >
          <Plus className="w-8 h-8 text-zinc-500 dark:text-zinc-400 mb-2" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Add New Goal</span>
        </div>
      </div>

      <AddEditEventDialog
        isOpen={isAddEditEventDialogOpen}
        onClose={() => setIsAddEditEventDialogOpen(false)}
        onSubmit={handleAddEditEvent}
        initialData={editingEvent}
      />
    </div>
  )
}
