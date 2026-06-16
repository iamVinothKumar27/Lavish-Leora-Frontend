import FilteredCategoryPage from './FilteredCategoryPage';

const BANNER = {
  src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1920&q=80',
  tagline: 'For Her',
  title: "Women's Collection",
  subtitle: 'Elegant pieces for every occasion',
};

export default function Women() {
  return <FilteredCategoryPage gender="Women" banner={BANNER} />;
}
