import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";

import moment from "moment";
import toast from "react-hot-toast";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../../../services/operations/subjectAPI";
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
import ManageSubjectModal from "./ManageSubjectModal";

const tableColumns = [
  "SNO",
  "Name",
  "Slug",
  "Created At",
  "Updated At",
  "Action",
];

function Subjects() {
  const { isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["subjects", query],
    queryFn: () => getSubjects(query),
  });
  const { subjects = [], pagination = {} } = response?.data || {};
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

  const { mutateAsync: saveSubjectMutation, isPending: isSaving } = useMutation(
    {
      mutationFn: ({ id, body }) =>
        id ? updateSubject(id, body) : createSubject(body),
      onSuccess: (_, { id }) => {
        toast.success(
          id ? "Subject updated successfully" : "Subject added successfully",
        );
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Could not save subject");
      },
    },
  );

  // Returns true on success so the modal knows to close itself
  const handleSaveSubject = async (body) => {
    try {
      await saveSubjectMutation({ id: selectedItem?.id, body });
      return true;
    } catch {
      return false;
    }
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

  const { mutate: deleteSubjectMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      toast.success("Subject deleted successfully");
      closeDeleteModal();
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete subject");
    },
  });

  const handleDeleteSubject = () => {
    if (!selectedItem) return;
    deleteSubjectMutation(selectedItem.id);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Subjects
        </h1>
        <CustomButton
          title="Add Subject"
          iconName="Plus"
          onClick={() => openManageModal()}
        />
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Search by name or slug..."
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
      ) : subjects.length > 0 ? (
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
              {subjects.map((subject, index) => (
                <TR key={subject.id}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm font-medium">
                    {subject.name}
                  </TD>
                  <TD className="text-text text-sm">{subject.slug}</TD>
                  <TD className="text-text text-sm">
                    {moment(subject.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(subject.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openManageModal(subject)}
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
                          onClick={() => openDeleteModal(subject)}
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
              description="No subjects match your search query. Try different keywords."
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
              <BookOpen className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Subjects Found
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                There are no subjects added in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ManageSubjectModal
        isOpen={showManageModal}
        onClose={closeManageModal}
        data={selectedItem}
        loading={isSaving}
        onSubmit={handleSaveSubject}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteSubject}
        loading={isDeleting}
        title={`Delete Subject${selectedItem?.name ? `: ${selectedItem.name}` : ""}`}
      >
        Are you sure you want to delete this subject? This action cannot be
        undone.
      </DeleteModal>
    </div>
  );
}

export default Subjects;
