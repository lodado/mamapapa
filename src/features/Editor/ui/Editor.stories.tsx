import type { Meta, StoryObj } from "@storybook/react";
import EditorRoot from "./Editor";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof EditorRoot> = {
  title: "Features/Editor",
  component: EditorRoot,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof EditorRoot>;

export const EditorExample = () => {
  return (
    <EditorRoot>
      <EditorRoot.Editor />
    </EditorRoot>
  );
};
