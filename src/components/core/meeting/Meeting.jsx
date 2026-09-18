import { CalendarCheck, Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  deleteMeeting,
  getMeetings,
  updateMeetingStatus,
} from "../../../services/operations/meetingAPI";
import CustomButton from "../../common/CustomButton";
import DeleteModal from "../../common/DeleteModal";
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

function Meeting() {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    meetings,
    loading,
    pagination: { total, page, limit, totalPages },
  } = useSelector((state) => state.meeting);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  useEffect(() => {
    dispatch(getMeetings(token, query));
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

  const handleDeleteUser = async () => {
    closeDeleteModal();
    dispatch(deleteMeeting(token, selectedItem._id, query)); // refresh
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item.isActive;
    const body = {
      isActive: newStatus,
    };
    dispatch(updateMeetingStatus(token, item._id, body, query));
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Meeting Management
        </h1>
        <CustomButton
          title="Schedule Meeting"
          iconName="Plus"
          onClick={() => navigate(`manage-meeting`)}
        />
      </div>

      <SearchInput
        placeholder="Search by title or description..."
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
              <TH>SNO</TH>
              <TH>Title</TH>
              <TH>Description</TH>
              <TH>Link</TH>
              <TH>Created At</TH>
              <TH>Updated At</TH>
              <TH>Status</TH>
              <TH>Action</TH>
            </TR>
          </THead>
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={8} />
              ))}
          </TBody>
        </Table>
      ) : meetings?.length > 0 ? (
        <>
          <Table>
            <THead>
              <TR>
                <TH>SNO</TH>
                <TH>Title</TH>
                <TH>Description</TH>
                <TH>Link</TH>
                <TH>Created At</TH>
                <TH>Updated At</TH>
                <TH>Status</TH>
                <TH>Action</TH>
              </TR>
            </THead>
            <TBody>
              {meetings.map((data, index) => (
                <TR key={index}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(page - 1) * limit + index + 1}</TD>
                  <TD className="text-sm font-medium text-gray-900">
                    {data.title}
                  </TD>
                  <TD>
                    <div className="max-w-xs text-sm whitespace-pre-wrap text-gray-600 md:max-w-md">
                      {data.description || "-"}
                    </div>
                  </TD>
                  <TD>
                    <div className="text-sm text-gray-600">
                      {data.meetingLink ? (
                        <a
                          href={data.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Meeting
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(data.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(data.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      label=""
                      name={`status-${data._id}`}
                      checked={data.isActive}
                      onChange={() => handleToggleStatus(data)}
                    />
                  </TD>
                  <TD>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`manage-meeting`, { state: data })
                        }
                        className="group cursor-pointer rounded-full p-2 transition hover:bg-sky-50"
                        title="Edit"
                      >
                        <Icon
                          name="Pencil"
                          size={20}
                          className="group-hover:text-primary/80 text-gray-600"
                        />
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => openDeleteModal(data)}
                          className="group cursor-pointer rounded-full p-2 transition hover:bg-red-50"
                          title="Delete"
                        >
                          <Icon
                            name="Trash"
                            size={20}
                            className="text-gray-600 group-hover:text-red-500"
                          />
                        </button>
                      )}
                    </div>
                  </TD>
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
              description="No meetings match your search query. Try different keywords."
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
              <CalendarCheck className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-lg font-medium text-gray-800 sm:text-xl">
                No Meetings Found
              </h3>
              <p className="mt-2 max-w-md px-4 text-sm text-gray-500 sm:px-0 sm:text-base">
                There are no meetings registered in the system yet.
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
        title={`Delete Meeting${selectedItem ? `: ${selectedItem.title}` : ""}`}
      >
        "Are you sure you want to delete this meeting? This action cannot be
        undone."
      </DeleteModal>
    </div>
  );
}

export default Meeting;
