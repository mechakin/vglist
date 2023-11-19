export type Game = {
  id: number;
  updated_at: number;
  cover?: {
    id: number;
    url: string;
  };
  name: string;
  first_release_date?: number;
  summary?: string;
  rating?: number;
  rating_count?: number;
  slug: string;
};

export type PrismaGame = {
  id: number;
  igdbUpdatedAt: number;
  cover?: string;
  name: string;
  releaseDate?: number;
  summary?: string;
  igdbRating?: number;
  igdbRatingCount?: number;
  slug: string;
};

export type AccessTokenData = {
  access_token: string;
  expires_in: number;
  token_type: string;
};
