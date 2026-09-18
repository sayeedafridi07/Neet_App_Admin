import React, { useEffect, useState } from "react";
import { usePermissions } from "../../../../hooks/usePermissions";
import CustomButton from "../../../common/CustomButton";
import {
  Album,
  Clock3,
  FileQuestion,
  Trophy,
  CircleCheckBig,
  RotateCcw,
  BadgeCheck,
  HelpCircle,
  Award,
  Flame,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import ManageQuizModal from "./ManageQuizModal";
import { useLocation, useParams } from "react-router-dom";
import {
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  updateQuizStatus,
  getQuizByCourseId,
} from "../../../../services/operations/quizAPI";
import { useSelector } from "react-redux";
import QuizList from "./QuizList";
import QuizOverview from "./QuizOverview";
import DeleteModal from "../../../common/DeleteModal";

const Quiz = () => {
  const { token } = useSelector((state) => state.auth);
  const { isSuperAdmin } = usePermissions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();

  const fetchQuiz = async (showLoading = true) => {
    if (showLoading) {
      setIsFetching(true);
    }
    const response = await getQuizByCourseId(token, courseId);
    setQuizData(response?.data);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, [courseId, token]);

  const handleSubmit = async (data) => {
    setLoading(true);
    let success = false;
    if (quizData) {
      const response = await updateQuiz(token, quizData._id, data);
      if (response) success = true;
    } else {
      const payload = { ...data, courseId: courseId };
      const response = await createQuiz(token, payload);
      if (response) success = true;
    }

    if (success) {
      await fetchQuiz(false);
    }
    setLoading(false);
    return success;
  };

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteQuiz(token, quizData._id);
    if (response) {
      await fetchQuiz(false);
      setShowDeleteModal(false);
    }
    setLoading(false);
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    const newStatus = !quizData.isActive;
    const body = {
      isActive: newStatus,
    };
    const response = await updateQuizStatus(token, quizData._id, body);
    if (response) {
      await fetchQuiz(false);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Quiz Management
        </h1>
      </div>

      {/* Quiz overview */}
      {isFetching ? (
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="p-6 pb-0 sm:p-8 sm:pb-0">
              <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="h-9 w-1/3 rounded-lg bg-gray-200" />
                  <div className="h-5 w-2/3 rounded-lg bg-gray-200" />
                  <div className="flex gap-4 pt-1">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-12 w-48 shrink-0 rounded-2xl bg-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 border-t border-slate-100 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2 sm:p-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-200" />
                  <div className="flex flex-col space-y-2">
                    <div className="h-3 w-16 rounded bg-gray-200" />
                    <div className="h-6 w-12 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 bg-slate-50/40 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 w-24 rounded-full bg-gray-200" />
                  <div className="h-8 w-24 rounded-full bg-gray-200" />
                  <div className="h-8 w-24 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-7 w-32 rounded bg-gray-200" />
              <div className="h-10 w-36 rounded-lg bg-gray-200" />
            </div>

            <div className="mb-6 h-12 w-full max-w-md rounded-xl bg-gray-200" />

            <div className="space-y-4">
              <div className="h-12 w-full rounded-lg bg-gray-200" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-full rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      ) : quizData ? (
        <>
          <QuizOverview
            data={quizData}
            onDelete={() => setShowDeleteModal(true)}
            onEdit={() => setShowQuizModal(true)}
            onToggleStatus={handleToggleStatus}
            loading={loading}
          />
          {/* Questions List */}
          <QuizList quizId={quizData?._id} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center sm:py-16">
          <Album className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
          <h3 className="text-text text-lg font-medium sm:text-xl">
            No Quiz Found
          </h3>
          <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
            There are no quizzes registered in the system yet.
          </p>
          {isSuperAdmin && (
            <CustomButton
              title="Create Quiz"
              className="mt-6"
              onClick={() => {
                setShowQuizModal(true);
              }}
            />
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        loading={loading}
        title={`Delete Quiz: ${quizData?.title}`}
      >
        "Are you sure you want to delete this quiz? This action cannot be
        undone."
      </DeleteModal>

      <ManageQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        data={quizData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default Quiz;
