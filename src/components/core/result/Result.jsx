import { ClipboardList, Search, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { useNavigate } from "react-router-dom";
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
import {
  createResult,
  deleteResult,
  getResult,
  updateResult,
  updateResultStatus,
} from "../../../services/operations/resultAPI";
import UploadResultModal from "./UploadResultModal";

function Result() {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const fetchResults = async (showLoading = true) => {
    console.log("Fetching results:", showLoading);
    if (showLoading) {
      setLoading(true);
    }
    console.log("loading state after setLoading(true):", loading);
    try {
      const response = await getResult(token, query);
      setResults(response?.data?.results || []);
      setPagination(response?.data?.pagination || {});
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
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

  // ─── Modal ────────────────────────────────────────────────────────────────
  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowResultModal(true);
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setShowResultModal(false);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    let success = false;
    if (selectedItem) {
      const response = await updateResult(token, selectedItem._id, data);
      if (response) {
        success = true;
      }
    } else {
      const response = await createResult(token, data);
      if (response) {
        success = true;
      }
    }

    if (success) {
      await fetchResults();
      closeEditModal();
    }
    setLoading(false);
    return success;
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

  const handleDeleteResult = async () => {
    setLoading(true);
    const response = await deleteResult(token, selectedItem._id);
    if (response) {
      await fetchResults();
    }
    closeDeleteModal();
    setLoading(false);
  };

  const handleToggleStatus = async (item) => {
    const newStatus = !item.isActive;
    const body = {
      isActive: newStatus,
    };
    const response = await updateResultStatus(token, item._id, body);
    if (response) {
      await fetchResults(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-roboto text-text text-xl font-semibold md:text-3xl">
          Result Management
        </h1>
        {isSuperAdmin && (
          <CustomButton
            title="Upload Result"
            iconName="Plus"
            onClick={() => {
              setSelectedItem(null);
              setShowResultModal(true);
            }}
          />
        )}
      </div>

      <SearchInput
        placeholder="Search by title or description..."
        onSearch={(value) =>
          setQuery((prev) => ({ ...prev, page: 1, search: value }))
        }
        resultCount={query.search && !loading ? pagination.total : null}
        className="mb-6"
      />

      {/* Table */}
      {loading ? (
        <Table>
          <THead>
            <TR>
              <TH>SNO</TH>
              <TH>Student Name</TH>
              <TH>Result</TH>
              <TH>Created At</TH>
              <TH>Updated At</TH>
              <TH>Status</TH>
              {isSuperAdmin && <TH>Action</TH>}
            </TR>
          </THead>
          <TBody>
            {Array(5)
              .fill()
              .map((_, i) => (
                <SkeletonRow key={i} columns={isSuperAdmin ? 8 : 7} />
              ))}
          </TBody>
        </Table>
      ) : results?.length > 0 ? (
        <>
          <Table>
            <THead>
              <TR>
                <TH>SNO</TH>
                <TH>Student Name</TH>
                <TH>Result</TH>
                <TH>Created At</TH>
                <TH>Updated At</TH>
                <TH>Status</TH>
                {isSuperAdmin && <TH>Action</TH>}
              </TR>
            </THead>
            <TBody>
              {results.map((result, index) => (
                <TR key={index}>
                  {/* S.No. accounts for current page offset */}
                  <TD>{(query.page - 1) * query.limit + index + 1}</TD>
                  <TD className="text-sm font-medium text-gray-900">
                    {result.title}
                  </TD>
                  <TD>
                    <div className="text-sm text-gray-600">
                      {result.fileUrl ? (
                        <a
                          href={result.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Result
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(result.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD className="text-sm text-gray-600">
                    {moment(result.updatedAt).format("DD MMM YYYY, hh:mm A")}
                  </TD>
                  <TD>
                    <ToggleSwitch
                      label=""
                      name={`status-${result._id}`}
                      checked={result.isActive}
                      onChange={() => handleToggleStatus(result)}
                    />
                  </TD>
                  {isSuperAdmin && (
                    <TD>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(result)}
                          className="hover:text-primary cursor-pointer rounded-full p-2 text-gray-600 transition hover:bg-sky-50"
                          title="Edit"
                        >
                          <Icon name="Pencil" size={20} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(result)}
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
          {(pagination.totalPages > 1 || pagination.total > 0) && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                rowsPerPage={pagination.limit}
                setRowsPerPage={handleLimitChange}
                totalRows={pagination.total}
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
              description="No results match your search query. Try different keywords."
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
              <ClipboardList className="mb-3 h-12 w-12 text-gray-300 sm:mb-4 sm:h-16 sm:w-16" />
              <h3 className="text-lg font-medium text-gray-800 sm:text-xl">
                No Results Found
              </h3>
              <p className="mt-2 max-w-md px-4 text-sm text-gray-500 sm:px-0 sm:text-base">
                There are no results registered in the system yet.
              </p>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onDelete={handleDeleteResult}
        loading={loading}
        title={`Delete Result${selectedItem ? `: ${selectedItem.title}` : ""}`}
      >
        "Are you sure you want to delete this result? This action cannot be
        undone."
      </DeleteModal>

      {/* Edit / Add Modal */}
      <UploadResultModal
        isOpen={showResultModal}
        onClose={closeEditModal}
        data={selectedItem}
        onSubmit={handleSubmit}
        loading={loading}
        title={selectedItem ? "Edit Result" : "Add Result"}
      />
    </div>
  );
}

export default Result;
