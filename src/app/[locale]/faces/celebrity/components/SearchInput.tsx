import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/shared/ui";

import { CELEBRITY_TUTORIAL_IDS } from "../configs/tutorialConstants";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const t = useTranslations("CELEBRITYFACES");

  return (
    <Input
      id={CELEBRITY_TUTORIAL_IDS.SEARCH_INPUT}
      aria-label={t("SEARCH_PLACEHOLDER")}
      placeholder={t("SEARCH_PLACEHOLDER")}
      value={value}
      setValue={onChange}
      className="pl-12"
      wrapperClassName="mb-6"
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2" aria-hidden width={18} height={18} />
    </Input>
  );
};
