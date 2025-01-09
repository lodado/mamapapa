import { Button, ScrollLock } from "@/shared/ui";

import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import React from "react";

const page = () => {
  return (
    <ScrollLock>
      <ReactiveLayout>
        <main className="flex overscroll-none flex-col justify-center items-center w-full h-full pt-[2.5rem] px-[2rem]">
          <div>다영이 닯은 귀여운애</div>

          <h1 className="display-1 flex flex-row justify-center mb-2 w-full text-text-01 items-center">
            닮은꼴 비교를 시작해보세요
          </h1>

          <div className="body-2 text-text-03 flex flex-col mb-4 w-full items-center ">
            <p className="flex w-full justify-center text-center items-center">
              닮은꼴 비교를 위한 사진을 업데이트를 하고 닮은꼴 비교를 진행해보세요.
            </p>
            <p className="flex w-full justify-center text-center items-center">
              누구를 더 닮았는지 확인해볼 수 있습니다.
            </p>
          </div>
        </main>
        <nav className="flex flex-col w-full max-w-[29rem] md:w-[768px] gap-3 h-[12.5rem] p-6 fixed bottom-0 mb-[var(--safe-area-bottom)] ">
          <Button variant="solid">닮은꼴 비교 시작하기</Button>
          <Button variant="line">닮은꼴 진행 내역 확인하기</Button>
        </nav>
      </ReactiveLayout>
    </ScrollLock>
  );
};

export default page;
