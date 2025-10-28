"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFinancialData, type Holding } from "@/context/financial-data-context"
import { toast } from "sonner"

interface AddGrowwHoldingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGrowwHoldingDialog({ open, onOpenChange }: AddGrowwHoldingDialogProps) {
  const [formData, setFormData] = useState({
    tradingsymbol: "",
    exchange: "NSE",
    quantity: "",
    average_price: "",
    last_price: "",
  })
  const { addHolding } = useFinancialData()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!formData.tradingsymbol || !formData.quantity || !formData.average_price || !formData.last_price) {
      toast.error("Please fill in all fields")
      return
    }

    const quantity = parseFloat(formData.quantity)
    const avgPrice = parseFloat(formData.average_price)
    const lastPrice = parseFloat(formData.last_price)

    if (isNaN(quantity) || isNaN(avgPrice) || isNaN(lastPrice)) {
      toast.error("Please enter valid numbers")
      return
    }

    // Calculate P&L
    const invested = quantity * avgPrice
    const currentValue = quantity * lastPrice
    const pnl = currentValue - invested
    const pnlPercentage = ((pnl / invested) * 100)

    const newHolding: Holding = {
      id: `groww-${Date.now()}`,
      tradingsymbol: formData.tradingsymbol.toUpperCase(),
      exchange: formData.exchange,
      quantity,
      average_price: avgPrice,
      last_price: lastPrice,
      pnl,
      pnl_percentage: pnlPercentage,
      broker: "groww",
      broker_account: "Groww Portfolio",
    }

    addHolding(newHolding)
    toast.success("Stock added successfully!")

    // Reset form
    setFormData({
      tradingsymbol: "",
      exchange: "NSE",
      quantity: "",
      average_price: "",
      last_price: "",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Groww Stock Holding</DialogTitle>
          <DialogDescription>
            Manually add a stock from your Groww portfolio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symbol" className="text-right">
                Symbol
              </Label>
              <Input
                id="symbol"
                placeholder="e.g., TCS, INFY"
                className="col-span-3"
                value={formData.tradingsymbol}
                onChange={(e) => setFormData({ ...formData, tradingsymbol: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exchange" className="text-right">
                Exchange
              </Label>
              <Select value={formData.exchange} onValueChange={(value) => setFormData({ ...formData, exchange: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NSE">NSE</SelectItem>
                  <SelectItem value="BSE">BSE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of shares"
                className="col-span-3"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avg-price" className="text-right">
                Avg Price
              </Label>
              <Input
                id="avg-price"
                type="number"
                placeholder="₹ per share"
                className="col-span-3"
                value={formData.average_price}
                onChange={(e) => setFormData({ ...formData, average_price: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last-price" className="text-right">
                Current Price
              </Label>
              <Input
                id="last-price"
                type="number"
                placeholder="₹ per share"
                className="col-span-3"
                value={formData.last_price}
                onChange={(e) => setFormData({ ...formData, last_price: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Stock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


