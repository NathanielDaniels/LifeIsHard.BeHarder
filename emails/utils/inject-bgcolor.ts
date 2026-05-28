export function injectBgcolor(html: string): string {
  return html.replace(
    /<(table|td|body)(\s[^>]*?)style="([^"]*?)background-color:\s*(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))(;[^"]*?|)"([^>]*?)>/gi,
    (match, tag, before, styleBefore, color, styleAfter, after) => {
      if (match.toLowerCase().includes("bgcolor")) return match;
      const hex =
        color.length === 4
          ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
          : color.length === 9
            ? color.slice(0, 7)
            : color;
      return `<${tag}${before}bgcolor="${hex}" style="${styleBefore}background-color:${color}${styleAfter}"${after}>`;
    },
  );
}
