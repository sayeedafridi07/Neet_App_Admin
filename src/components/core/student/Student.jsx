import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useState } from "react";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  deleteStudent,
  getStudents,
  resetStudentDevice,
  toggleStudentStatus,
} from "../../../services/operations/studentAPI";
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
  "Phone",
  "Target Year",
  "School",
  "City",
  "Profile Completed",
  "Device ID",
  "Created At",
  "Updated At",
  "Status",
  "Action",
];

function Student() {
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
    queryKey: ["students", query],
    queryFn: () => getStudents(query),
  });
  const { users: students = [], pagination = {} } = response?.data || {};
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

  const { mutate: deleteStudentMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      toast.success("Student deleted successfully");
      closeDeleteModal();
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete student");
    },
  });

  const { mutate: resetStudentDeviceMutation } = useMutation({
    mutationFn: resetStudentDevice,
    onSuccess: () => {
      toast.success("Device reset successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not reset device");
    },
  });

  const { mutate: toggleStudentStatusMutation } = useMutation({
    mutationFn: toggleStudentStatus,
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  const handleDeleteUser = () => {
    if (!selectedItem) return;
    deleteStudentMutation(selectedItem.id);
  };

  const handleResetDevice = (item) => {
    resetStudentDeviceMutation(item.id);
  };

  const handleToggleStatus = async (item) => {
    toggleStudentStatusMutation(item.id, {
      isActive: !item.isActive,
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Student Management
        </h1>
        <CustomButton
          title="Add Student"
          iconName="Plus"
          onClick={() => navigate(`manage-student`)}
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
      ) : students.length > 0 ? (
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
              {students.map((student, index) => (
                <TR key={index}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm font-medium">
                    {student.name}
                  </TD>
                  <TD className="text-text text-sm">{student.phone}</TD>
                  <TD className="text-text text-sm">
                    {student.targetYear || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {student.schoolName || "-"}
                  </TD>
                  <TD className="text-text text-sm">{student.city || "-"}</TD>
                  <TD className="text-text text-sm">
                    {student.profileComplete ? "Yes" : "No"}
                  </TD>
                  <TD className="text-text text-sm">
                    {student.deviceId || "-"}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(student.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(student.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      label=""
                      name={`status-${student.id}`}
                      checked={student.isActive}
                      onChange={() => handleToggleStatus(student)}
                    />
                  </TD>
                  <TD>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`manage-student`, { state: student })
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
                          onClick={() => openDeleteModal(student)}
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

                      <button
                        onClick={() => handleResetDevice(student)}
                        className={`${student.deviceId ? "cursor-pointer" : "cursor-not-allowed"} group rounded-full p-2 transition hover:bg-amber-50`}
                        title="Reset Device ID"
                        disabled={!student.deviceId}
                      >
                        <Icon
                          name="BadgeX"
                          size={20}
                          className="text-text group-hover:text-amber-500"
                        />
                      </button>
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
              description="No students match your search query. Try different keywords."
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
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Students Found
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                There are no students registered in the system yet.
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
        title={`Delete Student${selectedItem?.name ? `: ${selectedItem.name}` : ""}`}
      >
        "Are you sure you want to delete this student? This action cannot be
        undone."
      </DeleteModal>
    </div>
  );
}

export default Student;
