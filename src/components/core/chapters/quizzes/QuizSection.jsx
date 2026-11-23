import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  createChapterQuiz,
  deleteChapterQuiz,
  getChapterQuizzes,
  updateChapterQuiz,
} from "../../../../services/operations/chapterQuizAPI";
import CustomButton from "../../../common/CustomButton";
import DeleteModal from "../../../common/DeleteModal";
import { EmptyState, SectionCard } from "../shared";
import ChapterQuizOverview from "./ChapterQuizOverview";
import ManageQuizModal from "./ManageQuizModal";

// A chapter has a single quiz; its questions are managed in QuestionsSection
function QuizSection({ chapterId, chapterName }) {
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: quizResponse, isLoading } = useQuery({
    queryKey: ["quizzes", chapterId],
    queryFn: () => getChapterQuizzes(chapterId, { page: 1, limit: 1 }),
    enabled: !!chapterId,
  });
  // A chapter has a single quiz
  const quiz = quizResponse?.data?.quizzes?.[0];

  const { mutateAsync: saveQuiz, isPending: isSaving } = useMutation({
    mutationFn: (body) =>
      quiz ? updateChapterQuiz(quiz.id, body) : createChapterQuiz(body),
    onSuccess: () => {
      toast.success(
        quiz ? "Quiz updated successfully" : "Quiz created successfully",
      );
      invalidateQuiz();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not save quiz");
    },
  });

  const invalidateQuiz = () => {
    queryClient.invalidateQueries({ queryKey: ["quizzes", chapterId] });
    queryClient.invalidateQueries({ queryKey: ["chapter"] });
  };

  const { mutate: toggleStatus, isPending: isTogglingStatus } = useMutation({
    mutationFn: (isActive) => updateChapterQuiz(quiz.id, { isActive }),
    onSuccess: (_, isActive) => {
      toast.success(isActive ? "Quiz activated" : "Quiz deactivated");
      invalidateQuiz();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  const { mutate: deleteQuiz, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteChapterQuiz(quiz.id),
    onSuccess: () => {
      toast.success("Quiz deleted successfully");
      setShowDeleteModal(false);
      invalidateQuiz();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete quiz");
    },
  });

  // Returns true on success so the modal knows to close itself
  const handleSave = async (body) => {
    try {
      await saveQuiz(body);
      return true;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />;
  }

  return (
    <>
      {quiz ? (
        <ChapterQuizOverview
          quiz={quiz}
          onEdit={() => setShowManageModal(true)}
          onToggleStatus={() => toggleStatus(!quiz.isActive)}
          statusLoading={isTogglingStatus}
          onDelete={() => setShowDeleteModal(true)}
        />
      ) : (
        <SectionCard
          icon="ClipboardList"
          title="Quiz"
          subtitle="One practice quiz for this chapter"
        >
          <EmptyState
            icon="ClipboardList"
            title="No quiz yet"
            description="Create the chapter quiz, then add or import its questions."
            action={
              <CustomButton
                title="Create Quiz"
                iconName="Plus"
                onClick={() => setShowManageModal(true)}
              />
            }
          />
        </SectionCard>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => deleteQuiz()}
        loading={isDeleting}
        title="Delete Quiz"
      >
        This will permanently delete the quiz and all its questions. This action
        cannot be undone.
      </DeleteModal>

      <ManageQuizModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        chapterId={chapterId}
        chapterName={chapterName}
        quiz={quiz}
        loading={isSaving}
        onSubmit={handleSave}
      />
    </>
  );
}

export default QuizSection;
