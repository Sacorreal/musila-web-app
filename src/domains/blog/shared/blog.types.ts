export type BlogArticleStatus = 'draft' | 'published'

export interface BlogAuthorDto {
  id: string
  name: string
  role: string
  bio: string
  avatarUrl?: string | null
  avatarKey?: string | null
  slug: string
  createdAt: string
  updatedAt: string
}

export interface BlogTagDto {
  id: string
  name: string
  url: string
  icon: string
  createdAt: string
  updatedAt: string
}

export interface BlogArticleDto {
  id: string
  title: string
  slug: string
  excerpt: string
  contentMarkdown: string
  coverImageUrl?: string | null
  youtubeUrl?: string | null
  status: BlogArticleStatus
  publishedAt?: string | null
  readingTimeMinutes: number
  authors: BlogAuthorDto[]
  tags: BlogTagDto[]
  createdAt: string
  updatedAt: string
}

export interface CreateBlogAuthorInput {
  name: string
  role: string
  bio: string
  avatarUrl?: string
  avatarKey?: string
  slug?: string
}

export type UpdateBlogAuthorInput = Partial<CreateBlogAuthorInput>

export interface CreateBlogTagInput {
  name: string
  url: string
  icon: string
}

export type UpdateBlogTagInput = Partial<CreateBlogTagInput>

export interface CreateBlogArticleInput {
  title: string
  contentMarkdown: string
  excerpt?: string
  coverImageUrl?: string
  coverImageKey?: string
  youtubeUrl?: string
  status?: BlogArticleStatus
  authorIds: string[]
  tagIds: string[]
}

export type UpdateBlogArticleInput = Partial<CreateBlogArticleInput>

export interface BlogArticleAdminFilters {
  search?: string
  authorId?: string
  tagId?: string
  status?: BlogArticleStatus
  dateFrom?: string
  dateTo?: string
}

export interface BlogArticlePublicFilters {
  search?: string
  tagId?: string
  authorSlug?: string
}
