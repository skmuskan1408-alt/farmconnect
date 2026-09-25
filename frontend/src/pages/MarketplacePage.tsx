import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '../layouts/MainLayout';
import { ProductCard } from '../components/product/ProductCard';
import api from '../services/api';
import { Product, Category } from '../types';
import { Search, CheckCircle2, Filter, Sparkles } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (organicOnly) params.append('organic', 'true');
      if (sortBy) params.append('sortBy', sortBy);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, organicOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <MainLayout>
      <div className="env-marketplace min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-2xl mb-10 relative overflow-hidden border border-emerald-500/20">
            <div className="max-w-2xl relative z-10 space-y-3">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Direct Farm Marketplace
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Fresh Harvest Direct Marketplace
              </h1>
              <p className="text-sm text-slate-300 font-medium">
                Buy fresh produce direct from verified local farmers and FPOs at zero middleman markup.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-light-card p-6 rounded-3xl mb-8 space-y-6">
            
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tomatoes, potatoes, Alphonso mangoes, organic rice..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 focus:outline-none bg-white"
                >
                  <option value="newest">Sort by Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Produce
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    selectedCategory === cat.slug
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}

              <button
                onClick={() => setOrganicOnly(!organicOnly)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                  organicOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Organic Only</span>
              </button>
            </div>

          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-600 font-extrabold text-sm">Fetching fresh harvest items...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-light-card rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <span className="text-5xl">🌾</span>
              <h3 className="text-lg font-black text-slate-900">No produce items match your search.</h3>
              <p className="text-xs text-slate-500">Try clearing filters or searching for different crops.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};
