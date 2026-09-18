import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Dropdown from "./Dropdown";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  setRowsPerPage,
  rowsPerPageOptions = [5, 10, 15, 20, 50, 100],
  totalRows,
}) {
  // if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Enhanced pagination with ellipsis
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always include last page if totalPages > 1
    if (totalPages > 1) {
      range.push(totalPages);
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side - Rows per page and count */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="rowsPerPage"
            className="text-textSecondary text-sm font-medium"
          >
            Show
          </label>
          <div className="min-w-20">
            <Dropdown
              data={rowsPerPageOptions.map((num) => ({
                id: num,
                label: num.toString(),
                value: num,
              }))}
              value={rowsPerPage}
              onSelect={(item) => setRowsPerPage(item.value)}
              placeholder="Rows"
              disabled={false}
            />
          </div>
          <span className="text-textSecondary text-sm font-medium">entries</span>
        </div>

        {/* Count display */}
        <div className="text-textSecondary text-sm">
          Showing <span className="text-text font-medium">{startRow}</span>{" "}
          to <span className="text-text font-medium">{endRow}</span> of{" "}
          <span className="text-text font-medium">{totalRows}</span> results
        </div>
      </div>

      {/* Right side - Pagination controls */}
      <nav className="flex items-center gap-1">
        {/* First page button */}
        <button
          onClick={() => handleClick(1)}
          disabled={currentPage === 1}
          className="border-border bg-surface text-textSecondary hover:border-primary hover:bg-section flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-surface"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page button */}
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-border bg-surface text-textSecondary hover:border-primary hover:bg-section flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-surface"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="text-textMuted flex h-9 w-9 items-center justify-center"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handleClick(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium shadow-sm transition-all ${
                  page === currentPage
                    ? "border-primary bg-primary text-onPrimary hover:bg-secondary"
                    : "border-border bg-surface text-text hover:border-primary hover:bg-section cursor-pointer"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next page button */}
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-border bg-surface text-textSecondary hover:border-primary hover:bg-section flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-surface"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => handleClick(totalPages)}
          disabled={currentPage === totalPages}
          className="border-border bg-surface text-textSecondary hover:border-primary hover:bg-section flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-surface"
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
