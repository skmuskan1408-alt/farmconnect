import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const totalRetailPrice = cart?.items.reduce((sum, item) => sum + (item.product.price * 1.5) * item.quantity, 0) || 0;
  const consumerSavings = totalRetailPrice - subtotal;

  if (loading) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-gray-700">Loading Shopping Cart...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#f8faf9] min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-agri-primary" />
            Your Farm Fresh Shopping Cart
          </h1>

          {!cart || cart.items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
              <span className="text-5xl">🛒</span>
              <h3 className="text-xl font-bold text-gray-900 mt-4">Your Cart is Empty</h3>
              <p className="text-xs text-gray-500 mt-1 mb-6">Explore our marketplace to buy produce directly from farmers.</p>
              <Link
                to="/marketplace"
                className="px-6 py-3 rounded-2xl bg-agri-dark text-white font-bold text-sm hover:bg-agri-primary transition-all inline-block shadow-md"
              >
                Browse Fresh Produce
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                      <div>
                        <Link to={`/product/${item.product.id}`} className="font-bold text-gray-900 text-base hover:text-agri-primary">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Farmer: {item.product.farmer?.name} • {item.product.location}
                        </p>
                        <span className="text-sm font-extrabold text-agri-dark block mt-1">
                          ₹{item.product.price}/{item.product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white font-bold text-gray-700 shadow-2xs hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white font-bold text-gray-700 shadow-2xs hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-lg font-extrabold text-gray-900 w-20 text-right">
                        ₹{item.product.price * item.quantity}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Direct Farm Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Retail Price</span>
                    <span className="font-medium text-gray-400 line-through">₹{totalRetailPrice}</span>
                  </div>

                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-3 rounded-2xl">
                    <span>Direct Consumer Savings</span>
                    <span>-₹{Math.round(consumerSavings)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-2xl text-agri-dark">₹{subtotal}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 rounded-2xl bg-agri-accent text-agri-dark font-extrabold text-base hover:bg-yellow-400 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-400 font-semibold pt-2">
                  <ShieldCheck className="w-4 h-4 text-agri-primary" />
                  <span>100% Safe Demo Payment Guarantee</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};
