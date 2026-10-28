import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import {
  normalizeMarkdown,
  rehypePlugins,
  remarkPlugins,
} from "../../utils/markdown";

// Renders markdown with GFM tables and $inline$ / $$block$$ math
function MarkdownRenderer({ children, className = "" }) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {normalizeMarkdown(children ?? "")}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
