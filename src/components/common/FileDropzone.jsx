// components/common/FileDropzone.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const FileDropzone = ({
  value,
  onChange,
  error,

  label = "Upload File",
  required = false,
  accept = {},
  maxFileSize = 10, // MB
  multiple = false,

  // UI
  icon,
  helperText,
  browseText = "Browse Files",
  replaceText = "Click to replace",

  // Custom messages
  invalidTypeMessage = "Invalid file type",
}) => {
  const [files, setFiles] = useState([]);

  // Sync external value
  useEffect(() => {
    if (!value) {
      setFiles([]);
      return;
    }

    // Existing URL string
    if (typeof value === "string") {
      const isImageUrl = value.match(/\.(jpeg|jpg|gif|png|svg|webp)(\?.*)?$/i);
      setFiles([
        {
          name: value.split("/").pop(),
          size: null,
          preview: isImageUrl ? value : null,
        },
      ]);
      return;
    }

    // File object
    if (value instanceof File) {
      const preview = value.type.startsWith("image/")
        ? URL.createObjectURL(value)
        : null;
      setFiles([Object.assign(value, { preview })]);
      return;
    }

    // Multiple files
    if (Array.isArray(value)) {
      setFiles(
        value.map((f) => {
          if (f instanceof File) {
            const preview = f.type.startsWith("image/")
              ? URL.createObjectURL(f)
              : null;
            return Object.assign(f, { preview });
          }
          return f;
        }),
      );
    }

    // Cleanup previews on unmount or when files change
    return () => {
      files.forEach((file) => {
        if (file.preview && file instanceof File) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [value]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    const mb = bytes / (1024 * 1024);

    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  const acceptedFormats = useMemo(() => {
    return Object.values(accept).flat().join(", ");
  }, [accept]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles?.length) return;

      setFiles(acceptedFiles);

      onChange(multiple ? acceptedFiles : acceptedFiles[0]);
    },
    [multiple, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize: maxFileSize * 1024 * 1024,

    onDropRejected: (fileRejections) => {
      const err = fileRejections[0]?.errors[0];

      if (err?.code === "file-too-large") {
        toast.error(`File size should be less than ${maxFileSize} MB`);
      } else if (err?.code === "file-invalid-type") {
        toast.error(invalidTypeMessage);
      }
    },
  });

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <div className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "hover:border-primary/50 hover:bg-primary/5 border-zinc-300"
        } ${error ? "border-red-500" : ""} `}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        {icon && files.every((f) => !f.preview) && (
          <img
            src={icon}
            alt="File Icon"
            className="h-16 w-16 object-contain"
          />
        )}

        {/* Selected Files */}
        {files.length > 0 ? (
          <>
            <div className="flex w-full flex-col gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  {file.preview && (
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="mb-3 h-32 w-auto rounded-lg object-contain"
                    />
                  )}
                  <p className="max-w-[90%] truncate text-sm font-semibold text-zinc-800">
                    {file.name}
                  </p>

                  {file.size && (
                    <p className="text-xs font-medium text-zinc-500">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-base font-bold text-zinc-700">
              {isDragActive
                ? "Drop files here!"
                : "Drop files here or click to browse"}
            </p>

            <p className="text-center text-sm text-zinc-400">
              {helperText ||
                `${acceptedFormats || "Supported files"} · Max size ${maxFileSize} MB`}
            </p>
          </>
        )}

        {/* CTA */}
        <div className="text-primary mt-1 text-sm font-semibold underline underline-offset-2">
          {files.length > 0 ? replaceText : browseText}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileDropzone;
