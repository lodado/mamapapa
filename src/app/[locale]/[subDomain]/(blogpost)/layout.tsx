import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";
import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
import { BlogPost, Category } from "@/features/blog/categories/models/entities/type";
import SideFoldButton from "@/features/blog/categories/ui/components/SideFoldButton";
import SidePanel from "@/features/blog/categories/ui/SidePanel";
import { CategoryProvider } from "@/features/blog/categories/ui/SidePanelProvider";
import { GetDomainByUserIdUseCase } from "@/features/blog/domain/models";
import CreateBlogPostLink from "@/features/blog/domain/ui/CreateBlogPostLink.server";
import { ServerLocaleLink } from "@/shared/ui/index.server";

import Navigation from "@/widgets/Navigation/ui/Navigation";
import { SquarePen } from "lucide-react";

import React, { PropsWithChildren } from "react";

const categories: Category[] = [
  { id: 1, name: "Travel", subcategories: ["Adventure", "City Breaks", "Beach Holidays"] },
  { id: 2, name: "Food", subcategories: ["Recipes", "Restaurant Reviews", "Cooking Tips"] },
  { id: 3, name: "Lifestyle", subcategories: ["Home Decor", "Relationships", "Work-Life Balance"] },
];

const blogPosts: BlogPost[] = [
  { id: 11, categoryName: "Travel", title: "Top 10 Adventure Destinations" },
  { id: 222, categoryName: "Travel", title: "City Break: 48 Hours in Paris" },
  { id: 333, categoryName: "Food", title: "Easy 30-Minute Dinner Recipes" },
  { id: 4444, categoryName: "Food", title: "Best Pizza Places in New York" },
  { id: 55555, categoryName: "Lifestyle", title: "Minimalist Home Decor Ideas" },
];

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full page-content">
      <CategoryProvider>
        <Navigation.Root>
          <Navigation.Header mobileChildren={<SideFoldButton />} />
          <Navigation.Body />
          <Navigation.Footer authRepository={new EDGE_DI_REPOSITORY.Auth()}>
            <>
              <CreateBlogPostLink />
            </>
          </Navigation.Footer>
        </Navigation.Root>
        <div className="relative w-full flex flex-row grow-0 shrink-0 h-full">
          <SidePanel categories={categories} blogPosts={blogPosts} />
          {children}
        </div>
      </CategoryProvider>
    </div>
  );
};

export default Layout;
