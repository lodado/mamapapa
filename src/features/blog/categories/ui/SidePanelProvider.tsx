"use client";

import { contextBuildHelper, isMobile } from "@/shared";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CategoryContextType {
  expandedCategories: number[];
  toggleCategory: (categoryId: number) => void;

  isOpen: boolean;
  toggleSidePanel: () => void;
  onceToggled: boolean;
}

export const [CategoryContext, useCategoryContext] = contextBuildHelper<CategoryContextType>({ id: "CategoryContext" });

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [onceToggled, setOnceToggled] = useState(!isMobile());

  const toggleSidePanel = () => {
    if (!onceToggled) {
      setIsOpen(true);
    } else setIsOpen((prev) => !prev);

    setOnceToggled(true);
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <CategoryContext
      isOpen={isOpen}
      onceToggled={onceToggled}
      toggleSidePanel={toggleSidePanel}
      expandedCategories={expandedCategories}
      toggleCategory={toggleCategory}
    >
      {children}
    </CategoryContext>
  );
};
