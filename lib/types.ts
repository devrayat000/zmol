// Database types
export interface UrlData {
  id: number;
  originalUrl: string;
  shortCode: string;
  title: string | null;
  description: string | null;
  clicks: number;
  isCustom: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClickData {
  id: number;
  urlId: number;
  userAgent: string | null;
  referer: string | null;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  clickedAt: Date;
}

// Analytics types
export interface ClickStats {
  date: string;
  count: number;
}

export interface UrlStats {
  url: UrlData;
  clickStats: ClickStats[];
}

// Form types
export interface FormState {
  success: boolean;
  message: string;
  data?: {
    shortCode?: string;
    existing?: boolean;
  };
}

// Dashboard types
export interface DatabaseStats {
  totalUrls: number;
  totalClicks: number;
  recentUrls: number;
}

// API types
export type ActionResult = FormState;

// Component prop types
export interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export interface CopyButtonProps {
  text: string;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
