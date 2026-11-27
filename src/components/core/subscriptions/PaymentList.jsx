import { useQuery } from "@tanstack/react-query";
import { Receipt, Search } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import { getPayments } from "../../../services/operations/subscriptionAPI";
import FilterTabs from "../../common/FilterTabs";
import Pagination from "../../common/Pagination";
import SearchInput from "../../common/SearchInput";
import {
  EmptyRow,
  SkeletonRow,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "../../common/Table";

const tableColumns = [
  "SNO",
  "Student",
  "Phone",
  "Plan",
  "Amount",
  "Status",
  "Provider",
  "Order ID",
  "Payment ID",
  "Failure Reason",
  "Paid At",
  "Created At",
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Success", value: "SUCCESS" },
  { label: "Created", value: "CREATED" },
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Failed", value: "FAILED" },
  { label: "Refunded", value: "REFUNDED" },
];

const statusStyles = {
  SUCCESS: "bg-green-100 text-green-700",
  CREATED: "bg-gray-100 text-gray-500",
  AUTHORIZED: "bg-blue-100 text-blue-700",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-amber-100 text-amber-700",
};

const formatDate = (date) =>
  date ? moment(date).format("DD MMM YYYY, hh:mm A") : "-";

// API amounts are in paise
const formatAmount = (paise = 0, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    paise / 100,
  );

function PaymentList() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  // Drop empty filters so the API's zod schema doesn't reject them
  const params = Object.fromEntries(
    Object.entries(query).filter(([, v]) => v !== ""),
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
  });
  const { payments = [], pagination = {} } = response?.data || {};
  const { total = 0, page = 1, limit = 10, totalPages = 0 } = pagination;

  const isFiltered = query.search || query.status;

  const header = (
    <THead>
      <TR>
        {tableColumns.map((column, index) => (
          <TH key={index}>{column}</TH>
        ))}
      </TR>
    </THead>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Search by student name or phone..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !isLoading ? total : null}
          className="w-full lg:max-w-xl"
        />
        <div className="overflow-x-auto">
          <FilterTabs
            options={statusOptions}
            selectedFilter={query.status}
            onFilterChange={(status) =>
              setQuery((prev) => ({ ...prev, page: 1, status }))
            }
          />
        </div>
      </div>

      {isLoading ? (
        <Table>
          {header}
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={tableColumns.length} />
              ))}
          </TBody>
        </Table>
      ) : payments.length > 0 ? (
        <>
          <Table>
            {header}
            <TBody>
              {payments.map((payment, index) => (
                <TR key={payment.id}>
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm font-medium">
                    {payment.user?.name || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {payment.user?.phone || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {payment.subscription?.planSnapshot?.name || "-"}
                  </TD>
                  <TD className="text-text text-sm font-medium">
                    {formatAmount(payment.amount, payment.currency)}
                  </TD>
                  <TD>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[payment.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {payment.status}
                    </span>
                  </TD>
                  <TD className="text-text text-sm">
                    {payment.provider || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {payment.providerOrderId || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {payment.providerPaymentId || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {payment.failureReason || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {formatDate(payment.paidAt)}
                  </TD>
                  <TD className="text-text text-sm">
                    {formatDate(payment.createdAt)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {total > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(page) => setQuery((prev) => ({ ...prev, page }))}
                rowsPerPage={limit}
                setRowsPerPage={(limit) =>
                  setQuery((prev) => ({ ...prev, page: 1, limit }))
                }
                totalRows={total}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
          {isFiltered ? (
            <EmptyRow
              columns={tableColumns.length}
              icon={Search}
              title="No matching results found"
              description="No payments match your filters."
              action={
                <button
                  onClick={() =>
                    setQuery((prev) => ({
                      ...prev,
                      page: 1,
                      search: "",
                      status: "",
                    }))
                  }
                  className="bg-primary hover:bg-opacity-90 cursor-pointer rounded-full px-6 py-2 font-medium text-white transition"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <Receipt className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Payments Yet
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                Payment transactions will appear here.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentList;
