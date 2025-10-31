import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const ShopSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then((res) => {
        setCategories(res.data);

        if (categoryParam && categoryParam !== "all") {
          setSelectedCategoryId(parseInt(categoryParam));
        } else {
          setSelectedCategoryId(res.data.length > 0 ? res.data[0].id : null);
        }
      })
      .catch(() => setCategories([]));
  }, [categoryParam]);

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  const filterMaterials = (materials) => {
    if (!searchQuery) return materials;
    return materials.filter((material) =>
      material.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle backdrop click to close sidebar on mobile
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <section className="shop py-80">
      <div className="container container-lg">
        {/* Sidebar Toggle Button (Mobile Only) */}
        <button
          className="shop-sidebar-toggle d-lg-none"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Show categories"
        >
          <i className="ph ph-list"></i>
        </button>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="shop-sidebar-backdrop d-lg-none"
            onClick={closeSidebar}
          ></div>
        )}

        <div className="row">
          {/* Sidebar - Category List */}
          <div className={`col-lg-3`}>
            <aside
              className={`shop-sidebar ${sidebarOpen ? "active" : ""} `}
              tabIndex={-1}
            >
              <div className="shop-sidebarbox border border-gray-100 rounded-8 p-32 mb-32">
                <div className="sidebar-header d-lg-none">
                  <button
                    className="sidebar-close"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                  >
                    ×
                  </button>
                </div>
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      className={`mb-16 ${
                        selectedCategoryId === category.id ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setSidebarOpen(false); // auto close on mobile
                      }}
                    >
                      {category.name}{" "}
                      <span className="text-sm text-gray-400">
                        ({category.product_types ? category.product_types.length : 0})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
          {/* Main - Product Type & Material Grid */}
          <div className="col-lg-9">
            {searchQuery && (
              <div className="mb-24">
                <h5>
                  Search results for: "<span>{searchQuery}</span>"
                </h5>
              </div>
            )}
            {!selectedCategory ||
            !selectedCategory.product_types ||
            selectedCategory.product_types.length === 0 ? (
              <p className="text-center">
                No product types found for this category.
              </p>
            ) : (
              <div className="product-types-list">
                {selectedCategory.product_types.map((productType) => {
                  const filteredMaterials = filterMaterials(
                    productType.materials || []
                  );

                  if (searchQuery && filteredMaterials.length === 0)
                    return null;

                  return (
                    <div
                      key={productType.id}
                      className="product-type-card border rounded-16 p-28 mb-40"
                    >
                      <h5 className="product-type-title text-xl fw-bold mb-24 d-flex align-items-center">
                        <i className="ph ph-package me-8" /> {productType.name}
                      </h5>
                      {filteredMaterials.length > 0 ? (
                        <div className="row gy-4">
                          {filteredMaterials.map((material) => (
                            <div key={material.id} className="col-6 col-md-4">
    <div className="material-card border rounded-12 p-18 h-100 d-flex flex-column align-items-center">
                                <div className="material-img-box mb-14">
                                  <img
                                    src={
                                      material.image_swatch ||
                                      "assets/images/thumbs/default-material.png"
                                    }
                                    alt={material.name}
                                    style={{
                                      width: 80,
                                      height: 80,
                                      objectFit: "cover",
                                      borderRadius: 10,
                                      border: "1.5px solid #e5e7eb",
                                      background: "#fff",
                                    }}
                                  />
                                </div>
                                <div className="material-info text-center flex-grow-1 w-100">
                                  <h6 className="material-name fw-semibold mb-2">
                                    {material.name}
                                  </h6>
                                  <div className="mb-2 text-sm text-gray-500">
                                    ${material.material_cost_per_sqft} / sqft
                                  </div>
                                </div>
                                <Link
                                  to={`/product-details-material?type=${productType.id}&material=${material.id}`}
                                  className="btn btn-main btn-lg mt-10 w-100"
                                >
                                  Customize now <i className="ph ph-shopping-cart" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-materials-message text-muted mb-16">
                          No materials available for this product type.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
