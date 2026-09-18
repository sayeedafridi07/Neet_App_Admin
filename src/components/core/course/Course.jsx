import { BookOpen, Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  getCourses,
  updateCourseStatus,
} from "../../../services/operations/courseAPI";
import { getPrograms } from "../../../services/operations/programAPI";
import CustomButton from "../../common/CustomButton";
import DeleteModal from "../../common/DeleteModal";
import Icon from "../../common/Icon";
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
import ToggleSwitch from "../../common/ToggleSwitch";
import { usePermissions } from "../../../hooks/usePermissions";

function Course() {
  const COURSE_TABLE_HEADERS = [
    "SNO",
    "Title",
    "Description",
    "Program",
    "PDF",
    "Quiz",
    "Created At",
    "Updated At",
    "Status",
  ];

  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { programs } = useSelector((state) => state.program);
  const {
    courses,
    loading,
    pagination: { total, page, limit, totalPages },
  } = useSelector((state) => state.course);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    programId: "",
  });

  useEffect(() => {
    const params = { ...query };
    if (!params.programId) {
      delete params.programId;
    }

    dispatch(getCourses(token, params));
  }, [query]);

  useEffect(() => {
    dispatch(getPrograms(token, { page: 1, limit: 1000, search: "" }, false));
  }, [dispatch, token]);

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

  // ─── Delete ───────────────────────────────────────────────────────────────
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setShowDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    closeDeleteModal();
    dispatch(deleteCourse(token, selectedItem._id, query)); // refresh
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item.isActive;
    const body = {
      isActive: newStatus,
    };
    dispatch(updateCourseStatus(token, item._id, body, query));
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Course Management
        </h1>
        {isSuperAdmin && (
          <CustomButton
            title="Add Course"
            iconName="Plus"
            onClick={() => navigate(`manage-course`)}
          />
        )}
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          placeholder="Search by title or description..."
          onSearch={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, search: value }))
          }
          resultCount={query.search && !loading ? total : null}
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
              {COURSE_TABLE_HEADERS.map((header) => (
                <TH key={header}>{header}</TH>
              ))}
              {isSuperAdmin && <TH>Action</TH>}
            </TR>
          </THead>
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={isSuperAdmin ? 10 : 9} />
              ))}
          </TBody>
        </Table>
      ) : courses?.length > 0 ? (
        <>
          <Table>
            <THead>
              <TR>
                {COURSE_TABLE_HEADERS.map((header) => (
                  <TH key={header}>{header}</TH>
                ))}
                {isSuperAdmin && <TH>Action</TH>}
              </TR>
            </THead>
            <TBody>
              {courses.map((course, index) => (
                <TR key={index}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-sm font-medium text-gray-900">
                    {course.title}
                  </TD>
                  <TD>
                    <div className="max-w-xs text-sm whitespace-pre-wrap text-gray-600 md:max-w-md">
                      {course.description || "-"}
                    </div>
                  </TD>
                  <TD>
                    <div
                      className={`border-primary bg-primary rounded-full border p-2 text-center text-xs text-white`}
                    >
                      {course.programId?.name || "-"}
                    </div>
                  </TD>
                  <TD>
                    <div className="text-sm text-gray-600">
                      {course.pdfUrl ? (
                        <a
                          href={course.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View PDF
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </TD>
                  <TD>
                    <button
                      onClick={() =>
                        navigate(`${course._id}`, {
                          state: course,
                        })
                      }
                      className={`${course.hasQuiz ? "border-primary text-primary hover:bg-primary" : "border-secondary text-secondary hover:bg-secondary"} flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-xs transition duration-200 hover:text-white`}
                    >
                      {/* <Icon
                        name="Album"
                        className="size-4"
                      /> */}
                      {course.hasQuiz ? "View Quiz" : "Add Quiz"}
                    </button>
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(course.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(course.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      label=""
                      name={`status-${course._id}`}
                      checked={course.isActive}
                      onChange={() => handleToggleStatus(course)}
                    />
                  </TD>
                  {isSuperAdmin && (
                    <TD>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`manage-course`, {
                              state: course,
                            })
                          }
                          className="hover:text-primary cursor-pointer rounded-full p-2 text-gray-600 transition hover:bg-sky-50"
                          title="Edit"
                        >
                          <Icon name="Pencil" size={20} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(course)}
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
              columns={isSuperAdmin ? 10 : 9}
              icon={Search}
              title="No matching results found"
              description="No courses match your search query. Try different keywords."
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
              <BookOpen className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-lg font-medium text-gray-800 sm:text-xl">
                No Courses Found
              </h3>
              <p className="mt-2 max-w-md px-4 text-sm text-gray-500 sm:px-0 sm:text-base">
                There are no courses registered in the system yet.
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
        title={`Delete Course${selectedItem ? `: ${selectedItem.title}` : ""}`}
      >
        "Are you sure you want to delete this course? This action cannot be
        undone."
      </DeleteModal>
    </div>
  );
}

export default Course;
