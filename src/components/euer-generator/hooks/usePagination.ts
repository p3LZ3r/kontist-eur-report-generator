import { useMemo, useState } from "react";
import type { Transaction } from "../../../types";
import { PAGINATION } from "../../../utils/constants";

/**
 * usePagination handles pagination logic for transaction lists.
 *
 * @param items - Array of transactions to paginate
 * @returns Pagination state and controls
 *
 * @example
 * const pagination = usePagination(transactions)
 * const currentItems = pagination.currentItems
 */
export function usePagination(items: Transaction[]) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate current page items
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION.TRANSACTIONS_PER_PAGE;
    const end = start + PAGINATION.TRANSACTIONS_PER_PAGE;
    return items.slice(start, end);
  }, [items, currentPage]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(items.length / PAGINATION.TRANSACTIONS_PER_PAGE);
  const indexOfLastItem = currentPage * PAGINATION.TRANSACTIONS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - PAGINATION.TRANSACTIONS_PER_PAGE;

  // Navigation functions
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Reset to first page when items change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage: PAGINATION.TRANSACTIONS_PER_PAGE,
    currentItems,
    indexOfFirstItem,
    indexOfLastItem,
    goToPage,
    nextPage,
    prevPage,
    resetToFirstPage,
  };
}
