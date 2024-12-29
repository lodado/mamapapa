// Button.stories.tsx
import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import TestIcon from "./TestIcon";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    size: "medium",
  },
  parameters: {
    docs: {
      description: {
        component: `
 
\`\`\`jsx
 
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * ## Basic Usage
 */
export const BasicButton: Story = {
  args: {
    children: "text",
  },
};

/**
 * ## Props
 *
 * 컨트롤은 Storybook에서 자동으로 생성됩니다.
 */

/**
 * ## Button With Left Icon
 *
 * 버튼 텍스트의 왼쪽에 아이콘을 추가하는 방법
 */
export const ButtonWithLeftIcon: Story = {
  args: {
    children: "text",
    LeftIcon: <TestIcon />,
  },
};

/**
 * ## Button With Right Icon
 *
 * 마찬가지로, 버튼 텍스트의 오른쪽에 아이콘을 추가하는 방법:
 */
export const ButtonWithRightIcon: Story = {
  args: {
    children: "text",
    RightIcon: <TestIcon />,
  },
};
