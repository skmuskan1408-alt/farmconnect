import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, MapPin, CheckCircle2, TrendingDown } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = React.useState(false);

  const localMandiPrice = Math.round(product.price * 1.25);
  const retailPrice = Math.round(product.price * 1.50);
  const savingsPercent = Math.round(((retailPrice - product.price) / retailPrice) * 100);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login as a consumer to add items to your cart.');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id, 1);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Savings Badge */}
        <div className="absolute top-3 left-3 bg-agri-accent text-agri-dark font-extrabold text-xs px-2.5 py-1 rounded-full shadow flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5" /> Save {savingsPercent}% vs Retail
        </div>

        {/* Organic Badge */}
        {product.organic && (
          <div className="absolute top-3 right-3 bg-agri-dark/90 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow flex items-center gap-1 border border-agri-light/30">
            <CheckCircle2 className="w-3 h-3 text-agri-light" /> Organic
          </div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-2 py-0.5 rounded-lg shadow">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-agri-primary mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{product.location}</span>
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-agri-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Farmer Tag */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Farmer: <strong className="text-gray-900 font-bold">{product.farmer?.name || 'Local Farmer'}</strong></span>
            <span className="text-agri-dark font-semibold bg-agri-pale px-2 py-0.5 rounded-full">
              {product.quantity} {product.unit} available
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-agri-dark">₹{product.price}</span>
              <span className="text-xs text-gray-500 font-medium">/{product.unit}</span>
            </div>
            <div className="text-[11px] text-gray-400 font-medium line-through">
              Retail: ₹{retailPrice}/{product.unit}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/product/${product.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Details
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="p-2.5 rounded-xl bg-agri-dark text-white hover:bg-agri-primary transition-colors shadow flex items-center justify-center disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 text-agri-accent" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
