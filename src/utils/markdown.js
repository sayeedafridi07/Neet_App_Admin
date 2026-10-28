import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// remark-math emits <code class="language-math math-inline|math-display">,
// so the sanitizer must keep those classes for KaTeX to find them
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes.code || []),
      ["className", "math-inline", "math-display", /^language-./],
    ],
  },
};

// Some saved questions are double-escaped (literal "\n", "\\frac").
// Fix newlines only outside math, since "\nu" / "\neq" are valid LaTeX,
// and collapse "\\cmd" to "\cmd" only inside math.
export const normalizeMarkdown = (text = "") =>
  text
    .split(/(\$\$[\s\S]*?\$\$|\$[^$]*\$)/)
    .map((part, i) =>
      i % 2
        ? part.replace(/\\\\(?=[a-zA-Z])/g, "\\")
        : part.replace(/(?:\\r)?\\n/g, "\n").replace(/\\t/g, "\t"),
    )
    .join("");

// Sanitize before KaTeX runs, so KaTeX's own markup isn't stripped
export const remarkPlugins = [remarkGfm, remarkMath];
export const rehypePlugins = [[rehypeSanitize, sanitizeSchema], rehypeKatex];
