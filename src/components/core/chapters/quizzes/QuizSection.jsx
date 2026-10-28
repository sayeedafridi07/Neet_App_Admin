import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  createChapterQuiz,
  getChapterQuizzes,
} from "../../../../services/operations/chapterQuizAPI";
import CustomButton from "../../../common/CustomButton";
import { EmptyState, SectionCard } from "../shared";
import ManageQuizModal from "./ManageQuizModal";

// A chapter has a single quiz; its questions are managed in QuestionsSection
function QuizSection({ chapterId, chapterName }) {
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const { data: quizResponse, isLoading } = useQuery({
    queryKey: ["quizzes", chapterId],
    queryFn: () => getChapterQuizzes(chapterId, { page: 1, limit: 1 }),
    enabled: !!chapterId,
  });
  // A chapter has a single quiz
  const quiz = quizResponse?.data?.quizzes?.[0];

  const { mutateAsync: saveQuiz, isPending: isSaving } = useMutation({
    mutationFn: createChapterQuiz,
    onSuccess: () => {
      toast.success("Quiz created successfully");
      queryClient.invalidateQueries({ queryKey: ["quizzes", chapterId] });
      queryClient.invalidateQueries({ queryKey: ["chapter"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not save quiz");
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

  if (quiz) return null;

  return (
    <>
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

      <ManageQuizModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        chapterId={chapterId}
        chapterName={chapterName}
        loading={isSaving}
        onSubmit={handleSave}
      />
    </>
  );
}

export default QuizSection;
