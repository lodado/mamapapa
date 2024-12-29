import type { Meta } from "@storybook/react";

import QueryContainer from "./QueryContainer";
import RefetchContainer from "./RefetchContainer";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof QueryContainer> = {
  title: "example/TanstackQuery/QueryContainer",
  component: QueryContainer,
  argTypes: {},
  tags: ["autodocs"],
};

export default meta;

let data = 0;

const ResponseComponent = ({ response }: { response?: string; queryKey?: string }) => {
  return (
    <>
      <RefetchContainer>
        <button type="button">refetch</button>
      </RefetchContainer>

      {response}
    </>
  );
};

const QUERY_KEY = "GET_CARDS";

export const QueryContainerExample = () => {
  return (
    <QueryContainer
      queryKey={QUERY_KEY}
      queryFn={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
            data += 1;
          }, 1500);
        })
      }
      variables={{ example1: 2, example2: 3 }}
      loadingComponent={<div>loading</div>}
      errorComponent={
        <RefetchContainer>
          <div>error</div>
        </RefetchContainer>
      }
      queryOptions={{}}
    >
      <ResponseComponent />
    </QueryContainer>
  );
};
