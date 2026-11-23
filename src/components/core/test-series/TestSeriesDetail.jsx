import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { usePermissions } from "../../../hooks/usePermissions";
import {
  deleteChapterQuiz,
  getQuizById,
  updateChapterQuiz,
} from "../../../services/operations/chapterQuizAPI";
import DeleteModal from "../../common/DeleteModal";
import Icon from "../../common/Icon";
import ChapterQuizOverview from "../chapters/quizzes/ChapterQuizOverview";
import ManageQuizModal from "../chapters/quizzes/ManageQuizModal";
import QuestionsSection from "../chapters/quizzes/QuestionsSection";
import { TEST_SERIES_QUERY_KEY } from "./constants";

function TestSeriesDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Nested under the list key so list invalidations refresh this too
  const quizQueryKey = [...TEST_SERIES_QUERY_KEY, "detail", quizId];
  const { data: response, isLoading } = useQuery({
    queryKey: quizQueryKey,
    queryFn: () => getQuizById(quizId),
    enabled: !!quizId,
  });
  const quiz = response?.data;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: TEST_SERIES_QUERY_KEY });

  const { mutateAsync: saveQuiz, isPending: isSaving } = useMutation({
    mutationFn: (body) => updateChapterQuiz(quizId, body),
    onSuccess: () => {
      toast.success("Test series updated successfully");
      invalidate();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Could not save test series",
      );
    },
  });

  const handleSave = async (body) => {
    try {
      await saveQuiz(body);
      return true;
    } catch {
      return false;
    }
  };

  const { mutate: toggleStatus, isPending: isTogglingStatus } = useMutation({
    mutationFn: (isActive) => updateChapterQuiz(quizId, { isActive }),
    onSuccess: (_, isActive) => {
      toast.success(
        isActive ? "Test series activated" : "Test series deactivated",
      );
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  const { mutate: removeQuiz, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteChapterQuiz(quizId),
    onSuccess: () => {
      toast.success("Test series deleted successfully");
      invalidate();
      navigate("/dashboard/test-series");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Could not delete test series",
      );
    },
  });

  return (
    <div>
      <h1 className="font-roboto text-text mb-6 text-xl font-semibold md:text-3xl">
        Test Series
      </h1>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
          <div className="h-96 animate-pulse rounded-3xl bg-gray-100" />
        </div>
      ) : quiz ? (
        <div className="flex flex-col gap-4">
          <ChapterQuizOverview
            quiz={quiz}
            onEdit={() => setShowManageModal(true)}
            onToggleStatus={() => toggleStatus(!quiz.isActive)}
            statusLoading={isTogglingStatus}
            onDelete={isSuperAdmin ? () => setShowDeleteModal(true) : undefined}
          />
          <QuestionsSection quiz={quiz} quizQueryKey={TEST_SERIES_QUERY_KEY} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
          <Icon
            name="NotebookPen"
            className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16"
          />
          <h3 className="text-text text-lg font-medium sm:text-xl">
            Test Series Not Found
          </h3>
        </div>
      )}

      <ManageQuizModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        type="TEST_SERIES"
        quiz={quiz}
        loading={isSaving}
        onSubmit={handleSave}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => removeQuiz()}
        loading={isDeleting}
        title="Delete Test Series"
      >
        This will permanently delete the test series and all its questions. This
        action cannot be undone.
      </DeleteModal>
    </div>
  );
}

export default TestSeriesDetail;
