import { ClipboardCheck, Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../common/CustomButton";
import DeleteModal from "../../common/DeleteModal";
import FilterTabs from "../../common/FilterTabs";
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
import { usePermissions } from "../../../hooks/usePermissions";
import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  updateQuiz,
  updateQuizStatus,
} from "../../../services/operations/quizAPI";
import { getPrograms } from "../../../services/operations/programAPI";
import ManageQuizModal from "../course/quiz/ManageQuizModal";

function TestSeries() {
  const TEST_SERIES_TABLE_HEADERS = [
    "SNO",
    "Title",
    "Description",
    "Program",
    "Question",
    "Created At",
    "Updated At",
    "Status",
  ];

  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { programs } = useSelector((state) => state.program);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    quizType: "series",
    programId: "",
  });

  const programFilterOptions = useMemo(
    () => [
      { label: "All", value: "" },
      ...(programs || []).map((program) => ({
        label: program.name,
        value: program._id,
      })),
    ],
    [programs],
  );

  const fetchTestSeries = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    const params = { ...query };
    if (!params.programId) {
      delete params.programId;
    }

    try {
      const response = await getQuiz(token, params);
      setTestSeries(response?.data?.quizzes || []);
      setPagination(response?.data?.pagination || {});
    } catch (error) {
      console.error("Failed to fetch test series:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestSeries();
  }, [query]);

  useEffect(() => {
    dispatch(getPrograms(token, { page: 1, limit: 1000, search: "" }, false));
  }, [dispatch, token]);

  // ─── Search ───────────────────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    setQuery((prev) => ({ ...prev, page: 1, search: e.target.value }));
  };

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

  const handleProgramFilterChange = (programId) => {
    setQuery((prev) => ({ ...prev, page: 1, programId }));
  };

  // ─── Modal ────────────────────────────────────────────────────────────────
  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowQuizModal(true);
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setShowQuizModal(false);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    let success = false;
    if (selectedItem) {
      const response = await updateQuiz(token, selectedItem._id, data);
      if (response) {
        success = true;
      }
    } else {
      const payload = { ...data, quizType: "series" };
      const response = await createQuiz(token, payload);
      if (response) {
        success = true;
      }
    }

    if (success) {
      await fetchTestSeries();
      closeEditModal();
    }
    setLoading(false);
    return success;
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

  const handleDeleteTestSeries = async () => {
    setLoading(true);
    const response = await deleteQuiz(token, selectedItem._id);
    if (response) {
      await fetchTestSeries();
    }
    closeDeleteModal();
    setLoading(false);
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item.isActive;
    const body = {
      isActive: newStatus,
    };
    const response = await updateQuizStatus(token, item._id, body);
    if (response) {
      await fetchTestSeries(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Test Series Management
        </h1>
        {isSuperAdmin && (
          <CustomButton
            title="Add Test Series"
            iconName="Plus"
            onClick={() => {
              setSelectedItem(null);
              setShowQuizModal(true);
            }}
          />
        )}
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Search by title or description..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !loading ? pagination.total : null}
          className="w-full lg:max-w-xl"
        />

        <div className="w-full lg:w-auto">
          <FilterTabs
            options={programFilterOptions}
            selectedFilter={query.programId}
            onFilterChange={handleProgramFilterChange}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Table>
          <THead>
            <TR>
              {TEST_SERIES_TABLE_HEADERS.map((header) => (
                <TH key={header}>{header}</TH>
              ))}
              {isSuperAdmin && <TH>Action</TH>}
            </TR>
          </THead>
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={isSuperAdmin ? 9 : 8} />
              ))}
          </TBody>
        </Table>
      ) : testSeries?.length > 0 ? (
        <>
          <Table>
            <THead>
              <TR>
                {TEST_SERIES_TABLE_HEADERS.map((header) => (
                  <TH key={header}>{header}</TH>
                ))}
                {isSuperAdmin && <TH>Action</TH>}
              </TR>
            </THead>
            <TBody>
              {testSeries.map((testSeries, index) => (
                <TR key={index}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(query.page - 1) * query.limit + index + 1}</TD>
                  <TD className="text-sm font-medium text-gray-900">
                    {testSeries.title}
                  </TD>
                  <TD>
                    <div className="max-w-xs text-sm whitespace-pre-wrap text-gray-600 md:max-w-md">
                      {testSeries.description || "-"}
                    </div>
                  </TD>
                  <TD>
                    <div
                      className={`border-primary bg-primary rounded-full border p-2 text-center text-xs text-white`}
                    >
                      {testSeries.programId?.name || "-"}
                    </div>
                  </TD>
                  <TD>
                    <button
                      onClick={() =>
                        navigate(`${testSeries._id}`, {
                          state: testSeries,
                        })
                      }
                      className={`${testSeries.totalQuestions > 0 ? "border-primary text-primary hover:bg-primary" : "border-secondary text-secondary hover:bg-secondary"} flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition duration-200 hover:text-white`}
                    >
                      {testSeries.totalQuestions > 0
                        ? "View Questions"
                        : "Add Questions"}
                    </button>
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(testSeries.createdAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(testSeries.updatedAt).format(
                      "DD MMM YYYY, hh:mm A",
                    )}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      label=""
                      name={`status-${testSeries._id}`}
                      checked={testSeries.isActive}
                      onChange={() => handleToggleStatus(testSeries)}
                    />
                  </TD>
                  {isSuperAdmin && (
                    <TD>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(testSeries)}
                          className="hover:text-primary cursor-pointer rounded-full p-2 text-gray-600 transition hover:bg-sky-50"
                          title="Edit"
                        >
                          <Icon name="Pencil" size={20} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(testSeries)}
                          className="cursor-pointer rounded-full p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Icon name="Trash" size={20} />
                        </button>
                      </div>
                    </TD>
                  )}
                </TR>
              ))}
            </TBody>
          </Table>

          {/* Pagination */}
          {(pagination.totalPages > 1 || pagination.total > 0) && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                setRowsPerPage={handleLimitChange}
                totalRows={pagination.total}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
          {query.search ? (
            <EmptyRow
              columns={isSuperAdmin ? 9 : 8}
              icon={Search}
              title="No matching results found"
              description="No test series match your search query. Try different keywords."
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
              <ClipboardCheck className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-lg font-medium text-gray-800 sm:text-xl">
                No Test Series Found
              </h3>
              <p className="mt-2 max-w-md px-4 text-sm text-gray-500 sm:px-0 sm:text-base">
                There are no test series registered in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteTestSeries}
        loading={loading}
        title={`Delete Test Series${selectedItem ? `: ${selectedItem.title}` : ""}`}
      >
        "Are you sure you want to delete this test series? This action cannot be
        undone."
      </DeleteModal>

      {/* Edit / Add Modal */}
      <ManageQuizModal
        isOpen={showQuizModal}
        onClose={closeEditModal}
        data={selectedItem}
        onSubmit={handleSubmit}
        loading={loading}
        requireProgram={true}
        programOptions={programFilterOptions.filter((option) => option.value)}
        title={selectedItem ? "Edit Test Series" : "Add Test Series"}
      />
    </div>
  );
}

export default TestSeries;
