export type PageType = "signin" | "signup";
export interface AuthPageProps {
  handlePageChange?: (pageType: PageType) => void;
}
