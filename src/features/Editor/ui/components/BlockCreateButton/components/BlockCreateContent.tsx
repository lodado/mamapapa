import { Dropdown, Input } from "@/shared/ui";
import React, { PropsWithChildren } from "react";

const BlockCreateItem = ({ children }: PropsWithChildren) => {
  return (
    <Dropdown.Item className="flex items-center justify-between body-01-r">
      <div className="flex flex-row items-center gap-1 text-text-01">
        {/*<ImageRoundedIcon  width="20px" height="20px" /> */}
        <div className="text-cancel-default" role="none presentation" aria-hidden={false} />
        {children}
      </div>

      <div className="flex flex-row gap-[10px] items-center">
        <span className="text-text-04">Shortcut Text</span>

        {/*ChevronRightRoundedIcon  width="20px"
          height="20px" */}
        <div className="text-secondary-default" role="none presentation" aria-hidden={false} />
      </div>
    </Dropdown.Item>
  );
};

export const BlockCreateContent = ({ children }: PropsWithChildren) => {
  return (
    <Dropdown.Content className="flex ml-[60px]">
      <Input placeholder="example" />

      <h5 className="h-4 px-2 item-center body-01-r text-text-02">Section Header</h5>

      {children}
    </Dropdown.Content>
  );
};

BlockCreateContent.Item = BlockCreateItem;
