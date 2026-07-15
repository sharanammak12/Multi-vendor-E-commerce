import { useSearchParams } from "react-router-dom";
import ProductsByCategory from "./ProductsByCategory";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q");

  return <ProductsByCategory searchQuery={query} />;
};

export default SearchResults;
