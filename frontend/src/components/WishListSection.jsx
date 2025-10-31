import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const WishListSection = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const wishlistFromStorage = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistItems(wishlistFromStorage);
  }, []);

  const removeFromWishlist = (itemId) => {
    let newWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // Function to add item to cart
  const addToCart = (productType, material) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const exists = cart.find(
      item => item.product_type.id === productType.id && item.material.id === material.id
    );

    if (!exists) {
      cart.push({
        product_type: productType,
        material: material,
        quantity: 1
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert("Added to cart!");
      navigate('/cart');
    } else {
      alert("Item already in cart");
      navigate('/cart');
    }
  };

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-11">
            <div className="cart-table border border-gray-100 rounded-8">
              <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                <table className="table rounded-8 overflow-hidden">
                  <thead>
                    <tr className="border-bottom border-neutral-100">
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Delete</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Product Name</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100">Unit Price</th>
                      <th className="h6 mb-0 text-lg fw-bold px-40 py-32">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-32">Your wishlist is empty</td>
                      </tr>
                    ) : (
                      wishlistItems.map(item =>
                        item.materials.map(material => (
                          <tr key={`${item.id}-${material.id}`}>
                            <td className="px-40 py-32 border-end border-neutral-100">
                              <button
                                type="button"
                                className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <i className="ph ph-x-circle text-2xl d-flex" />
                                Remove
                              </button>
                            </td>
                            <td className="px-40 py-32 border-end border-neutral-100">
                              <div className="table-product d-flex align-items-center gap-24">
                                <Link
                                  to={`/product-details-material?type=${item.product_type.id}&material=${material.id}`}
                                  className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                                >
                                  <img
                                    src={material.image_swatch || 'assets/images/thumbs/default-material.png'}
                                    alt={material.name}
                                  />
                                </Link>
                                <div className="table-product__content text-start">
                                  <h6 className="title text-lg fw-semibold mb-8">
                                    <Link
                                      to={`/product-details-material?type=${item.product_type.id}&material=${material.id}`}
                                      className="link text-line-2"
                                    >
                                      {item.product_type.name} - {material.name}
                                    </Link>
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td className="px-40 py-32 border-end border-neutral-100">
                              <span className="text-lg h6 mb-0 fw-semibold">
                                ${material.price || item.product_type.base_unit_cost}
                              </span>
                            </td>
                            <td className="px-40 py-32">
                              <button
                                onClick={() => addToCart(item.product_type, material)}
                                className="btn btn-main-two rounded-8 px-64"
                              >
                                Add To Cart <i className="ph ph-shopping-cart" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishListSection;