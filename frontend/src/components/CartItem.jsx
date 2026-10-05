import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [itemError, setItemError] = useState('');

  const product = item?.product;
  if (!product) return null;

  const { _id, name, price, image, stock } = product;
  const quantity = item.quantity;
  const itemTotal = (Number(price) || 0) * (Number(quantity) || 0);

  const handleQuantityChange = async (newQty) => {
    if (updating || removing) return;

    if (newQty < 1) return;

    if (stock !== undefined && newQty > stock) {
      setItemError(`Only ${stock} units in stock`);
      setTimeout(() => setItemError(''), 2500);
      return;
    }

    setUpdating(true);
    setItemError('');
    const res = await updateQuantity(_id, newQty);
    setUpdating(false);

    if (!res.success) {
      setItemError(res.message);
      setTimeout(() => setItemError(''), 3000);
    }
  };

  const handleRemove = async () => {
    if (removing || updating) return;
    setRemoving(true);
    setItemError('');
    const res = await removeFromCart(_id);
    setRemoving(false);

    if (!res.success) {
      setItemError(res.message);
      setTimeout(() => setItemError(''), 3000);
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#16806A]/30 shadow-xs transition-all ${
      removing ? 'opacity-40 pointer-events-none' : ''
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Product Image & Details */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link
            to={`/products/${_id}`}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F7F5F0] border border-[#E8E2D8] shrink-0 block"
          >
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </Link>

          <div className="min-w-0 flex-1 space-y-1">
            <Link
              to={`/products/${_id}`}
              className="text-sm sm:text-base font-bold text-[#1F2E29] hover:text-[#16806A] transition-colors truncate block"
              title={name}
            >
              {name}
            </Link>
            
            <div className="text-xs sm:text-sm font-semibold text-[#1F2E29]/70">
              ₹{Number(price).toLocaleString('en-IN')} each
            </div>

            {/* Amazon-style Stock indicator */}
            {stock !== undefined && (
              <div>
                {stock <= 0 ? (
                  <span className="text-[11px] font-bold text-[#B12704]">
                    Currently unavailable
                  </span>
                ) : stock <= 5 ? (
                  <span className="text-[11px] font-bold text-[#B12704]">
                    Only {stock} left in stock - order soon.
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#007600]">
                    In Stock
                  </span>
                )}
              </div>
            )}

            {itemError && (
              <div className="text-xs font-semibold text-rose-600 animate-fadeIn">
                ⚠️ {itemError}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quantity Controls, Subtotal & Remove Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8E2D8]">
          
          {/* Quantity Controls [-] Qty [+] */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center border border-[#E2DAD0] rounded-xl bg-[#FAF8F5] overflow-hidden shadow-xs">
              <button
                type="button"
                id={`decrease-qty-${_id}`}
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || updating || removing}
                title={quantity <= 1 ? "Minimum quantity is 1 (use Remove to delete)" : "Decrease quantity"}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-black text-[#1F2E29] hover:bg-[#E8E2D8]/60 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                -
              </button>

              <span className="w-10 sm:w-11 text-center text-xs sm:text-sm font-extrabold text-[#1F2E29]">
                {updating ? '…' : quantity}
              </span>

              <button
                type="button"
                id={`increase-qty-${_id}`}
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={(stock !== undefined && quantity >= stock) || updating || removing}
                title={stock !== undefined && quantity >= stock ? `Max available stock (${stock}) reached` : "Increase quantity"}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-black text-[#1F2E29] hover:bg-[#E8E2D8]/60 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Item Subtotal (Derived) */}
          <div className="text-right">
            <span className="text-base sm:text-lg font-black text-[#1F2E29]">
              ₹{Number(itemTotal).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            id={`remove-item-${_id}`}
            onClick={handleRemove}
            disabled={removing || updating}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span>{removing ? 'Removing…' : 'Remove'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartItem;
