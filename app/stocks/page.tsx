"use client";
import React, { useEffect, useState } from "react";
import { useFinancialData, type Holding } from "@/context/financial-data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddGrowwHoldingDialog } from "@/components/dialogs/add-groww-holding-dialog";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Plus,
  Link as LinkIcon,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export default function StocksPage() {
  const { holdings, deleteHolding, currency } = useFinancialData();
  const [selectedBroker, setSelectedBroker] = useState<"all" | "kite" | "groww">("all");
  const [growwDialogOpen, setGrowwDialogOpen] = useState(false);
  const [groupedHoldings, setGroupedHoldings] = useState<{
    kite: Holding[];
    groww: Holding[];
  }>({ kite: [], groww: [] });

  useEffect(() => {
    const kite = holdings.filter((h) => h.broker === "kite");
    const groww = holdings.filter((h) => h.broker === "groww");
    setGroupedHoldings({ kite, groww });
  }, [holdings]);

  const filteredHoldings = holdings.filter((h) => {
    if (selectedBroker === "all") return true;
    return h.broker === selectedBroker;
  });

  // Calculate portfolio statistics
  const portfolioStats = {
    totalInvested: holdings.reduce((sum, h) => sum + h.quantity * h.average_price, 0),
    totalCurrent: holdings.reduce((sum, h) => sum + h.quantity * h.last_price, 0),
    totalPnl: holdings.reduce((sum, h) => sum + h.pnl, 0),
    totalPnlPercentage: holdings.length > 0
      ? ((holdings.reduce((sum, h) => sum + h.pnl, 0) / holdings.reduce((sum, h) => sum + h.quantity * h.average_price, 0)) * 100)
      : 0,
  };

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  const handleKiteConnect = () => {
    const apiKey = process.env.NEXT_PUBLIC_KITE_API_KEY || "wob4tch3xv9q57yy";
    const redirectUri = `${window.location.origin}/stocks/callback`;
    window.location.href = `https://kite.trade/connect/login?api_key=${apiKey}&redirect_uri=${redirectUri}`;
  };

  const handleGrowwConnect = () => {
    // Note: Groww doesn't have a public API yet
    // For now, redirect to manual entry flow
    toast.info("Groww API is not yet available. Please use the manual entry option below.");
    setGrowwDialogOpen(true);
  };

  if (holdings.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Stock Portfolio
          </h1>
          <p className="text-muted-foreground mb-8">
            Connect your broker accounts or manually add holdings to track your stock portfolio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kite Connection Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <img
                      src="https://kite.zerodha.com/static/images/kite-logo.svg"
                      alt="Kite Logo"
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <CardTitle>Connect Kite (Zerodha)</CardTitle>
                    <CardDescription>Auto-sync your holdings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Zerodha Kite account to automatically import and sync your stock holdings.
                </p>
                <Button onClick={handleKiteConnect} className="w-full">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect Kite Account
                </Button>
              </CardContent>
            </Card>

            {/* Groww Connection Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <img
                      src="https://groww.in/groww-logo-270.png"
                      alt="Groww"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div>
                    <CardTitle>Connect Groww</CardTitle>
                    <CardDescription>Track your investments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Groww account to track your stock portfolio. Manual entry available as fallback.
                </p>
                <Button
                  onClick={handleGrowwConnect}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect Groww Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Manual Entry Option */}
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <CardTitle>Or Add Stocks Manually</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Prefer to add stocks manually? Use this option to enter your holdings one by one.
              </p>
              <Button
                onClick={() => setGrowwDialogOpen(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stock Manually
              </Button>
            </CardContent>
          </Card>
        </div>

        <AddGrowwHoldingDialog open={growwDialogOpen} onOpenChange={setGrowwDialogOpen} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            Stock Portfolio
          </h1>
          <p className="text-muted-foreground">
            Track your investments across multiple brokers
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setGrowwDialogOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Manually
          </Button>
          <Button onClick={handleGrowwConnect} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
            <LinkIcon className="mr-2 h-4 w-4" />
            Groww
          </Button>
          <Button onClick={handleKiteConnect}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Kite
          </Button>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invested</CardDescription>
            <CardTitle className="text-2xl">
              {currencySymbol}{portfolioStats.totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Value</CardDescription>
            <CardTitle className="text-2xl">
              {currencySymbol}{portfolioStats.totalCurrent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total P&L</CardDescription>
            <CardTitle
              className={`text-2xl ${
                portfolioStats.totalPnl >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {portfolioStats.totalPnl >= 0 ? "+" : ""}
              {currencySymbol}{portfolioStats.totalPnl.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              {" "}({portfolioStats.totalPnlPercentage.toFixed(2)}%)
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter and Holdings */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>
                {holdings.length} stock{holdings.length !== 1 ? "s" : ""} across{" "}
                {new Set(holdings.map((h) => h.broker)).size} broker
                {new Set(holdings.map((h) => h.broker)).size !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Select value={selectedBroker} onValueChange={(value: any) => setSelectedBroker(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by broker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brokers</SelectItem>
                <SelectItem value="kite">Kite (Zerodha)</SelectItem>
                <SelectItem value="groww">Groww</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHoldings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No holdings found for the selected broker
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Symbol
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Broker
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Qty
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Avg Price
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      LTP
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Investment
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Current Value
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      P&L
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map((holding) => (
                    <tr key={holding.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">
                        {holding.tradingsymbol}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {holding.exchange}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={holding.broker === "kite" ? "default" : "secondary"}
                        >
                          {holding.broker.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{holding.quantity}</td>
                      <td className="py-3 px-4 text-right">
                        {currencySymbol}{holding.average_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {currencySymbol}{holding.last_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {currencySymbol}{(holding.quantity * holding.average_price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {currencySymbol}{(holding.quantity * holding.last_price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div
                          className={`flex items-center justify-end gap-1 ${
                            holding.pnl >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {holding.pnl >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {holding.pnl >= 0 ? "+" : ""}
                            {currencySymbol}{holding.pnl.toFixed(2)}
                          </span>
                          <span className="text-xs">
                            ({holding.pnl_percentage.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHolding(holding.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddGrowwHoldingDialog open={growwDialogOpen} onOpenChange={setGrowwDialogOpen} />
    </div>
  );
} 
