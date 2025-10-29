"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useFinancialData, type Transaction } from "@/context/financial-data-context"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadStatementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadStatementDialog({ open, onOpenChange }: UploadStatementDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { addTransactions } = useFinancialData()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (isValidFile(droppedFile)) {
        setFile(droppedFile)
      } else {
        toast.error("Please upload a valid file (PDF, CSV, or TXT)")
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (isValidFile(selectedFile)) {
        setFile(selectedFile)
      } else {
        toast.error("Please upload a valid file (PDF, CSV, or TXT)")
      }
    }
  }

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'text/csv',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    return validTypes.includes(file.type) || 
           file.name.endsWith('.csv') || 
           file.name.endsWith('.txt') ||
           file.name.endsWith('.pdf')
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/process-statement", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process statement")
      }

      // Add transactions to context
      const transactions: Transaction[] = data.transactions.map((t: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        ...t
      }))

      addTransactions(transactions)
      
      toast.success(`Successfully imported ${transactions.length} transactions!`)
      
      // Reset and close
      setFile(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to process bank statement")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Bank Statement</DialogTitle>
          <DialogDescription>
            Upload your bank statement to automatically import and categorize transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 dark:border-gray-700"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.csv,.txt,.xls,.xlsx"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {!file ? (
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Drop your bank statement here, or{" "}
                    <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, CSV, TXT files
                  </p>
                </div>
              </label>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">AI-Powered Processing</p>
              <p>
                Our AI will automatically extract transactions, categorize them, and identify payment methods.
                You can review and edit transactions after import.
              </p>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Supported statement formats:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>PDF bank statements</li>
              <li>CSV transaction exports</li>
              <li>Plain text statement files</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Import Transactions
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

