import { Button } from "@/shared/ui";
import { ReactiveLayout } from "@/shared/ui/ReactiveLayout";
import React from "react";

import BodySvg from "./BODY.svg";
import HeadSvg from "./HEAD.svg";
import { Motion } from "@/shared/ui/animation/animation";

const page = () => {
  return (
    <ReactiveLayout>
      <main className="flex flex-col justify-center items-center w-full h-full pt-[2.5rem] px-[2rem]">
        <div className="relative flex flex-col items-center mb-6">
          <Motion
            style={{ position: "absolute", willChange: "transform" }}
            componentType="div"
            initial={{ y: -32 }}
            animate={{ y: [-32, -40] }}
            transition={{
              type: "spring",
              stiffness: 300, // 스프링 강도를 증가시켜 더 빠르게 이동
              damping: 15, // 감쇠 계수를 낮춰 통통 튀는 효과
              duration: 0.01, // 키프레임 전환 시간을 짧게 설정
              repeat: Infinity,
              repeatType: "mirror",
              repeatDelay: 0, // 반복 간의 지연 시간을 제거
            }}
          >
            <HeadSvg />
          </Motion>
          <BodySvg />
        </div>

        <h1 className="display-1 flex flex-row justify-center mb-2 w-full text-text-01 items-center">
          닮은꼴 비교를 시작해보세요
        </h1>

        <div className="body-2 text-text-03 flex flex-col mb-4 w-full items-center ">
          <p>닮은꼴 비교를 위한 사진을 업데이트를 하고 닮은꼴 비교를 진행해보세요.</p>
          <p>누구를 더 닮았는지 확인해볼 수 있습니다.</p>
        </div>
      </main>
      <nav className="flex flex-col w-full max-w-[29rem] md:w-[768px] gap-3 h-[12.5rem] p-6 fixed bottom-0 mb-[var(--safe-area-bottom)] ">
        <Button variant="solid">닮은꼴 비교 시작하기</Button>
        <Button variant="line">닮은꼴 진행 내역 확인하기</Button>
      </nav>
    </ReactiveLayout>
  );
};

export default page;
