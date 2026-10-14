/**
 * Parse lines of a hyprbinds.conf, extracting comments, item labels, and bind entries.
 */
export function parseHyprBinds(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.match(/^bind\s*=/) || line.match(/^#\s*/))
    .map((line) => {
      if (line.startsWith("##")) {
        const label = line.replace(/^##\s*/, "");
        return { type: "itemLabel", label, raw: line };
      }
      if (line.startsWith("#")) {
        const comment = line.replace(/^#\s*/, "");
        return { type: "comment", comment, raw: line };
      }
      // Remove 'bind =' and split by comma
      const parts = line
        .replace(/^bind\s*=\s*/, "")
        .split(",")
        .map((s) => s.trim());
      // mod(s) can be space separated
      const mod = parts[0] ? parts[0].split(/\s+/).filter(Boolean) : [];
      const key = parts[1] || "";
      const dispatcher = parts[2] || "";
      // Parameter: everything after the third comma, joined and trimmed, or None
      let parameter: string | null = null;
      if (parts.length > 3) {
        parameter = parts.slice(3).join(", ").replace(/#.*/, "").trim();
        if (parameter === "") parameter = null;
      }
      return { type: "bind", mod, key, dispatcher, parameter, raw: line };
    });
} 