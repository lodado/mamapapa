"use client";

import React, { ReactNode } from "react";
import { useCategoryContext } from "../../SidePanelProvider";
import { Button } from "@/shared/ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "../../../models/entities/type";

const CategoryFoldButton = ({ children, category }: { children: ReactNode; category: Category }) => {
  const { expandedCategories, toggleCategory } = useCategoryContext();

  return (
    <Button variant="text" className="w-full justify-start font-medium" onClick={() => toggleCategory(category.id)}>
      {expandedCategories.includes(category.id) ? (
        <ChevronDown className="mr-2 h-4 w-4" />
      ) : (
        <ChevronRight className="mr-2 h-4 w-4" />
      )}
      {children}
    </Button>
  );
};

export default CategoryFoldButton;
