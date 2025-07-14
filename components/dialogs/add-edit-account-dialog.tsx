"use client"

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

interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt"
}

interface AddEditAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (account: AccountItem) => void
  initialData?: AccountItem | null
}

export default function AddEditAccountDialog({ isOpen, onClose, onSubmit, initialData }: AddEditAccountDialogProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [balance, setBalance] = useState(initialData?.balance || "")
  const [type, setType] = useState<AccountItem["type"]>(initialData?.type || "checking")

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || "")
      setBalance(initialData.balance)
      setType(initialData.type)
    } else {
      setTitle("")
      setDescription("")
      setBalance("")
      setType("checking")
    }
  }, [initialData, isOpen]) // Reset form when dialog opens or initialData changes

  function handleSubmit() {
    const newAccount: AccountItem = {
      id: initialData?.id || `acc-${Date.now()}`, // Generate ID for new accounts
      title,
      description,
      balance,
      type,
    }
    onSubmit(newAccount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Account" : "Add New Account"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Make changes to your account here." : "Add a new financial account."}
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
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="text-right">
              Balance
            </Label>
            <Input
              id="balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="col-span-3"
              type="text" // Use text to allow for currency symbols, or number if strictly numeric
              placeholder="₹0.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value: AccountItem["type"]) => setType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {initialData ? "Save changes" : "Add Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
