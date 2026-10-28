import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import toast from "react-hot-toast";
import { usePermissions } from "../../../../hooks/usePermissions";
import {
  createAudioLecture,
  deleteAudioLecture,
  getAudioLectures,
  toggleAudioLectureStatus,
  updateAudioLecture,
} from "../../../../services/operations/audioLectureAPI";
import CustomButton from "../../../common/CustomButton";
import DeleteModal from "../../../common/DeleteModal";
import Icon from "../../../common/Icon";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { EmptyState, SectionCard } from "../shared";
import LecturePlayer from "../../../common/players/LecturePlayer";
import ManageAudioLectureModal from "./ManageAudioLectureModal";

// A chapter has a single audio recording, so this renders one card
function LectureSection({ chapterId, chapterName }) {
  const { isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["audio-lectures", chapterId],
    queryFn: () => getAudioLectures(chapterId, { page: 1, limit: 1 }),
    enabled: !!chapterId,
  });
  const lecture = response?.data?.audioLectures?.[0] || null;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["audio-lectures", chapterId] });
    // Chapter detail shows content counts
    queryClient.invalidateQueries({ queryKey: ["chapter"] });
  };

  // ─── Add / Edit ───────────────────────────────────────────────────────────
  const { mutateAsync: saveLectureMutation, isPending: isSaving } = useMutation(
    {
      mutationFn: ({ id, body, audio, image }) =>
        id
          ? updateAudioLecture(id, body, audio, image)
          : createAudioLecture(body, audio, image),
      onSuccess: (_, { id }) => {
        toast.success(
          id ? "Lecture updated successfully" : "Lecture uploaded successfully",
        );
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Could not save lecture");
      },
    },
  );

  // Returns true on success so the modal knows to close itself
  const handleSaveLecture = async (body, audio, image) => {
    try {
      await saveLectureMutation({ id: lecture?.id, body, audio, image });
      return true;
    } catch {
      return false;
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const { mutate: deleteLectureMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAudioLecture,
    onSuccess: () => {
      toast.success("Lecture deleted successfully");
      setShowDeleteModal(false);
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete lecture");
    },
  });

  const { mutate: toggleStatusMutation } = useMutation({
    mutationFn: toggleAudioLectureStatus,
    onSuccess: () => {
      toast.success("Status updated successfully");
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update status");
    },
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {isLoading ? (
        <div className="animate-pulse rounded-3xl bg-[#121212] p-5 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="mx-auto h-48 w-48 rounded-xl bg-white/10 sm:mx-0 sm:h-52 sm:w-52" />
            <div className="flex-1 space-y-3">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-10 w-2/3 rounded bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/10" />
            </div>
          </div>
          <div className="mx-auto mt-8 h-14 w-14 rounded-full bg-white/10" />
          <div className="mt-5 h-1 w-full rounded-full bg-white/10" />
        </div>
      ) : lecture ? (
        <LecturePlayer
          // Remount resets playback when the recording is replaced
          key={lecture.audioUrl}
          lecture={lecture}
          actions={
            <div className="flex items-center gap-1">
              <ToggleSwitch
                label=""
                name={`lecture-status-${lecture.id}`}
                checked={lecture.isActive}
                onChange={() => toggleStatusMutation(lecture.id)}
              />
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                title="Edit"
                className="cursor-pointer rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon name="Pencil" size={18} />
              </button>
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  title="Delete"
                  className="cursor-pointer rounded-full p-2 text-white/70 transition hover:bg-red-500/20 hover:text-red-400"
                >
                  <Icon name="Trash" size={18} />
                </button>
              )}
            </div>
          }
        />
      ) : (
        <SectionCard icon="Headphones" title="Audio Lecture">
          <EmptyState
            icon="Headphones"
            title="No Audio Lecture"
            description="Upload the recording for this chapter."
            action={
              <CustomButton
                title="Upload Lecture"
                iconName="Plus"
                onClick={() => setShowManageModal(true)}
              />
            }
          />
        </SectionCard>
      )}

      {/* Add / Edit Modal */}
      <ManageAudioLectureModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        chapterId={chapterId}
        chapterName={chapterName}
        lecture={lecture}
        loading={isSaving}
        onSubmit={handleSaveLecture}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => lecture && deleteLectureMutation(lecture.id)}
        loading={isDeleting}
        title={`Delete Lecture${lecture?.title ? `: ${lecture.title}` : ""}`}
      >
        Are you sure you want to delete this lecture? This action cannot be
        undone.
      </DeleteModal>
    </>
  );
}

export default LectureSection;
