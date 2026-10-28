import { setRequestLocale } from "next-intl/server";

import OfflineDemo from "./OfflineDemo";

const OfflineDemoPage = ({ params }: { params: { locale: string } }) => {
  setRequestLocale(params.locale);

  return <OfflineDemo />;
};

export default OfflineDemoPage;
