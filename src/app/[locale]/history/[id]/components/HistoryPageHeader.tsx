"use client";

import { ChevronLeft, Ellipsis } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import Delete from "/public/delete.svg";
import SimminIcon from "/public/SimminIcon.svg";
import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { Header } from "@/features";
import { timestampToTimeFormat } from "@/shared";
import { Button, Dropdown } from "@/shared/ui";

import RemoveCommentDialog from "../../components/RemoveHisoryDialog";
import UpdateHistoryTitleDialog from "../../components/UpdateHistoryTitleDialog";

const HistoryPageHeader = ({
  creatorUserId,
  title,
  updatedAt,
}: {
  creatorUserId?: string;
  title: string;
  updatedAt: string;
}) => {
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const { session } = useAuthStore();

  const isOwner = creatorUserId === session?.user?.id;
  const router = useRouter();
  const { id } = useParams();

  return (
    <>
      <div className="z-header fixed w-full md:w-[768px] top-0 bg-background-op-01 border-b border-b-solid border-b-border-02">
        <>
          <Header className="z-header w-full md:w-[768px] h-[2.75rem] fixed top-0 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <Button
                variant="link"
                type="button"
                className="py-[11px] px-2 text-text-primary flex flex-row items-center gap-1"
                onClick={() => {
                  router.back();
                }}
              >
                <ChevronLeft width={20} height={24} strokeWidth={3} />
                <SimminIcon />
              </Button>

              <div className="h-full flex flex-col items-start">
                <h1 className="head-3 text-text-01">{title}</h1>
                <span className="text-text-03 caption-2">{timestampToTimeFormat(new Date(updatedAt))}</span>
              </div>
            </div>

            {isOwner && (
              <Dropdown>
                <Dropdown.Trigger
                  variant={"outline"}
                  key="dropdown-trigger"
                  className="flex justify-center items-center mr-4 p-0 w-[28px] h-[28px]"
                  doesArrowNeed={false}
                >
                  <Ellipsis className="text-[var(--Text-Primary)]" strokeWidth={2} size={20} />
                </Dropdown.Trigger>
                <Dropdown.Content className="w-full" align="end">
                  <Dropdown.Item
                    key={"rename-history"}
                    onClick={() => {
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    제목 변경하기
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={"remove-item"}
                    onClick={() => {
                      setIsRemoveDialogOpen(true);
                    }}
                  >
                    <Delete /> 삭제하기
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown>
            )}
          </Header>
          <div className="w-full h-[4rem] flex-shrink-0" role="none presentation" />
        </>
      </div>

      <RemoveCommentDialog
        id={id as string}
        isVisible={isRemoveDialogOpen}
        onChangeVisible={setIsRemoveDialogOpen}
        onAfterSubmit={() => {
          router.push(PAGE_ROUTE.MAIN);
        }}
      />
      <UpdateHistoryTitleDialog
        previousTitle={title}
        isVisible={isUpdateDialogOpen}
        onChangeVisible={setIsUpdateDialogOpen}
      />
    </>
  );
};

export default HistoryPageHeader;
