export default function CategorySelector({ categories, values, onChange }) {
  const { category: gender, subcategory: mainCat, subCategory, childCategory } = values;

  const selectedSubs = Array.isArray(subCategory) ? subCategory : (subCategory ? [subCategory] : []);
  const selectedChildren = Array.isArray(childCategory) ? childCategory : (childCategory ? [childCategory] : []);

  const genders = [...new Set(categories.map((c) => c.gender))].sort();
  const mainCats = categories.filter((c) => c.gender === gender);
  const selectedMainCat = mainCats.find((c) => c.name === mainCat);
  const subCats = selectedMainCat?.children || [];

  // Union of child categories from all selected sub categories
  const childCats = selectedSubs.flatMap(
    (name) => subCats.find((c) => c.name === name)?.children || []
  );

  const showSubCat = subCats.length > 0 || selectedSubs.length > 0;
  const showChildCat = childCats.length > 0 || selectedChildren.length > 0;

  const toggleSub = (name) => {
    const updated = selectedSubs.includes(name)
      ? selectedSubs.filter((x) => x !== name)
      : [...selectedSubs, name];
    // Reset child when sub changes since valid child options may change
    onChange({ ...values, subCategory: updated, childCategory: [] });
  };

  const toggleChild = (name) => {
    const updated = selectedChildren.includes(name)
      ? selectedChildren.filter((x) => x !== name)
      : [...selectedChildren, name];
    onChange({ ...values, childCategory: updated });
  };

  // Legacy values not present in current tree (preserved so old products don't lose data)
  const legacySubs = selectedSubs.filter((v) => !subCats.find((c) => c.name === v));
  const legacyChildren = selectedChildren.filter((v) => !childCats.find((c) => c.name === v));

  return (
    <div className="space-y-4">
      {/* Gender + Main Category row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gender *</label>
          <select
            value={gender}
            onChange={(e) =>
              onChange({ category: e.target.value, subcategory: '', subCategory: [], childCategory: [] })
            }
            required
            className="input-field"
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Main Category</label>
          <select
            value={mainCat}
            onChange={(e) =>
              onChange({ ...values, subcategory: e.target.value, subCategory: [], childCategory: [] })
            }
            disabled={!gender}
            className="input-field"
          >
            <option value="">Select category</option>
            {mainCats.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
            {mainCat && !mainCats.find((c) => c.name === mainCat) && (
              <option value={mainCat}>{mainCat}</option>
            )}
          </select>
        </div>
      </div>

      {/* Sub Category — multi-select pill checkboxes */}
      {showSubCat && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Sub Category
            {selectedSubs.length > 0 && (
              <span className="ml-2 text-xs text-primary-600 font-normal">
                {selectedSubs.length} selected
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {subCats.map((c) => {
              const active = selectedSubs.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleSub(c.name)}
                  className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                    active
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  {active && <span className="mr-1 text-xs">✓</span>}
                  {c.name}
                </button>
              );
            })}
            {legacySubs.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggleSub(v)}
                className="px-3 py-1.5 rounded-full border-2 border-primary-600 bg-primary-600 text-white text-sm font-medium"
              >
                <span className="mr-1 text-xs">✓</span>{v}
              </button>
            ))}
          </div>
          {selectedSubs.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">Selected: {selectedSubs.join(', ')}</p>
          )}
        </div>
      )}

      {/* Child Category — multi-select pill checkboxes */}
      {showChildCat && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Child Category
            {selectedChildren.length > 0 && (
              <span className="ml-2 text-xs text-primary-600 font-normal">
                {selectedChildren.length} selected
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {childCats.map((c) => {
              const active = selectedChildren.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleChild(c.name)}
                  className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                    active
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  {active && <span className="mr-1 text-xs">✓</span>}
                  {c.name}
                </button>
              );
            })}
            {legacyChildren.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggleChild(v)}
                className="px-3 py-1.5 rounded-full border-2 border-primary-600 bg-primary-600 text-white text-sm font-medium"
              >
                <span className="mr-1 text-xs">✓</span>{v}
              </button>
            ))}
          </div>
          {selectedChildren.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">Selected: {selectedChildren.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
}
