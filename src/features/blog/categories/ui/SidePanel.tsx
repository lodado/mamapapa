import React from "react";

import { AnimationRoot, ScrollArea } from "@/shared/ui";
import { BlogPost, Category } from "../models/entities/type";

import CategoryFoldButton from "./components/Category/CategoryFoldButton";
import CategoryFold from "./components/Category/CategoryFold";
import CategoryList from "./components/Category/CategoryList";
import SideFoldButton from "./components/SideFoldButton";
import SidePanelContainer from "./components/SidePanelContainer";

const SidePanel = ({ categories, blogPosts }: { categories: Category[]; blogPosts: BlogPost[] }) => {
  return (
    <>
      <SidePanelContainer>
        <>
          <h2 className="font-semibold text-lg mb-2 flex flex-row justify-between items-center px-2">
            Blog Categories <SideFoldButton />
          </h2>

          <ul>
            {categories.map((category) => (
              <li key={category.id + "cate"} className="mb-2">
                <AnimationRoot initial={false}>
                  <CategoryFoldButton key={category.id + "button"} category={category}>
                    {category.name}
                  </CategoryFoldButton>

                  <CategoryFold key={category.id + "fold"} category={category}>
                    {category.subcategories.map((subcategory) => (
                      <CategoryList key={subcategory + "sub"}>{subcategory}</CategoryList>
                    ))}
                  </CategoryFold>
                </AnimationRoot>
              </li>
            ))}
          </ul>
        </>
      </SidePanelContainer>
    </>
  );
};

export default SidePanel;
