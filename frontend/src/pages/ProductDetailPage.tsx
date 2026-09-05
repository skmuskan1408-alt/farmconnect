import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { PriceComparisonWidget } from '../components/product/PriceComparisonWidget';
import { DemandForecastWidget } from '../components/forecast/DemandForecastWidget';
import api from '../services/api';
import { Product, PriceComparison } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Star,
  CheckCircle2,
  ShoppingCart,
  Zap,
  User,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [comparison, setComparison] = useState<PriceComparison | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        setComparison(res.data.priceComparison);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product!.id, quantity);
      alert(`Added ${quantity} ${product?.unit} of ${product?.name} to your cart!`);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-gray-700">Loading Produce Details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <Link to="/marketplace" className="inline-block mt-4 text-agri-primary font-bold">Return to Marketplace</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#f8faf9] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-agri-dark mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left: Product Media & Farmer Details */}
            <div className="space-y-8">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                {product.organic && (
                  <div className="absolute top-4 left-4 bg-agri-dark text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-agri-accent" /> Verified Organic Harvest
                  </div>
                )}
              </div>

              {/* Farmer Profile Box */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-agri-primary">
                  👨‍🌾 Direct Farmer Info
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-agri-dark text-agri-accent font-extrabold text-xl flex items-center justify-center shadow-md">
                    {product.farmer?.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{product.farmer?.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-agri-primary" /> {product.location}
                    </p>
                    {product.farmer?.farmerProfile && (
                      <span className="inline-block text-[11px] font-semibold text-agri-dark bg-agri-pale px-2 py-0.5 rounded mt-1">
                        Farm: {product.farmer.farmerProfile.farmName} ({product.farmer.farmerProfile.farmingType})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified Reviews Section */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  Verified Consumer Reviews ({product.reviews?.length || 0})
                </h3>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                          <span>{rev.user?.name || 'Verified Consumer'}</span>
                          <span className="text-yellow-600 flex items-center gap-0.5">
                            ★ {rev.rating}/5
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No reviews yet for this harvest.</p>
                )}
              </div>

            </div>

            {/* Right: Produce Details, Quantity, Price Comparison */}
            <div className="space-y-8">
              
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-agri-primary bg-agri-pale px-3 py-1 rounded-full">
                    {product.category?.name || 'Fresh Harvest'}
                  </span>
                  <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-agri-primary" /> Harvested: {product.harvestDate}
                    </span>
                    <span>•</span>
                    <span className="text-agri-dark font-extrabold bg-agri-pale px-2 py-0.5 rounded">
                      Available: {product.quantity} {product.unit}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-agri-pale/40 border border-agri-light/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block">Direct Farm Gate Price</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-3xl font-extrabold text-agri-dark">₹{product.price}</span>
                      <span className="text-sm text-gray-600 font-bold">/{product.unit}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      Zero Intermediary Fees
                    </span>
                  </div>
                </div>

                {/* Quantity Selector & Action Buttons */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-4">
                    <label className="text-xs font-bold text-gray-700">Select Quantity ({product.unit}):</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-base text-gray-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="w-9 h-9 rounded-xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="py-4 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4 text-agri-accent" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="py-4 rounded-2xl bg-agri-accent text-agri-dark font-extrabold text-sm hover:bg-yellow-400 transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Price Comparison Widget */}
              {comparison && <PriceComparisonWidget comparison={comparison} />}

              {/* AI Demand Forecast Widget */}
              <DemandForecastWidget productId={product.id} />

            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
};
