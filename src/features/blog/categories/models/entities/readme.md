
# Database Schema Documentation

This document provides an overview of the database schema, including table definitions and relationships for the blog and category management system.

## Table Descriptions and Relationships

### 1. `categories`

- Stores information about main blog categories.
- Fields:
  - `id` (PK): Unique identifier for each category.
  - `name` (UNIQUE): Name of the category.

```
id name
1 Travel
2 Food
3 Lifestyle
4 Fashion & Beauty
5 Health & Fitness
6 Hobbies & Leisure
7 Self-Development
8 Finance
```

### 2. `subcategories`

- Stores information about subcategories that fall under main categories.
- Fields:
  - `id` (PK): Unique identifier for each subcategory.
  - `categoryId`: Foreign key referencing `categories.id`.
  - `name`: Name of the subcategory.
  - `userId`: ID of the user who created the subcategory.

### 3. `blogPosts`

- Stores individual blog post details.
- Fields:
  - `id` (PK): Unique identifier for each blog post.
  - `contentId`: Content of the blog post Id (reference mongoDB)
  - `userId`: ID of the user who authored the blog post.
  - `categoryId`: Foreign key referencing `categories.name` to indicate the category of the blog post.
  - `subCategoryId`: Foreign key referencing `subcategories.name` to indicate the category of the blog post.
  - `createdAt`: Timestamp indicating when the post was created.

### 4. `categoryCounts`

- Stores the count of posts within each category.
- Fields:
  - `id` (PK): Unique identifier for each record.
  - `categoryId`: Foreign key referencing `categories.name`.
  - `postCount`: Number of posts within the category.
  - `updatedAt`: Timestamp indicating when the count was last updated.

### 5. `subCategoryCounts`

- Stores the count of posts within each category.
- Fields:
  - `id` (PK): Unique identifier for each record.
  - `subCategoryId`: Foreign key referencing `categories.name`.
  - `postCount`: Number of posts within the category.
  - `userId`: ID of the user who authored the blog post.
  - `updatedAt`: Timestamp indicating when the count was last updated.

## Entity-Relationship Diagram (ERD)

```plaintext
┌───────────────┐       ┌───────────────┐       ┌───────────────┐       ┌──────────────────┐
│  categories   │       │ subcategories │       │   blogPosts   │       │  categoryCounts  │
├───────────────┤       ├───────────────┤       ├───────────────┤       ├──────────────────┤
│ id (PK)       │◄──────│ id (PK)       │       │ id (PK)       │       │ id (PK)          │
│ name (UNIQUE) │──────►│ categoryId    │──────►│ categoryId    │──────>│ categoryId       │
└───────────────┘       │ name          │       │ content       │       │ postCount        │
                        │ userId        │       │ authorId      │       │ updatedAt        │
                        └───────────────┘       │ createdAt     │       │                  │
                                                │               │       └──────────────────┘
                                                └───────────────┘
```
