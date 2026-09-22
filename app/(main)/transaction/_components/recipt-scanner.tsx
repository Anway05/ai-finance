"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

interface ReceiptScannerProps {
  onScanComplete: (scannedData: any) => void;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    await scanReceiptFn(file);
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully!");
    }
  }, [scanReceiptLoading, scannedData, onScanComplete]);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl border-none shadow-md shadow-violet-500/20 gap-2 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        disabled={Boolean(scanReceiptLoading)}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
            <span>Parsing Receipt with Gemini AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
            <Camera className="h-4 w-4" />
            <span>Scan Receipt with Gemini AI</span>
          </>
        )}
      </Button>
    </div>
  );
}
