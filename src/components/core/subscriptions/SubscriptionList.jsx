import { useQuery } from "@tanstack/react-query";
import { CreditCard, Search } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import { getSubscriptions } from "../../../services/operations/subscriptionAPI";
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
  "Status",
  "Starts At",
  "Expires At",
  "Auto Renew",
  "Created At",
];

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const statusStyles = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-100 text-red-600",
};

const formatDate = (date) =>
  date ? moment(date).format("DD MMM YYYY, hh:mm A") : "-";

function SubscriptionList() {
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
    queryKey: ["subscriptions", params],
    queryFn: () => getSubscriptions(params),
  });
  const { subscriptions = [], pagination = {} } = response?.data || {};
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
      ) : subscriptions.length > 0 ? (
        <>
          <Table>
            {header}
            <TBody>
              {subscriptions.map((sub, index) => (
                <TR key={sub.id}>
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm font-medium">
                    {sub.user?.name || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {sub.user?.phone || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {sub.planSnapshot?.name || "-"}
                  </TD>
                  <TD>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[sub.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {sub.status}
                    </span>
                  </TD>
                  <TD className="text-text text-sm">
                    {formatDate(sub.startsAt)}
                  </TD>
                  <TD className="text-text text-sm">
                    {formatDate(sub.expiresAt)}
                  </TD>
                  <TD className="text-text text-sm">
                    {sub.cancelAtPeriodEnd ? "No" : "Yes"}
                  </TD>
                  <TD className="text-text text-sm">
                    {formatDate(sub.createdAt)}
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
              description="No subscriptions match your filters."
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
              <CreditCard className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Subscriptions Yet
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                Student subscriptions will appear here.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SubscriptionList;
