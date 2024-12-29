import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Dropdown from "./Dropdown";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Dropdown> = {
  title: "example/Dropdown",
  component: Dropdown,
  argTypes: {},
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const DropdownExample: Story = {
  args: {
    children: (
      <>
        <Dropdown>
          <Dropdown.Trigger className="w-max">
            trigger dropdown ! <ChevronDown />
          </Dropdown.Trigger>
          <Dropdown.Content className="w-[30rem]">
            <Label> Dropdown Content</Label>
            <Dropdown.Item>Item 1</Dropdown.Item>
            <Dropdown.Item>Item 2</Dropdown.Item>
            <Dropdown.Item>Item 3</Dropdown.Item>

            <Dropdown.Sub>
              <Dropdown.SubTrigger asChild>
                <Dropdown.Item>Item 4</Dropdown.Item>
              </Dropdown.SubTrigger>
              <Dropdown.Content isSub>
                <Dropdown.Item>Item 1</Dropdown.Item>
                <Dropdown.Item>Item 2</Dropdown.Item>
                <Dropdown.Item>Item 3</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Sub>
          </Dropdown.Content>
        </Dropdown>
      </>
    ),
  },
};

export const Template2 = () => (
  <Dropdown>
    <Dropdown.Trigger asChild>
      <button> select! </button>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Label>과일 선택</Dropdown.Label>
      <Dropdown.Item>사과</Dropdown.Item>
      <Dropdown.Item>바나나</Dropdown.Item>
      <Dropdown.Item>체리</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Label>채소 선택</Dropdown.Label>
      <Dropdown.Item>당근</Dropdown.Item>
      <Dropdown.Item>오이</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown>
);
