import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuantityControl from '../helper/QuantityControl';

const CartSection = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cartFromStorage);
    }, []);

    const removeFromCart = (itemId, materialId) => {
        let newCart = cartItems.filter(
            item => !(item.product_type.id === itemId && item.material.id === materialId)
        );
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const updateQuantity = (itemId, materialId, newQuantity) => {
        const newCart = cartItems.map(item => {
            if (item.product_type.id === itemId && item.material.id === materialId) {
                // Create a completely new object with updated values
                const updatedItem = {
                    ...item,
                    quantity: newQuantity
                };

                // If price_breakdown exists, create a NEW price_breakdown object
                if (updatedItem.price_breakdown) {
                    updatedItem.price_breakdown = {
                        ...updatedItem.price_breakdown,
                        quantity: newQuantity,
                        total: parseFloat(updatedItem.price_breakdown.subtotal) * newQuantity
                    };
                }

                return updatedItem;
            }
            return item;
        });

        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const calculateSubtotal = (item) => {
        // Use the saved price_breakdown if it exists (for customized items from ProductDetailsMaterial)
        if (item.price_breakdown && item.price_breakdown.total) {
            return item.price_breakdown.total.toFixed(2);
        }
        // Fallback to simple calculation for items added from wishlist
        const price = item.material.price || item.product_type.base_unit_cost || 0;
        return (price * item.quantity).toFixed(2);
    };

    const getUnitPrice = (item) => {
        // Use subtotal from price_breakdown if available (this is the per-unit customized price)
        if (item.price_breakdown && item.price_breakdown.subtotal) {
            const price = parseFloat(item.price_breakdown.subtotal);
            return isNaN(price) ? '0.00' : price.toFixed(2);
        }
        // Fallback to material price
        const fallbackPrice = parseFloat(item.material.price || item.product_type.base_unit_cost || 0);
        return isNaN(fallbackPrice) ? '0.00' : fallbackPrice.toFixed(2);
    };



    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            // Use saved price_breakdown.total if available
            if (item.price_breakdown && item.price_breakdown.total) {
                return total + parseFloat(item.price_breakdown.total);
            }
            // Fallback calculation
            const price = item.material.price || item.product_type.base_unit_cost || 0;
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <section className="cart py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    <div className="col-xl-9 col-lg-8">
                        <div className="cart-table border border-gray-100 rounded-8 px-40 py-48">
                            <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                                <table className="table style-three">
                                    <thead>
                                        <tr>
                                            <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Price</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                                            <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-32">Your cart is empty</td>
                                            </tr>
                                        ) : (
                                            cartItems.map((item, index) => (
                                                <tr key={`${item.product_type.id}-${item.material.id}-${index}`}>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                                            onClick={() => removeFromCart(item.product_type.id, item.material.id)}
                                                        >
                                                            <i className="ph ph-x-circle text-2xl d-flex" />
                                                            Remove
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <div className="table-product d-flex align-items-center gap-24">
                                                            <Link
                                                                to={`/product-details-material?type=${item.product_type.id}&material=${item.material.id}`}
                                                                className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                                                            >
                                                                <img
                                                                    src={item.material.image_swatch || 'assets/images/thumbs/default-material.png'}
                                                                    alt={item.material.name}
                                                                />
                                                            </Link>
                                                            <div className="table-product__content text-start">
                                                                <h6 className="title text-lg fw-semibold mb-8">
                                                                    <Link
                                                                        to={`/product-details-material?type=${item.product_type.id}&material=${item.material.id}`}
                                                                        className="link text-line-2"
                                                                    >
                                                                        {item.product_type.name} - {item.material.name}
                                                                    </Link>
                                                                </h6>
                                                                {/* Show customization details if available */}
                                                                {item.customization && (
                                                                    <div className="text-sm text-gray-600 mt-4">
                                                                        Size: {item.customization.width}" × {item.customization.height}"
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="text-lg h6 mb-0 fw-semibold">
                                                            ${getUnitPrice(item)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <QuantityControl
                                                            key={`${item.product_type.id}-${item.material.id}-${item.quantity}`}
                                                            initialQuantity={item.quantity || 1}
                                                            onQuantityChange={(newQty) => updateQuantity(item.product_type.id, item.material.id, newQty)}
                                                        />

                                                    </td>
                                                    <td>
                                                        <span className="text-lg h6 mb-0 fw-semibold">
                                                            ${calculateSubtotal(item)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex-between flex-wrap gap-16 mt-16">
                                <div className="flex-align gap-16">
                                    <input
                                        type="text"
                                        className="common-input"
                                        placeholder="Coupon Code"
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-main py-18 w-100 rounded-8 apply-coupon"
                                    >
                                        Apply Coupon
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="text-lg text-gray-500 hover-text-main-600"
                                >
                                    Update Cart
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-4">
                        <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
                            <h6 className="text-xl mb-32">Cart Totals</h6>
                            <div className="bg-color-three rounded-8 p-24">
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">Subtotal</span>
                                    <span className="text-gray-900 fw-semibold">${calculateTotal()}</span>
                                </div>
                                <div className="mb-32 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Estimated Delivery
                                    </span>
                                    <span className="text-gray-900 fw-semibold">Free</span>
                                </div>
                                <div className="mb-0 flex-between gap-8">
                                    <span className="text-gray-900 font-heading-two">
                                        Estimated Taxes
                                    </span>
                                    <span className="text-gray-900 fw-semibold">USD 10.00</span>
                                </div>
                            </div>
                            <div className="bg-color-three rounded-8 p-24 mt-24">
                                <div className="flex-between gap-8">
                                    <span className="text-gray-900 text-xl fw-semibold">Total</span>
                                    <span className="text-gray-900 text-xl fw-semibold">
                                        ${(parseFloat(calculateTotal()) + 10).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-main mt-40 py-18 w-100 rounded-8"
                            >
                                Proceed to checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartSection;