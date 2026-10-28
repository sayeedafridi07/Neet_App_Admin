import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AudioLines } from "lucide-react";
import { useState } from "react";

import moment from "moment";
import toast from "react-hot-toast";
import { usePermissions } from "../../../../hooks/usePermissions";
import {
  createKeywordRevision,
  deleteKeywordRevision,
  getKeywordRevisions,
  toggleKeywordRevisionStatus,
  updateKeywordRevision,
} from "../../../../services/operations/keywordRevisionAPI";
import CustomButton from "../../../common/CustomButton";
import DeleteModal from "../../../common/DeleteModal";
import Icon from "../../../common/Icon";
import Pagination from "../../../common/Pagination";
import SearchInput from "../../../common/SearchInput";
import { PLACEHOLDER_COVER } from "../../../common/players/LecturePlayer";
import NowPlayingBar from "../../../common/players/NowPlayingBar";
import { useAudioPlayer } from "../../../common/players/useAudioPlayer";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { EmptyState } from "../shared";
import { formatDuration } from "../utils";
import ManageKeywordRevisionModal from "./ManageKeywordRevisionModal";

function KeywordSection({ chapterId }) {
  const { isSuperAdmin } = usePermissions();
  const queryClient = useQueryClient();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["keyword-revisions", chapterId, query],
    queryFn: () => getKeywordRevisions(chapterId, query),
    enabled: !!chapterId,
  });
  const { keywordRevisions = [], pagination = {} } = response?.data || {};
  const { total = 0, page = 1, limit = 10, totalPages = 0 } = pagination;

  // ─── Playback ─────────────────────────────────────────────────────────────
  const player = useAudioPlayer();
  const [currentId, setCurrentId] = useState(null);
  // Keep the playing track even if it leaves the current page
  const [currentTrack, setCurrentTrack] = useState(null);

  const playable = keywordRevisions.filter((k) => k.audioUrl);
  const queueIndex = playable.findIndex((k) => k.id === currentId);
  const activeTrack = currentId ? currentTrack : null;

  const playTrack = (keyword) => {
    if (!keyword.audioUrl) return;
    if (keyword.id === currentId) {
      player.togglePlay();
      return;
    }
    setCurrentId(keyword.id);
    setCurrentTrack(keyword);
  };

  const prevTrack =
    queueIndex > 0 ? () => playTrack(playable[queueIndex - 1]) : undefined;
  const nextTrack =
    queueIndex >= 0 && queueIndex < playable.length - 1
      ? () => playTrack(playable[queueIndex + 1])
      : undefined;

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["keyword-revisions", chapterId],
    });
    // Chapter detail shows content counts
    queryClient.invalidateQueries({ queryKey: ["chapter"] });
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

  // ─── Add / Edit ───────────────────────────────────────────────────────────
  const openManageModal = (item = null) => {
    setSelectedItem(item);
    setShowManageModal(true);
  };

  const closeManageModal = () => {
    setSelectedItem(null);
    setShowManageModal(false);
  };

  const { mutateAsync: saveKeywordMutation, isPending: isSaving } = useMutation(
    {
      mutationFn: ({ id, body, audio, image }) =>
        id
          ? updateKeywordRevision(id, body, audio, image)
          : createKeywordRevision(body, audio, image),
      onSuccess: (_, { id }) => {
        toast.success(
          id ? "Keyword updated successfully" : "Keyword uploaded successfully",
        );
        invalidate();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Could not save keyword");
      },
    },
  );

  // Returns true on success so the modal knows to close itself
  const handleSaveKeyword = async (body, audio, image) => {
    try {
      await saveKeywordMutation({ id: selectedItem?.id, body, audio, image });
      return true;
    } catch {
      return false;
    }
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

  const { mutate: deleteKeywordMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteKeywordRevision,
    onSuccess: () => {
      toast.success("Keyword deleted successfully");
      closeDeleteModal();
      invalidate();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not delete keyword");
    },
  });

  const handleDeleteKeyword = () => {
    if (!selectedItem) return;
    deleteKeywordMutation(selectedItem.id);
  };

  const { mutate: toggleStatusMutation } = useMutation({
    mutationFn: toggleKeywordRevisionStatus,
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
    <div>
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
          title="Add Keyword"
          iconName="Plus"
          onClick={() => openManageModal()}
        />
      </div>

      {/* Track list */}
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-2">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 p-3"
              >
                <div className="h-4 w-4 rounded bg-gray-200" />
                <div className="h-11 w-11 rounded-md bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-10 rounded bg-gray-200" />
              </div>
            ))}
        </div>
      ) : keywordRevisions.length > 0 ? (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white p-2">
            {/* Column header */}
            <div className="text-textMuted grid grid-cols-[2rem_1fr_auto_auto] items-center gap-4 border-b border-gray-100 px-3 pt-1 pb-2 text-xs font-medium tracking-wider uppercase md:grid-cols-[2rem_1fr_9rem_5rem_5rem_6rem]">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="hidden md:block">Updated</span>
              <span className="hidden justify-self-end md:block">Duration</span>
              <span className="justify-self-center">Status</span>
              <span className="justify-self-end">Actions</span>
            </div>

            <ul className="mt-1">
              {keywordRevisions.map((keyword, index) => {
                const isCurrent = keyword.id === currentId;
                const isPlaying = isCurrent && player.isPlaying;
                const coverUrl =
                  keyword.imageUrl || keyword.thumbnailUrl || PLACEHOLDER_COVER;

                return (
                  <li
                    key={keyword.id}
                    onDoubleClick={() => playTrack(keyword)}
                    className={`group grid grid-cols-[2rem_1fr_auto_auto] items-center gap-4 rounded-xl px-3 py-2 transition hover:bg-gray-50 md:grid-cols-[2rem_1fr_9rem_5rem_5rem_6rem] ${isCurrent ? "bg-primary/5" : ""}`}
                  >
                    {/* Index ↔ play button on hover */}
                    <div className="relative flex h-8 items-center justify-center">
                      <span
                        className={`text-sm tabular-nums group-hover:invisible ${isCurrent ? "text-primary" : "text-textSecondary"}`}
                      >
                        {isPlaying ? (
                          <Icon name="AudioLines" size={16} />
                        ) : (
                          (page - 1) * limit + index + 1
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => playTrack(keyword)}
                        disabled={!keyword.audioUrl}
                        title={isPlaying ? "Pause" : "Play"}
                        className="text-text absolute inset-0 hidden cursor-pointer items-center justify-center group-hover:flex disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Icon
                          name={isPlaying ? "Pause" : "Play"}
                          size={16}
                          fill="currentColor"
                        />
                      </button>
                    </div>

                    {/* Cover + title */}
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={coverUrl}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-semibold ${isCurrent ? "text-primary" : "text-text"}`}
                        >
                          {keyword.title}
                        </p>
                        <p className="text-textSecondary truncate text-xs">
                          {keyword.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-textSecondary hidden truncate text-sm md:block">
                      {moment(keyword.updatedAt).fromNow()}
                    </span>
                    <span className="text-textSecondary hidden justify-self-end text-sm tabular-nums md:block">
                      {formatDuration(keyword.duration)}
                    </span>

                    <div className="justify-self-center">
                      <ToggleSwitch
                        label=""
                        name={`keyword-status-${keyword.id}`}
                        checked={keyword.isActive}
                        onChange={() => toggleStatusMutation(keyword.id)}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openManageModal(keyword)}
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
                          onClick={() => openDeleteModal(keyword)}
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
                  </li>
                );
              })}
            </ul>
          </div>

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
            <EmptyState
              icon="Search"
              title="No matching results found"
              description="No keywords match your search query. Try different keywords."
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
              <AudioLines className="text-textMuted mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-text text-lg font-medium sm:text-xl">
                No Keywords Found
              </h3>
              <p className="text-textSecondary mt-2 max-w-md px-4 text-sm sm:px-0 sm:text-base">
                There are no keyword revisions added to this chapter yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* One audio element plays the whole queue */}
      {activeTrack && (
        <audio
          src={activeTrack.audioUrl}
          autoPlay
          {...player.audioProps}
          onEnded={(e) => {
            player.audioProps.onEnded(e);
            nextTrack?.();
          }}
        />
      )}
      <NowPlayingBar
        track={activeTrack}
        player={player}
        onPrev={prevTrack}
        onNext={nextTrack}
        onClose={() => setCurrentId(null)}
      />

      {/* Add / Edit Modal */}
      <ManageKeywordRevisionModal
        isOpen={showManageModal}
        onClose={closeManageModal}
        chapterId={chapterId}
        revision={selectedItem}
        loading={isSaving}
        onSubmit={handleSaveKeyword}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteKeyword}
        loading={isDeleting}
        title={`Delete Keyword${selectedItem?.title ? `: ${selectedItem.title}` : ""}`}
      >
        Are you sure you want to delete this keyword? This action cannot be
        undone.
      </DeleteModal>
    </div>
  );
}

export default KeywordSection;
