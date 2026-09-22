"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

interface TransactionTableProps {
  transactions: any[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    field: "date" | "amount" | "category";
    direction: "asc" | "desc";
  }>({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = (typeof a.amount === "number" ? a.amount : parseFloat(a.amount)) -
                     (typeof b.amount === "number" ? b.amount : parseFloat(b.amount));
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE));

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field: "date" | "amount" | "category") => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    await deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {deleteLoading && (
        <div className="mt-2">
          <BarLoader width="100%" color="#8b5cf6" />
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-background/80 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] bg-background/80 rounded-xl">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] bg-background/80 rounded-xl">
              <SelectValue placeholder="All Frequency" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">One-time Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="rounded-xl font-semibold gap-1.5"
            >
              <Trash className="h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
              className="rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-2xl border border-border/80 overflow-hidden shadow-lg shadow-purple-950/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer font-bold"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-primary" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead
                className="cursor-pointer font-bold"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-primary" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right font-bold"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4 text-primary" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => {
                const amt = typeof transaction.amount === "number" ? transaction.amount : parseFloat(transaction.amount || "0");
                return (
                  <TableRow key={transaction.id} className="hover:bg-primary/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(transaction.id)}
                        onCheckedChange={() => handleSelect(transaction.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.date), "PP")}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground capitalize">
                      {transaction.description || "Untitled"}
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          backgroundColor: categoryColors[transaction.category] || "#8b5cf6",
                        }}
                        className="px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-xs capitalize"
                      >
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-extrabold text-sm",
                        transaction.type === "EXPENSE"
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}₹
                      {amt.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {transaction.isRecurring ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                variant="secondary"
                                className="gap-1 bg-violet-500/15 text-violet-700 dark:text-violet-300 font-semibold"
                              >
                                <RefreshCw className="h-3 w-3" />
                                {RECURRING_INTERVALS[transaction.recurringInterval] || "Recurring"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <div className="font-semibold">Next Date:</div>
                                <div>
                                  {transaction.nextRecurringDate
                                    ? format(new Date(transaction.nextRecurringDate), "PPP")
                                    : "N/A"}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          One-time
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/transaction/create?edit=${transaction.id}`
                              )
                            }
                          >
                            Edit Transaction
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive font-medium"
                            onClick={() => deleteFn([transaction.id])}
                          >
                            Delete Transaction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Showing {paginatedTransactions.length} of {filteredAndSortedTransactions.length} items
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold text-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
