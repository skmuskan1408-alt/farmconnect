import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ProductCard } from '../components/product/ProductCard';
import api from '../services/api';
import { Product, Category } from '../types';
import { Search, Filter, SlidersHorizontal, RefreshCw, CheckCircle2 } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLocation) params.append('location', selectedLocation);
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
      <div className="bg-[#f8faf9] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="bg-agri-dark text-white p-8 sm:p-10 rounded-3xl shadow-xl mb-10 relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="bg-agri-primary text-agri-accent text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                Direct Agricultural Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                Fresh Produce Directly From Indian Farmers
              </h1>
              <p className="text-sm text-agri-pale/80 mt-2 font-medium">
                No middlemen, transparent prices, guaranteed farm origin and high quality.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-6">
            
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search produce (e.g. Tomatoes, Onions, Alphonso Mangoes, Rice)..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm font-medium"
                />
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_low">Sort: Price Low to High</option>
                  <option value="price_high">Sort: Price High to Low</option>
                  <option value="rating">Sort: Highest Rating</option>
                </select>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all shadow-md"
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
                    ? 'bg-agri-dark text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                      ? 'bg-agri-dark text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    ? 'bg-agri-primary text-white border-agri-primary shadow'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-agri-accent" />
                <span>Organic Only</span>
              </button>
            </div>

          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-bold text-sm">Fetching fresh farm produce...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <span className="text-4xl">🌾</span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">No Produce Found</h3>
              <p className="text-xs text-gray-500 mt-1">Try relaxing your search terms or filters.</p>
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
