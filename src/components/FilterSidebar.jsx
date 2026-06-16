import { useState } from 'react';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-3 hover:text-gray-700 transition-colors"
      >
        {title}
        <span className="text-base leading-none text-gray-300">{open ? '−' : '+'}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 accent-primary-600 flex-shrink-0 cursor-pointer"
      />
      <span className={`text-sm flex-1 transition-colors ${checked ? 'text-primary-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
        {label}
      </span>
    </label>
  );
}

// genders  — array of gender strings from backend e.g. ['Women', 'Men'] (optional)
// fixedMainCat — locked main cat e.g. 'Korean' (optional)
// available — { mainCats, subCats, childCats, sizes, colors }
// filters   — { gender, mainCat, subCategories, childCategories, minPrice, maxPrice, sizes, colors, sort }
function SidebarBody({ genders, available, fixedMainCat, filters, onChange, onClear }) {
  const { mainCats = [], subCats = [], childCats = [], sizes = [], colors = [] } = available || {};
  const {
    gender = '',
    mainCat = '',
    subCategories = [],
    childCategories = [],
    minPrice = '',
    maxPrice = '',
    sizes: selSizes = [],
    colors: selColors = [],
    sort = 'newest',
  } = filters;

  const toggle = (arr, val) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const activeCount = [
    genders?.length && gender ? 1 : 0,
    !fixedMainCat && mainCat ? 1 : 0,
    subCategories.length,
    childCategories.length,
    selSizes.length,
    selColors.length,
    minPrice ? 1 : 0,
    maxPrice ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="w-56">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-800 tracking-wide flex items-center gap-2">
          Filters
          {activeCount > 0 && (
            <span className="text-[11px] bg-primary-600 text-white px-1.5 py-0.5 rounded-full leading-none">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs text-primary-600 hover:underline font-medium">
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort By" defaultOpen>
        {[
          { v: 'newest', l: 'Newest First' },
          { v: 'price-asc', l: 'Price: Low → High' },
          { v: 'price-desc', l: 'Price: High → Low' },
        ].map(({ v, l }) => (
          <label key={v} className="flex items-center gap-2.5 py-1 cursor-pointer group">
            <input
              type="radio"
              name="ll-sort"
              checked={sort === v}
              onChange={() => onChange('sort', v)}
              className="w-4 h-4 accent-primary-600 cursor-pointer"
            />
            <span className={`text-sm transition-colors ${sort === v ? 'text-primary-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
              {l}
            </span>
          </label>
        ))}
      </Section>

      {/* Gender — only shown on All Products page */}
      {genders?.length > 0 && (
        <Section title="Gender">
          {genders.map((g) => (
            <Check
              key={g}
              label={g}
              checked={gender === g}
              onChange={() => onChange('gender', gender === g ? '' : g)}
            />
          ))}
        </Section>
      )}

      {/* Main Category — not shown when fixedMainCat is set */}
      {!fixedMainCat && mainCats.length > 0 && (
        <Section title="Category">
          {mainCats.map((cat) => (
            <Check
              key={cat}
              label={cat}
              checked={mainCat === cat}
              onChange={() => onChange('mainCat', mainCat === cat ? '' : cat)}
            />
          ))}
        </Section>
      )}

      {/* Sub Category */}
      {subCats.length > 0 && (
        <Section title="Sub Category">
          {subCats.map((sc) => (
            <Check
              key={sc}
              label={sc}
              checked={subCategories.includes(sc)}
              onChange={() => onChange('subCategories', toggle(subCategories, sc))}
            />
          ))}
        </Section>
      )}

      {/* Child Category */}
      {childCats.length > 0 && (
        <Section title="Type">
          {childCats.map((cc) => (
            <Check
              key={cc}
              label={cc}
              checked={childCategories.includes(cc)}
              onChange={() => onChange('childCategories', toggle(childCategories, cc))}
            />
          ))}
        </Section>
      )}

      {/* Price Range */}
      <Section title="Price Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 transition-colors"
          />
          <span className="text-gray-400 text-sm flex-shrink-0">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
        {(minPrice || maxPrice) && (
          <p className="text-xs text-primary-600 mt-1.5">
            ₹{minPrice || '0'} – {maxPrice ? `₹${maxPrice}` : 'Any'}
          </p>
        )}
      </Section>

      {/* Size */}
      {sizes.length > 0 && (
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => onChange('sizes', toggle(selSizes, sz))}
                className={`px-3 py-1 rounded-lg border-2 text-xs font-medium transition-all ${
                  selSizes.includes(sz)
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <Section title="Color">
          {colors.map((col) => (
            <Check
              key={col}
              label={col}
              checked={selColors.includes(col)}
              onChange={() => onChange('colors', toggle(selColors, col))}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

export default function FilterSidebar({ genders, available, fixedMainCat, filters, onChange, onClear, isOpen, onClose }) {
  return (
    <>
      {/* Desktop — sticky left column */}
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-card p-5 max-h-[calc(100vh-116px)] overflow-y-auto">
          <SidebarBody
            genders={genders}
            available={available}
            fixedMainCat={fixedMainCat}
            filters={filters}
            onChange={onChange}
            onClear={onClear}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col shadow-xl">
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900 text-sm">Filters</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center">
                  ×
                </button>
              </div>
              <SidebarBody
                genders={genders}
                available={available}
                fixedMainCat={fixedMainCat}
                filters={filters}
                onChange={onChange}
                onClear={onClear}
              />
            </div>
            <div className="border-t border-gray-100 px-5 py-4 bg-white">
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
