import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePermissions } from "../../../../hooks/usePermissions";
import {
  createQuizQuestion,
  deleteQuizQuestion,
  getChapterQuizzes,
  getQuizQuestions,
  importQuizQuestions,
  updateQuizQuestion,
} from "../../../../services/operations/chapterQuizAPI";
import CustomButton from "../../../common/CustomButton";
import DeleteModal from "../../../common/DeleteModal";
import Icon from "../../../common/Icon";
import MarkdownRenderer from "../../../common/MarkdownRenderer";
import Pagination from "../../../common/Pagination";
import SearchInput from "../../../common/SearchInput";
import {
  SkeletonRow,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "../../../common/Table";
import ToggleSwitch from "../../../common/ToggleSwitch";
import ManageQuestionModal from "./ManageQuestionModal";
import UploadQuestionModal from "./UploadQuestionModal";
import { EmptyState, SectionCard } from "../shared";

const tableColumns = [
  "SNO",
  "Question",
  "Options",
  "Correct Answer",
  "Explanation",
  "Status",
  "Action",
];

// Plain letter: "(c)" renders as a © ligature in some fonts
const optionLabel = (index) => String.fromCharCode(65 + index);

function QuestionsSection({ chapterId }) {
  const { isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();
  const { data: quizResponse } = useQuery({
    queryKey: ["quizzes", chapterId],
    queryFn: () => getChapterQuizzes(chapterId, { page: 1, limit: 1 }),
    enabled: !!chapterId,
  });
  // A chapter has a single quiz
  const quiz = quizResponse?.data?.quizzes?.[0];
  const quizId = quiz?.id;

  const [query, setQuery] = useState({ page: 1, limit: 20, search: "" });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["quiz-questions", quizId, query],
    queryFn: () => getQuizQuestions(quizId, query),
    enabled: !!quizId,
  });
  const { questions = [], pagination = {} } = response?.data || {};
  const { total = 0, page = 1, limit = 20, totalPages = 0 } = pagination;

  // Quiz summary shows the question count
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
    queryClient.invalidateQueries({ queryKey: ["quizzes", chapterId] });
  };

  const openModal = (question = null) => {
    setEditingQuestion(question);
    setShowManageModal(true);
  };

  const closeModal = () => {
    setEditingQuestion(null);
    setShowManageModal(false);
  };

  const { mutateAsync: saveQuestion, isPending: isSaving } = useMutation({
    mutationFn: (body) =>
      editingQuestion
        ? updateQuizQuestion(quizId, editingQuestion.id, body)
        : createQuizQuestion(quizId, body),
    onSuccess: () => {
      toast.success(
        editingQuestion
          ? "Question updated successfully"
          : "Question added successfully",
      );
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not save question");
    },
  });

  // Returns true on success so the modal knows to close itself
  const handleSave = async (body) => {
    try {
      await saveQuestion(body);
      return true;
    } catch {
      return false;
    }
  };

  const { mutateAsync: importQuestions, isPending: isImporting } = useMutation({
    mutationFn: (file) => importQuizQuestions(quizId, file),
    onSuccess: (res) => {
      const count = res?.data?.imported ?? 0;
      toast.success(`Imported ${count} question${count === 1 ? "" : "s"}`);
      invalidate();
    },
  });

  // Import errors list every unreadable question, one per line
  const handleImport = async (file) => {
    try {
      await importQuestions(file);
      return true;
    } catch (error) {
      toast.error(
        (
          error?.response?.data?.message || "Could not import questions"
        ).replaceAll("; ", "\n"),
      );
      return false;
    }
  };

  const { mutate: removeQuestion, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteQuizQuestion(quizId, id),
    onSuccess: () => {
      toast.success("Question deleted successfully");
      setDeletingQuestion(null);
      invalidate();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Could not delete question",
      );
    },
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: ({ id, isActive }) =>
      updateQuizQuestion(quizId, id, { isActive }),
    onSuccess: () => {
      toast.success("Status updated successfully");
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  // Questions belong to the quiz, so there's nothing to show until it exists
  if (!quiz) return null;

  const actions = (
    <div className="flex flex-wrap gap-2">
      <CustomButton
        title="Import .docx"
        iconName="FileUp"
        onClick={() => setShowImportModal(true)}
        className="text-primary! border-primary border bg-transparent"
      />
      <CustomButton
        title="Add Question"
        iconName="Plus"
        onClick={() => openModal()}
      />
    </div>
  );

  return (
    <SectionCard icon="ListChecks" title="Questions" action={actions}>
      {(quiz.questionCount > 0 || query.search) && (
        <div className="mb-4">
          <SearchInput
            placeholder="Search questions..."
            onSearch={(value) =>
              setQuery((prev) => ({ ...prev, page: 1, search: value }))
            }
            resultCount={query.search && !isLoading ? total : null}
            className="w-full lg:max-w-xl"
          />
        </div>
      )}

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
      ) : questions.length > 0 ? (
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
              {questions.map((question, index) => {
                const correctIndex =
                  question.options?.findIndex((option) => option.isCorrect) ??
                  -1;
                return (
                  <TR key={question.id}>
                    {/* S.No. accounts for current page offset */}
                    <TD>{(page - 1) * limit + index + 1}</TD>
                    <TD className="text-text max-w-md min-w-72 text-sm font-medium whitespace-normal!">
                      <MarkdownRenderer>{question.question}</MarkdownRenderer>
                    </TD>
                    <TD className="text-text text-sm">
                      {question.options?.map((option, i) => (
                        <div key={option.id ?? i} className="flex gap-1">
                          <span>{optionLabel(i)}.</span>
                          <MarkdownRenderer>{option.text}</MarkdownRenderer>
                        </div>
                      ))}
                    </TD>
                    <TD className="text-text text-sm">
                      {correctIndex >= 0 ? optionLabel(correctIndex) : "-"}
                    </TD>
                    <TD className="text-text max-w-md min-w-60 text-sm whitespace-normal!">
                      {question.explanation ? (
                        <MarkdownRenderer>
                          {question.explanation}
                        </MarkdownRenderer>
                      ) : (
                        "-"
                      )}
                    </TD>
                    <TD>
                      <ToggleSwitch
                        label=""
                        name={`question-status-${question.id}`}
                        checked={question.isActive}
                        onChange={() =>
                          toggleStatus({
                            id: question.id,
                            isActive: !question.isActive,
                          })
                        }
                      />
                    </TD>
                    <TD>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(question)}
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
                            onClick={() => setDeletingQuestion(question)}
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
                );
              })}
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
      ) : query.search ? (
        <EmptyState
          icon="Search"
          title="No matching questions"
          description="Try different keywords."
          action={
            <CustomButton
              title="Clear Search"
              onClick={() =>
                setQuery((prev) => ({ ...prev, page: 1, search: "" }))
              }
            />
          }
        />
      ) : (
        <EmptyState
          icon="ListChecks"
          title="No questions yet"
          description="Add questions one by one, or import them from a Word document."
        />
      )}

      <ManageQuestionModal
        isOpen={showManageModal}
        onClose={closeModal}
        question={editingQuestion}
        loading={isSaving}
        onSubmit={handleSave}
      />

      <UploadQuestionModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        loading={isImporting}
        onSubmit={handleImport}
      />

      <DeleteModal
        isOpen={!!deletingQuestion}
        onClose={() => setDeletingQuestion(null)}
        onDelete={() => deletingQuestion && removeQuestion(deletingQuestion.id)}
        loading={isDeleting}
        title="Delete Question"
      >
        Are you sure you want to delete this question? This action cannot be
        undone.
      </DeleteModal>
    </SectionCard>
  );
}

export default QuestionsSection;
