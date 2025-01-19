import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useLoadingStore } from "../models/loadingStore";

export default {
  title: "shared/LoadingSpinner",
  component: LoadingSpinner,
};

const Template = (args: any) => {
  const { setLoading } = useLoadingStore();

  React.useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  return <LoadingSpinner />;
};

export const Default = Template.bind({});
