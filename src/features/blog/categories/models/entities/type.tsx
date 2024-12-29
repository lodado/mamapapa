export interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

export interface BlogPost {
  id: number;
  categoryName: string;
  title: string;
}

export interface CategoryListProps {
  categories: Category[];
  blogPosts: BlogPost[];
}
