export interface Database {
  public: {
    Tables: {
      stocks: {
        Row: {
          id: number;
          code: string;
          name: string;
          sector: string | null;
          market: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          name: string;
          sector?: string | null;
          market: string;
        };
        Update: {
          code?: string;
          name?: string;
          sector?: string | null;
          market?: string;
        };
      };
    };
  };
} 