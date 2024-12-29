// Navigation.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import BlogNavigation from "./BlogNavigation";

const meta: Meta<typeof BlogNavigation> = {
  title: "Widgets/BlogNavigation",
  component: BlogNavigation,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof BlogNavigation>;

// 기본 상태의 스토리
export const Default: Story = {};

// 사이드바가 닫힌 상태의 스토리
export const Closed: Story = {
  render: (args: any) => <BlogNavigation {...args} />,
  args: {
    initialOpen: false,
  },
};

// 다양한 최근 채팅을 렌더링하는 스토리
export const WithCustomRecentChats: Story = {
  render: (args: any) => <BlogNavigation {...args} />,
  args: {
    recentChats: ["Custom Chat 1", "Custom Chat 2", "Custom Chat 3", "Another Chat"],
  },
};
