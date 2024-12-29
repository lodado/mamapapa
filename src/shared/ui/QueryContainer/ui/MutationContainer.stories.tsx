import type { Meta } from "@storybook/react";

import MutationContainer from "./MutationContainer";
import QueryContainer from "./QueryContainer";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof QueryContainer> = {
  title: "example/TanstackQuery/MutationContainer",
  component: QueryContainer,
  argTypes: {},
  tags: ["autodocs"],
};

export default meta;

let data = 0;

const RequestComponent = ({ response, action }: { response?: string; action?: () => void }) => {
  return (
    <>
      <div>12321</div>
      <button type="button" onClick={action}>
        request
      </button>

      {response}
    </>
  );
};

export const MutationContainerExample = () => {
  return (
    <MutationContainer
      mutationFn={() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
            data += 1;
          }, 1000);
        });
      }}
      errorComponent={<div>error</div>}
      loadingComponent={<div>loading</div>}
    >
      <RequestComponent />
    </MutationContainer>
  );
};
