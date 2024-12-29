import MarkdownIt from "markdown-it";

const generateMarkdownParser = () => {
  return MarkdownIt("commonmark", { html: false });
};

export default generateMarkdownParser;
