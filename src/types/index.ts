export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}
