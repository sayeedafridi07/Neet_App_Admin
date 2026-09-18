import { Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  getCourses,
  updateCourseStatus,
} from "../../../../services/operations/courseAPI";
import CustomButton from "../../../common/CustomButton";
import DeleteModal from "../../../common/DeleteModal";
import Icon from "../../../common/Icon";
import Pagination from "../../../common/Pagination";
import SearchInput from "../../../common/SearchInput";
import {
  EmptyRow,
  SkeletonRow,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "../../../common/Table";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { usePermissions } from "../../../../hooks/usePermissions";
import {
  bulkDeleteQuestions,
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
  uploadQuestion,
} from "../../../../services/operations/quizAPI";
import { Check, Circle, CheckCircle2, Square } from "lucide-react";
import ManageQuestionModal from "./ManageQuestionModal";
import Checkbox from "../../../common/CheckBox";
import UploadQuestionModal from "./UploadQuestionModal";

function QuizList({ quizId }) {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    questions,
    loading,
    isSubmitting,
    isFetched,
    pagination: { total, page, limit, totalPages },
  } = useSelector((state) => state.quiz);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const isAllSelected =
    questions.length > 0 &&
    questions.every((item) => selectedItems.includes(item._id));

  const isIndeterminate = selectedItems.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(questions.map((item) => item._id));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    quizId: quizId,
  });

  const fetchQuiz = () => {
    dispatch(getQuestions(token, query));
  };

  useEffect(() => {
    fetchQuiz();
  }, [query]);

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

  // ─── Delete ───────────────────────────────────────────────────────────────
  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedItem(null);
    setShowDeleteModal(false);
  };

  const handleSubmit = async (data) => {
    const formData = new FormData();
    formData.append("quizId", quizId);
    
    if (data.questionText) formData.append("questionText", data.questionText);
    if (data.type) formData.append("type", data.type);
    if (data.explanation) formData.append("explanation", data.explanation);
    if (data.correctAnswers) formData.append("correctAnswers", JSON.stringify(data.correctAnswers));

    const optionsText = data.options.map((opt) => ({
      text: opt.text,
      ...(opt._id ? { _id: opt._id } : {})
    }));
    formData.append("options", JSON.stringify(optionsText));

    if (data.questionImage && data.questionImage instanceof File) {
      formData.append("questionImage", data.questionImage);
    }

    data.options.forEach((opt, idx) => {
      if (opt.image && opt.image instanceof File) {
        formData.append(`optionImage_${idx}`, opt.image);
      }
    });

    if (editData) {
      return await dispatch(updateQuestion(token, editData._id, formData, query));
    }
    
    return await dispatch(createQuestion(token, formData, query));
  };

  const handleUploadQuestions = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("quizId", quizId);

    return await dispatch(uploadQuestion(token, formData, query));
  };

  const handleDelete = async () => {
    const success = await dispatch(
      deleteQuestion(token, selectedItem._id, query),
    );
    if (success) {
      closeDeleteModal();
    }
  };

  const handleBulkDelete = async () => {
    await dispatch(bulkDeleteQuestions(token, { ids: selectedItems }, query));
    setSelectedItems([]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mt-6 flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold">
          Questions
        </h1>

        <div className="flex items-center space-x-4">
          {selectedItems.length > 0 ? (
            <CustomButton
              onClick={handleBulkDelete}
              title="Bulk Delete"
              iconName="Trash2"
              className="!bg-red-500"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          ) : null}
          {isSuperAdmin && (
            <>
              <CustomButton
                title="Upload Questions"
                iconName="CloudUpload"
                onClick={() => setShowUploadModal(true)}
                className="!text-primary border-primary border bg-transparent"
              />
              <CustomButton
                title="Add Question"
                iconName="Plus"
                onClick={() => setShowQuestionModal(true)}
              />
            </>
          )}
        </div>
      </div>

      <SearchInput
        placeholder="Search by question or explanation."
        onSearch={(value) =>
          setQuery((prev) => ({ ...prev, page: 1, search: value }))
        }
        resultCount={query.search && !loading ? total : null}
        className="mb-6"
      />

      {/* Table */}
      {loading ? (
        <Table>
          <THead>
            <TR>
              <TH>
                <Checkbox checked={false} disabled />
              </TH>
              <TH>SNO</TH>
              <TH>Question</TH>
              <TH>Type</TH>
              <TH>Created At</TH>
              <TH>Updated At</TH>
              {isSuperAdmin && <TH>Action</TH>}
            </TR>
          </THead>
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={4} />
              ))}
          </TBody>
        </Table>
      ) : questions?.length > 0 ? (
        <>
          <Table>
            <THead>
              <TR>
                <TH>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="focus:outline-none"
                    aria-label="Select all"
                  >
                    <Checkbox
                      checked={isAllSelected}
                      disabled={questions.length === 0}
                      indeterminate={isIndeterminate}
                    />
                  </button>
                </TH>
                <TH>SNO</TH>
                <TH>Question</TH>
                <TH>Type</TH>
                <TH>Created At</TH>
                <TH>Updated At</TH>
                {isSuperAdmin && <TH>Action</TH>}
              </TR>
            </THead>
            <TBody>
              {questions.map((question, index) => (
                <TR key={index}>
                  <TD>
                    <button
                      type="button"
                      onClick={() => handleSelectOne(question._id)}
                      className="focus:outline-none"
                      aria-label={`Select question ${question._id}`}
                    >
                      <Checkbox
                        checked={selectedItems.includes(question._id)}
                      />
                    </button>
                  </TD>
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD>
                    <p className="text-sm font-medium text-gray-900 max-w-md text-wrap">
                      {question.questionText}
                    </p>
                    {/* question image */}
                    {question.questionImage?.url && (
                      <div className="mt-3">
                        <img
                          src={question.questionImage.url}
                          alt="Question"
                          className="max-h-32 rounded-lg object-contain border border-gray-200"
                        />
                      </div>
                    )}
                    {/* options */}
                    <div className="mt-4 space-y-2">
                      {question.options.map((option, idx) => {
                        const isCorrect = question.correctAnswers?.includes(
                          option._id,
                        );
                        const isMultiple = question.correctAnswers?.length > 1;

                        return (
                          <div
                            key={idx}
                            className={`flex items-start justify-between rounded-xl border p-3 transition-all duration-200 ${
                              isCorrect
                                ? "border-green-500 bg-green-50 shadow-sm"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Filled Selection Icon */}
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-all ${
                                  isMultiple ? "rounded-md" : "rounded-full"
                                } ${
                                  isCorrect
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "border-gray-300 bg-white text-transparent"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </div>

                              {/* Option Content */}
                              <div className="flex flex-col gap-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-gray-500">
                                    {String.fromCharCode(65 + idx)}.
                                  </span>

                                  <span
                                    className={`text-sm ${
                                      isCorrect
                                        ? "font-medium text-green-800"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {option.text}
                                  </span>
                                </div>
                                {option.image?.url && (
                                  <img
                                    src={option.image.url}
                                    alt="Option"
                                    className="max-h-24 rounded-md object-contain border border-gray-200"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* explanation */}
                    {question.explanation && (
                      <div className="bg-primary/20 mt-4 rounded-md p-3">
                        <p className="text-primary text-sm">
                          Explanation: {question.explanation}
                        </p>
                      </div>
                    )}
                  </TD>
                  <TD>
                    <div className="bg-primary/20 text-primary w-max rounded-full px-3 py-1 text-xs font-medium">
                      {question.type.toUpperCase()}
                    </div>
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(question.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(question.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  {isSuperAdmin && (
                    <TD>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditData(question);
                            setShowQuestionModal(true);
                          }}
                          className="group text-primary cursor-pointer rounded-full p-2 transition hover:bg-sky-50"
                          title="Edit"
                        >
                          <Icon
                            name="Pencil"
                            size={20}
                            className="group-hover:text-primary/80"
                          />
                        </button>

                        <button
                          onClick={() => openDeleteModal(question)}
                          className="group cursor-pointer rounded-full p-2 text-red-400 transition hover:bg-red-50"
                          title="Delete"
                        >
                          <Icon
                            name="Trash"
                            size={20}
                            className="group-hover:text-red-500"
                          />
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
              columns={8}
              icon={Search}
              title="No matching results found"
              description="No questions match your search query. Try different keywords."
              action={
                <button
                  onClick={clearSearch}
                  className="cursor-pointer bg-primary hover:bg-opacity-90 rounded-full px-6 py-2 font-medium text-white transition"
                >
                  Clear Search
                </button>
              }
            />
          ) : (
            <>
              <UsersIcon className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-lg font-medium text-gray-800 sm:text-xl">
                No Questions Found
              </h3>
              <p className="mt-2 max-w-md px-4 text-sm text-gray-500 sm:px-0 sm:text-base">
                There are no questions registered in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        loading={isSubmitting}
        title={`Delete Question${selectedItem ? `: ${selectedItem.questionText}` : ""}`}
      >
        "Are you sure you want to delete this question? This action cannot be
        undone."
      </DeleteModal>

      <ManageQuestionModal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setSelectedItem(null);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        loading={isSubmitting}
        editData={editData}
      />

      <UploadQuestionModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadQuestions}
        loading={isSubmitting}
      />
    </div>
  );
}

export default QuizList;
