import { useState, useEffect } from 'react';
import api from '../utils/api';

let _cache = null;
let _promise = null;

// Returns array of category name strings that have at least one product.
// Returns null while loading, [] if none/error.
export function useActiveCategories() {
  const [data, setData] = useState(_cache);

  useEffect(() => {
    if (_cache !== null) { setData(_cache); return; }
    if (!_promise) {
      _promise = api.get('/api/products/categories')
        .then((r) => { _cache = r.data || []; return _cache; })
        .catch(() => { _cache = []; return _cache; });
    }
    _promise.then((cats) => setData(cats));
  }, []);

  return data;
}
