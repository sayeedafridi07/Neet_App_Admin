import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useState } from "react";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  deleteAdmin,
  getAdmins,
  toggleAdminStatus,
} from "../../../services/operations/adminAPI";
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
import toast from "react-hot-toast";

const tableColumns = [
  "SNO",
  "Name",
  "Email",
  "Created At",
  "Updated At",
  "Status",
  "Action",
];

function Admin() {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["admins", query],
    queryFn: () => getAdmins(query),
  });
  const { users: admins = [], pagination = {} } = response?.data || {};
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

  // ─── Delete ───────────────────────────────────────────────────────────────
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setShowDeleteModal(false);
  };

  const { mutate: deleteAdminMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      closeDeleteModal();
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete admin");
    },
  });

  const { mutate: toggleAdminStatusMutation } = useMutation({
    mutationFn: toggleAdminStatus,
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  const handleDeleteUser = () => {
    if (!selectedItem) return;
    deleteAdminMutation(selectedItem.id);
  };

  const handleToggleStatus = async (item) => {
    toggleAdminStatusMutation(item.id, {
      isActive: !item.isActive,
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Admin Management
        </h1>
        <CustomButton
          title="Add Admin"
          iconName="Plus"
          onClick={() => navigate(`manage-admin`)}
        />
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Search by name, phone, city and school..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !isLoading ? total : null}
          className="w-full lg:max-w-xl"
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
      ) : admins.length > 0 ? (
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
              {admins.map((admin, index) => (
                <TR key={index}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm font-medium">
                    {admin.name}
                  </TD>
                  <TD className="text-text text-sm">
                    {admin.email}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(admin.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(admin.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      label=""
                      name={`status-${admin.id}`}
                      checked={admin.isActive}
                      onChange={() => handleToggleStatus(admin)}
                    />
                  </TD>
                  <TD>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`manage-admin`, { state: admin })
                        }
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
                          onClick={() => openDeleteModal(admin)}
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
              description="No admins match your search query. Try different keywords."
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
              <Users className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-lg font-medium text-text sm:text-xl">
                No Admins Found
              </h3>
              <p className="mt-2 max-w-md px-4 text-sm text-textSecondary sm:px-0 sm:text-base">
                There are no admins registered in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteUser}
        loading={isDeleting}
        title={`Delete Admin${selectedItem?.name ? `: ${selectedItem.name}` : ""}`}
      >
        "Are you sure you want to delete this admin? This action cannot be
        undone."
      </DeleteModal>
    </div>
  );
}

export default Admin;
