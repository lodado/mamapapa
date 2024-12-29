"use client";

import React, { PropsWithChildren } from "react";
import { Category } from "../../../models/entities/type";
import { useCategoryContext } from "../../SidePanelProvider";
import { Motion } from "@/shared/ui";
import { AnimatePresence } from "framer-motion";

const CategoryFold = ({ children, category }: PropsWithChildren & { category: Category }) => {
  const { expandedCategories } = useCategoryContext();

  return (
    <>
      {!expandedCategories.includes(category.id) && (
        <Motion
          type="ul"
          className="ml-4 mt-1 overflow-hidden"
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          style={{ originY: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </Motion>
      )}
    </>
  );
};

export default CategoryFold;
