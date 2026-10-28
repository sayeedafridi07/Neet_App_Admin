import MDEditor from "@uiw/react-md-editor";
import "katex/dist/katex.min.css";
import { rehypePlugins, remarkPlugins } from "../../utils/markdown";

// Markdown editor with live preview for formulas ($x^2$, $$...$$) and tables
function MarkdownEditor({
  label,
  isMandatory = false,
  value,
  onChange,
  placeholder,
  error,
  height = 200,
  hideToolbar = false,
  className = "",
}) {
  return (
    <div className={className} data-color-mode="light">
      {label && (
        <div className="text-text mb-2 text-sm font-medium">
          {label}
          {isMandatory && <span className="text-error"> *</span>}
        </div>
      )}
      <div
        className={`overflow-hidden rounded-lg border ${
          error ? "border-error" : "border-border"
        }`}
      >
        <MDEditor
          value={value}
          onChange={(next) => onChange(next ?? "")}
          height={height}
          preview="live"
          hideToolbar={hideToolbar}
          visibleDragbar={false}
          textareaProps={{ placeholder }}
          previewOptions={{ remarkPlugins, rehypePlugins }}
        />
      </div>
      {error && <p className="text-error mt-1 ml-1 text-xs">{error}</p>}
    </div>
  );
}

export default MarkdownEditor;
