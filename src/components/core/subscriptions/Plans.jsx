import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Search } from "lucide-react";
import { useState } from "react";

import moment from "moment";
import toast from "react-hot-toast";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  toPaise,
  toRupees,
} from "../../../schemas/subscription.schema";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlans,
  toggleSubscriptionPlanStatus,
  updateSubscriptionPlan,
} from "../../../services/operations/subscriptionAPI";
import CustomButton from "../../common/CustomButton";
import DeleteModal from "../../common/DeleteModal";
import Icon from "../../common/Icon";
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
import ToggleSwitch from "../../common/ToggleSwitch";
import ManagePlanModal from "./ManagePlanModal";

const tableColumns = [
  "SNO",
  "Name",
  "Price",
  "Duration",
  "Order",
  "Status",
  "Created At",
  "Updated At",
  "Action",
];

// API prices are in paise
const formatPrice = (paise, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(toRupees(paise));

const PLANS_QUERY_KEY = ["subscriptionPlans"];

function Plans() {
  const { isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConflict, setDeleteConflict] = useState(false);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: [...PLANS_QUERY_KEY, query],
    queryFn: () => getSubscriptionPlans(query),
  });
  const { plans: subscriptions = [], pagination = {} } = response?.data || {};
  const { total = 0, page = 1, limit = 10, totalPages = 0 } = pagination;

  const clearSearch = () => {
    setQuery((prev) => ({ ...prev, page: 1, search: "" }));
  };

  // ─── Pagination ───────────────────────────────────────────────────────────
  const handlePageChange = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setQuery((prev) => ({ ...prev, page: 1, limit }));
  };

  // ─── Add / Edit ───────────────────────────────────────────────────────────
  const openManageModal = (item = null) => {
    setSelectedItem(item);
    setShowManageModal(true);
  };

  const closeManageModal = () => {
    setSelectedItem(null);
    setShowManageModal(false);
  };

  const { mutateAsync: saveSubscriptionMutation, isPending: isSaving } =
    useMutation({
      mutationFn: ({ id, body }) =>
        id ? updateSubscriptionPlan(id, body) : createSubscriptionPlan(body),
      onSuccess: (_, { id }) => {
        toast.success(
          id
            ? "Plan updated successfully"
            : "Plan added successfully",
        );
        queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || "Could not save plan",
        );
      },
    });

  // Returns true on success so the modal knows to close itself
  const handleSaveSubscription = async (body) => {
    try {
      await saveSubscriptionMutation({
        id: selectedItem?.id,
        body: {
          ...body,
          price: toPaise(body.price),
          originalPrice:
            body.originalPrice === null ? null : toPaise(body.originalPrice),
        },
      });
      return true;
    } catch {
      return false;
    }
  };

  // ─── Status ───────────────────────────────────────────────────────────────
  const {
    mutate: toggleStatusMutation,
    isPending: isTogglingStatus,
    variables: togglingVariables,
  } = useMutation({
    mutationFn: ({ id }) => toggleSubscriptionPlanStatus(id),
    onSuccess: (res) => {
      toast.success(res?.data?.isActive ? "Plan activated" : "Plan deactivated");
      queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  // ─── Delete ───────────────────────────────────────────────────────────────
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setShowDeleteModal(false);
    setDeleteConflict(false);
  };

  const handleDeactivateInstead = () => {
    if (!selectedItem) return;
    toggleStatusMutation({ id: selectedItem.id });
    closeDeleteModal();
  };

  const { mutate: deleteSubscriptionMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteSubscriptionPlan,
      onSuccess: () => {
        toast.success("Plan deleted successfully");
        closeDeleteModal();
        queryClient.invalidateQueries({ queryKey: PLANS_QUERY_KEY });
      },
      onError: (error) => {
        // 409: plan has subscriptions — offer deactivation instead
        if (error?.response?.status === 409) {
          setDeleteConflict(true);
          return;
        }
        toast.error(error?.response?.data?.message || "Could not delete plan");
      },
    });

  const handleDeleteSubscription = () => {
    if (!selectedItem) return;
    deleteSubscriptionMutation(selectedItem.id);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search by plan name..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !isLoading ? total : null}
          className="w-full lg:max-w-xl"
        />
        <CustomButton
          title="Add Plan"
          iconName="Plus"
          onClick={() => openManageModal()}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <Table>
          <THead>
            <TR>
              {tableColumns.map((column, index) => (
                <TH key={index}>{column}</TH>
              ))}
            </TR>
          </THead>
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
            <THead>
              <TR>
                {tableColumns.map((column, index) => (
                  <TH key={index}>{column}</TH>
                ))}
              </TR>
            </THead>
            <TBody>
              {subscriptions.map((subscription, index) => (
                <TR key={subscription.id}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm">
                    <p className="font-medium">{subscription.name}</p>
                    {subscription.description && (
                      <p className="text-textSecondary line-clamp-1 max-w-xs text-xs">
                        {subscription.description}
                      </p>
                    )}
                  </TD>
                  <TD className="text-text text-sm">
                    <p>
                      {formatPrice(subscription.price, subscription.currency)}
                    </p>
                    {subscription.originalPrice != null &&
                      subscription.originalPrice > subscription.price && (
                        <p className="text-textMuted text-xs line-through">
                          {formatPrice(
                            subscription.originalPrice,
                            subscription.currency,
                          )}
                        </p>
                      )}
                  </TD>
                  <TD className="text-text text-sm">
                    {subscription.durationDays} days
                  </TD>
                  <TD className="text-text text-sm">{subscription.order}</TD>
                  <TD>
                    <ToggleSwitch
                      checked={!!subscription.isActive}
                      disabled={
                        isTogglingStatus &&
                        togglingVariables?.id === subscription.id
                      }
                      onChange={() =>
                        toggleStatusMutation({ id: subscription.id })
                      }
                    />
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(subscription.createdAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(subscription.updatedAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openManageModal(subscription)}
                        className="group hover:bg-primary/10 cursor-pointer rounded-full p-2 transition"
                        title="Edit"
                      >
                        <Icon
                          name="Pencil"
                          size={20}
                          className="group-hover:text-primary/80 text-text"
                        />
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => openDeleteModal(subscription)}
                          className="group hover:bg-error/10 cursor-pointer rounded-full p-2 transition"
                          title="Delete"
                        >
                          <Icon
                            name="Trash"
                            size={20}
                            className="text-text group-hover:text-error"
                          />
                        </button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* Pagination */}
          {(totalPages > 1 || total > 0) && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                rowsPerPage={limit}
                setRowsPerPage={handleLimitChange}
                totalRows={total}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
          {query.search ? (
            <EmptyRow
              columns={tableColumns.length}
              icon={Search}
              title="No matching results found"
              description="No plans match your search query. Try different keywords."
              action={
                <button
                  onClick={clearSearch}
                  className="bg-primary hover:bg-opacity-90 cursor-pointer rounded-full px-6 py-2 font-medium text-white transition"
                >
                  Clear Search
                </button>
              }
            />
          ) : (
            <>
              <CreditCard className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Plans Found
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                There are no subscription plans added in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ManagePlanModal
        isOpen={showManageModal}
        onClose={closeManageModal}
        data={selectedItem}
        loading={isSaving}
        onSubmit={handleSaveSubscription}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteSubscription}
        loading={isDeleting}
        title={`Delete Plan${selectedItem?.name ? `: ${selectedItem.name}` : ""}`}
      >
        {deleteConflict ? (
          <div className="space-y-3">
            <p>
              This plan has subscriptions and cannot be deleted. Deactivate it
              instead so students can no longer purchase it.
            </p>
            {selectedItem?.isActive && (
              <button
                onClick={handleDeactivateInstead}
                className="border-primary text-primary hover:bg-primary/10 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition"
              >
                Deactivate Plan
              </button>
            )}
          </div>
        ) : (
          "Are you sure you want to delete this plan? This action cannot be undone."
        )}
      </DeleteModal>
    </div>
  );
}

export default Plans;
