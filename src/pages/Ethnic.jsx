import FilteredCategoryPage from './FilteredCategoryPage';

const BANNER = {
  src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80',
  tagline: 'Traditional & Modern',
  title: 'Ethnic Wear',
  subtitle: 'Timeless ethnic fashion for every celebration',
};

export default function Ethnic() {
  return <FilteredCategoryPage gender="Women" fixedMainCat="Ethnic" banner={BANNER} />;
}
