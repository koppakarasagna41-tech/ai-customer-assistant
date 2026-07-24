export type ArticleCategory =
  | 'All'
  | 'Getting Started'
  | 'Billing & Subscription'
  | 'API & Integration'
  | 'Security & Compliance'
  | 'Troubleshooting'
  | 'Account Management';

export interface KBAuthor {
  name: string;
  avatarUrl?: string;
  role: string;
}

export interface KBArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown or Rich HTML content
  category: ArticleCategory;
  author: KBAuthor;
  readTime: string;
  views: number;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  featured?: boolean;
}

export interface KBCategorySummary {
  name: ArticleCategory;
  description: string;
  iconName: string;
  articleCount: number;
}

export interface KBArticleFilterParams {
  category?: string;
  search?: string;
  tag?: string;
  featured?: boolean;
}
