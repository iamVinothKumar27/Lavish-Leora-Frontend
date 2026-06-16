import FilteredCategoryPage from './FilteredCategoryPage';

const BANNER = {
  src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1920&q=80',
  tagline: 'K-Fashion',
  title: 'Korean Wear',
  subtitle: 'Trendy Korean styles curated just for you',
};

export default function Korean() {
  return <FilteredCategoryPage gender="Women" fixedMainCat="Korean" banner={BANNER} />;
}
