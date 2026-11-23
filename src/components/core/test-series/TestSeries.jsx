import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotebookPen, Search } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  createTestSeriesQuiz,
  deleteChapterQuiz,
  getTestSeriesQuizzes,
  updateChapterQuiz,
} from "../../../services/operations/chapterQuizAPI";
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
import ManageQuizModal from "../chapters/quizzes/ManageQuizModal";
import { TEST_SERIES_QUERY_KEY } from "./constants";

const tableColumns = [
  "SNO",
  "Title",
  "Questions",
  "Duration",
  "Marking (+/-/0)",
  "Status",
  "Created At",
  "Updated At",
  "Action",
];

const formatMarks = (n) => (n > 0 ? `+${n}` : `${n}`);

function TestSeries() {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });

  const { data: response, isLoading } = useQuery({
    queryKey: [...TEST_SERIES_QUERY_KEY, query],
    queryFn: () => getTestSeriesQuizzes(query),
  });
  const { quizzes = [], pagination = {} } = response?.data || {};
  const { total = 0, page = 1, limit = 10, totalPages = 0 } = pagination;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: TEST_SERIES_QUERY_KEY });

  // ─── Add / Edit ───────────────────────────────────────────────────────────
  const openManageModal = (item = null) => {
    setSelectedItem(item);
    setShowManageModal(true);
  };

  const closeManageModal = () => {
    setSelectedItem(null);
    setShowManageModal(false);
  };

  const { mutateAsync: saveQuiz, isPending: isSaving } = useMutation({
    mutationFn: ({ id, body }) =>
      id ? updateChapterQuiz(id, body) : createTestSeriesQuiz(body),
    onSuccess: (_, { id }) => {
      toast.success(
        id
          ? "Test series updated successfully"
          : "Test series created successfully",
      );
      invalidate();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Could not save test series",
      );
    },
  });

  // Returns true on success so the modal knows to close itself
  const handleSave = async (body) => {
    try {
      await saveQuiz({ id: selectedItem?.id, body });
      return true;
    } catch {
      return false;
    }
  };

  // ─── Status ───────────────────────────────────────────────────────────────
  const {
    mutate: toggleStatus,
    isPending: isTogglingStatus,
    variables: togglingVariables,
  } = useMutation({
    mutationFn: ({ id, isActive }) => updateChapterQuiz(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      toast.success(
        isActive ? "Test series activated" : "Test series deactivated",
      );
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  // ─── Delete ───────────────────────────────────────────────────────────────
  const { mutate: removeQuiz, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteChapterQuiz(id),
    onSuccess: () => {
      toast.success("Test series deleted successfully");
      setDeletingItem(null);
      invalidate();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Could not delete test series",
      );
    },
  });

  const tableHead = (
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
      <h1 className="font-roboto text-text mb-6 text-xl font-semibold md:text-3xl">
        Test Series
      </h1>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search by title..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !isLoading ? total : null}
          className="w-full lg:max-w-xl"
        />
        <CustomButton
          title="Add Test Series"
          iconName="Plus"
          onClick={() => openManageModal()}
          className="min-w-fit"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <Table>
          {tableHead}
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={tableColumns.length} />
              ))}
          </TBody>
        </Table>
      ) : quizzes.length > 0 ? (
        <>
          <Table>
            {tableHead}
            <TBody>
              {quizzes.map((quiz, index) => (
                <TR key={quiz.id}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-text text-sm">
                    <p className="font-medium">{quiz.title}</p>
                    {quiz.description && (
                      <p className="text-textSecondary line-clamp-1 max-w-xs text-xs">
                        {quiz.description}
                      </p>
                    )}
                  </TD>
                  <TD className="text-text text-sm">
                    {quiz.questionCount ?? 0}
                  </TD>
                  <TD className="text-text text-sm">
                    {quiz.durationMinutes
                      ? `${quiz.durationMinutes} min`
                      : "No limit"}
                  </TD>
                  <TD className="text-text text-sm">
                    {formatMarks(quiz.correctMarks ?? 4)} /{" "}
                    {formatMarks(quiz.wrongMarks ?? -1)} /{" "}
                    {quiz.skippedMarks ?? 0}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      checked={!!quiz.isActive}
                      disabled={
                        isTogglingStatus && togglingVariables?.id === quiz.id
                      }
                      onChange={() =>
                        toggleStatus({ id: quiz.id, isActive: !quiz.isActive })
                      }
                    />
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(quiz.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-text text-sm">
                    {moment(quiz.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/test-series/${quiz.id}`)
                        }
                        className="group hover:bg-primary/10 cursor-pointer rounded-full p-2 transition"
                        title="View Details & Questions"
                      >
                        <Icon
                          name="Eye"
                          size={20}
                          className="group-hover:text-primary/80 text-text"
                        />
                      </button>
                      <button
                        onClick={() => openManageModal(quiz)}
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
                          onClick={() => setDeletingItem(quiz)}
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

          {(totalPages > 1 || total > 0) && (
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
          {query.search ? (
            <EmptyRow
              columns={tableColumns.length}
              icon={Search}
              title="No matching results found"
              description="No test series match your search query. Try different keywords."
              action={
                <button
                  onClick={() =>
                    setQuery((prev) => ({ ...prev, page: 1, search: "" }))
                  }
                  className="bg-primary hover:bg-opacity-90 cursor-pointer rounded-full px-6 py-2 font-medium text-white transition"
                >
                  Clear Search
                </button>
              }
            />
          ) : (
            <>
              <NotebookPen className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Test Series Found
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                Create a test series, then add or import its questions.
              </p>
            </>
          )}
        </div>
      )}

      <ManageQuizModal
        isOpen={showManageModal}
        onClose={closeManageModal}
        type="TEST_SERIES"
        quiz={selectedItem}
        loading={isSaving}
        onSubmit={handleSave}
      />

      <DeleteModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onDelete={() => deletingItem && removeQuiz(deletingItem.id)}
        loading={isDeleting}
        title={`Delete Test Series: ${deletingItem?.title ?? ""}`}
      >
        This will permanently delete the test series and all its questions.
        This action cannot be undone.
      </DeleteModal>
    </div>
  );
}

export default TestSeries;
