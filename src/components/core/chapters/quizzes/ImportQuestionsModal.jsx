import { useState } from "react";
import CustomButton from "../../../common/CustomButton";
import FileDropzone from "../../../common/FileDropzone";
import Icon from "../../../common/Icon";

const MAX_DOC_SIZE_MB = 10;

const ModalContent = ({ onClose, loading, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      setError("Select a .docx file");
      return;
    }
    // onSubmit resolves to an error message, or null on success
    const failure = await onSubmit(file);
    if (failure) setError(failure);
    else onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="mx-4 max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">Import Questions</h1>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="border-primary space-y-4 rounded-lg border p-4 md:p-6">
          <FileDropzone
            label="Word Document"
            required
            value={file}
            onChange={(picked) => {
              setFile(picked);
              setError("");
            }}
            accept={{
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            }}
            maxFileSize={MAX_DOC_SIZE_MB}
            helperText={`.docx up to ${MAX_DOC_SIZE_MB}MB`}
            invalidTypeMessage="Only .docx files are allowed"
          />
          <p className="text-textSecondary text-sm">
            Each question needs its options and must end with an{" "}
            <span className="text-text font-medium">Ans: (x)</span> line.
            Imported questions are added after the existing ones. If any
            question can't be read, nothing is imported.
          </p>
          {error && (
            <div className="bg-error/10 text-error rounded-xl p-3 text-sm whitespace-pre-line">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title="Cancel"
            onClick={onClose}
            disabled={loading}
            className="text-primary! border-primary border bg-white"
          />
          <CustomButton
            title="Import"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
            className="bg-primary! border-primary! border"
          />
        </div>
      </div>
    </div>
  );
};

const ImportQuestionsModal = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  return <ModalContent {...props} />;
};

export default ImportQuestionsModal;
