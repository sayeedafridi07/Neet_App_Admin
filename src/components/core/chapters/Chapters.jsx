import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookText, Search } from "lucide-react";
import { useState } from "react";

import moment from "moment";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  createChapter,
  deleteChapter,
  getChapters,
  updateChapter,
} from "../../../services/operations/chapterAPI";
import { getClasses } from "../../../services/operations/classAPI";
import { getSubjects } from "../../../services/operations/subjectAPI";
import CustomButton from "../../common/CustomButton";
import DeleteModal from "../../common/DeleteModal";
import Dropdown from "../../common/Dropdown";
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
import ManageChapterModal from "./ManageChapterModal";

const tableColumns = [
  "SNO",
  "Name",
  "Slug",
  "Created At",
  "Updated At",
  "Content",
  "Action",
];

// Sentinel filter value meaning "don't filter on this field"
const ALL = "all";

// Large limit so the filter dropdowns list every option on one page
const OPTIONS_QUERY = { page: 1, limit: 100 };

const toOptions = (items = []) => [
  { id: ALL, value: ALL, label: "All" },
  ...items.map((item) => ({ id: item.id, value: item.id, label: item.name })),
];

function Chapters() {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters live in the URL so they survive refresh and can be shared
  const [searchParams, setSearchParams] = useSearchParams();
  const classId = searchParams.get("classId") || ALL;
  const subjectId = searchParams.get("subjectId") || ALL;

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data: classesResponse, isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes", OPTIONS_QUERY],
    queryFn: () => getClasses(OPTIONS_QUERY),
  });
  const { data: subjectsResponse, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["subjects", OPTIONS_QUERY],
    queryFn: () => getSubjects(OPTIONS_QUERY),
  });
  const classOptions = toOptions(classesResponse?.data?.classes);
  const subjectOptions = toOptions(subjectsResponse?.data?.subjects);

  const { data: response, isLoading } = useQuery({
    queryKey: ["chapters", query, classId, subjectId],
    queryFn: () =>
      getChapters({
        ...query,
        classId: classId === ALL ? undefined : classId,
        subjectId: subjectId === ALL ? undefined : subjectId,
      }),
  });
  const { chapters = [], pagination = {} } = response?.data || {};
  const { total = 0, page = 1, limit = 10, totalPages = 0 } = pagination;

  const clearSearch = () => {
    setQuery((prev) => ({ ...prev, page: 1, search: "" }));
  };

  // "All" removes the param instead of storing a sentinel in the URL
  const handleFilterChange = (name) => (item) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (!item?.value || item.value === ALL) params.delete(name);
      else params.set(name, item.value);
      return params;
    });
    setQuery((prev) => ({ ...prev, page: 1 }));
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

  const { mutateAsync: saveChapterMutation, isPending: isSaving } = useMutation(
    {
      mutationFn: ({ id, body }) =>
        id ? updateChapter(id, body) : createChapter(body),
      onSuccess: (_, { id }) => {
        toast.success(
          id ? "Chapter updated successfully" : "Chapter added successfully",
        );
        queryClient.invalidateQueries({ queryKey: ["chapters"] });
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Could not save chapter");
      },
    },
  );

  // Returns true on success so the modal knows to close itself
  const handleSaveChapter = async (body) => {
    try {
      await saveChapterMutation({ id: selectedItem?.id, body });
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

  const { mutate: deleteChapterMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteChapter,
    onSuccess: () => {
      toast.success("Chapter deleted successfully");
      closeDeleteModal();
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete chapter");
    },
  });

  const handleDeleteChapter = () => {
    if (!selectedItem) return;
    deleteChapterMutation(selectedItem.id);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
            Chapters
          </h1>
        </div>
        <CustomButton
          title="Add Chapter"
          iconName="Plus"
          onClick={() => openManageModal()}
        />
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Search by name or slug..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !isLoading ? total : null}
          className="w-full lg:max-w-xl"
        />
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
          <Dropdown
            data={classOptions}
            searchable
            value={classId}
            loading={isClassesLoading}
            onSelect={handleFilterChange("classId")}
          />
          <Dropdown
            data={subjectOptions}
            searchable
            value={subjectId}
            loading={isSubjectsLoading}
            onSelect={handleFilterChange("subjectId")}
          />
        </div>
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
      ) : chapters.length > 0 ? (
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
              {chapters.map((chapter, index) => (
                <TR key={chapter.id}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm font-medium">
                    {chapter.name}
                  </TD>
                  <TD className="text-text text-sm">{chapter.slug}</TD>
                  <TD className="text-text text-sm">
                    {moment(chapter.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(chapter.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <CustomButton
                      title="Open Chapter"
                      onClick={() =>
                        navigate(`/dashboard/chapters/${chapter.slug}`)
                      }
                      className="py-1.5! text-sm! whitespace-nowrap"
                    />
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openManageModal(chapter)}
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
                          onClick={() => openDeleteModal(chapter)}
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
              description="No chapters match your search query. Try different keywords."
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
              <BookText className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Chapters Found
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                There are no chapters added in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ManageChapterModal
        isOpen={showManageModal}
        onClose={closeManageModal}
        data={selectedItem}
        loading={isSaving}
        onSubmit={handleSaveChapter}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteChapter}
        loading={isDeleting}
        title={`Delete Chapter${selectedItem?.name ? `: ${selectedItem.name}` : ""}`}
      >
        Are you sure you want to delete this chapter? This action cannot be
        undone.
      </DeleteModal>
    </div>
  );
}

export default Chapters;
