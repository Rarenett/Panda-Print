import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MostPopularOne = () => {
    const [categories, setCategories] = useState([]);
    const [mostPopularProducts, setMostPopularProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/categories/`);
                const mostPopularResponse = await axios.get(`${process.env.REACT_APP_API_URL}/most-popular/`);

                setCategories(categoriesResponse.data);
                setMostPopularProducts(mostPopularResponse.data);

                if (categoriesResponse.data.length > 0) {
                    setSelectedCategory(categoriesResponse.data[0]);
                    filterMostPopularByCategory(categoriesResponse.data[0], mostPopularResponse.data);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterMostPopularByCategory = (category, popularData = mostPopularProducts) => {
        const categoryMaterialIds = new Set();

        if (category.product_types && category.product_types.length > 0) {
            category.product_types.forEach(productType => {
                if (productType.materials && productType.materials.length > 0) {
                    productType.materials.forEach(material => {
                        categoryMaterialIds.add(material.id);
                    });
                }
            });
        }

        const filtered = popularData.filter(product =>
            categoryMaterialIds.has(product.material)
        );

        setFilteredProducts(filtered);

        // Reset scroll position to start
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        filterMostPopularByCategory(category);
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            const cardWidth = 280; // Card width + gap
            const scrollAmount = cardWidth + 20; // Card + gap
            scrollContainerRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleNext = () => {
        if (scrollContainerRef.current) {
            const cardWidth = 280; // Card width + gap
            const scrollAmount = cardWidth + 20; // Card + gap
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getBadgeClass = (badgeColor) => {
        const colorMap = {
            'info': 'bg-info-600',
            'danger': 'bg-danger-600',
            'warning': 'bg-warning-600',
            'success': 'bg-success-600',
            'primary': 'bg-primary-600'
        };
        return colorMap[badgeColor] || 'bg-primary-600';
    };

    if (loading) {
        return (
            <section className="recommended">
                <div className="container container-lg">
                    <div className="text-center py-5">
                        <div className="spinner-border text-main-600" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="recommended">
            <div className="container container-lg">
                {/* Header with Navigation Buttons */}
                <div className="section-heading-with-nav">
                    <div className="section-heading-left">
                        <h5 className="mb-0">Most Popular</h5>
                    </div>

                    <div className="flex-align gap-16">
                        <Link
                            to="#"
                            className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline view-all-responsive"
                        >
                            View All Deals
                        </Link>
                        {/* Custom Navigation Buttons */}
                        <div className="flex-align gap-8">
                            <button
                                onClick={handlePrev}
                                className="w-40 h-40 flex-center rounded-circle border border-gray-100 hover-border-main-600 hover-bg-main-600 hover-text-white transition-1"
                                aria-label="Previous"
                                disabled={filteredProducts.length === 0}
                            >
                                <i className="ph ph-caret-left text-xl" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-40 h-40 flex-center rounded-circle border border-gray-100 hover-border-main-600 hover-bg-main-600 hover-text-white transition-1"
                                aria-label="Next"
                                disabled={filteredProducts.length === 0}
                            >
                                <i className="ph ph-caret-right text-xl" />
                            </button>
                        </div>
                    </div>
                    </div>
                    {/* Category Tabs */}
                    <div className="category-tabs-wrapper">
                        <ul className="nav common-tab nav-pills" role="tablist">
                            {categories.map((category) => (
                                <li className="nav-item" key={category.id} role="presentation">
                                    <button
                                        className={`nav-link ${selectedCategory?.id === category.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(category)}
                                        type="button"
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products Carousel - Horizontal Scroll */}
                    <div className="products-carousel-wrapper">
                        <div className="products-grid" ref={scrollContainerRef}>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => {
                                    const materialData = product.material_data || {};
                                    const originalPrice = parseFloat(materialData.material_cost_per_sqft || 0);
                                    const salePercentage = product.sale_percentage || 0;
                                    const discountedPrice = salePercentage > 0
                                        ? (originalPrice * (1 - salePercentage / 100)).toFixed(2)
                                        : originalPrice.toFixed(2);

                                    return (
                                        <div className="product-grid-item" key={product.id}>
                                            <div className="product-card h-100 p-8 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                {/* Sale Badge */}
                                                {salePercentage > 0 && (
                                                    <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                                                        Sale {salePercentage}%
                                                    </span>
                                                )}

                                                {!salePercentage && product.badge && (
                                                    <span className={`product-card__badge ${getBadgeClass(product.badge_color)} px-8 py-4 text-sm text-white`}>
                                                        {product.badge}
                                                    </span>
                                                )}

                                                <Link
                                                    to={`/product-details-material?type=${materialData.product_type}&material=${product.material}`}
                                                    className="product-card__thumb flex-center"
                                                >
                                                    <img
                                                        src={materialData.swatch_url || 'assets/images/thumbs/default-product.jpg'}
                                                        alt={materialData.name || product.title}
                                                        onError={(e) => e.target.src = 'assets/images/thumbs/default-product.jpg'}
                                                    />
                                                </Link>

                                                <div className="product-card__content p-sm-2">
                                                   

                                                    <h6 className="title text-lg fw-semibold mb-8">
                                                        <Link
                                                            to={`/product-details-material?type=${materialData.product_type}&material=${product.material}`}
                                                            className="link text-line-2"
                                                        >
                                                            {materialData.name || product.title}
                                                        </Link>
                                                    </h6>

                                                    <div className="product-card__price mb-8">
                                                        {salePercentage > 0 ? (
                                                            <div className="d-flex align-items-center gap-8 flex-wrap">
                                                                <span className="text-heading text-md fw-semibold">
                                                                    ${discountedPrice}{" "}
                                                                    <span className="text-gray-500 fw-normal">/sqft</span>
                                                                </span>
                                                                <span className="text-gray-400 text-sm fw-semibold text-decoration-line-through">
                                                                    ${originalPrice.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-heading text-md fw-semibold">
                                                                ${originalPrice.toFixed(2)}{" "}
                                                                <span className="text-gray-500 fw-normal">/sqft</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex-align gap-6 mb-12">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className="text-15 fw-medium text-warning-600 d-flex">
                                                                <i className="ph-fill ph-star" />
                                                            </span>
                                                        ))}
                                                        <span className="text-13 text-gray-500 fw-medium ms-4">(4.8)</span>
                                                    </div>

                                                    <Link
                                                        to={`/product-details-material?type=${materialData.product_type}&material=${product.material}`}
                                                        className="product-card__cart btn bg-main-50 text-main-600 hover-bg-main-600 hover-text-white py-11 px-24 rounded-pill flex-align gap-8 w-100 justify-content-center"
                                                    >
                                                        Customize <i className="ph ph-magic-wand" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-5 w-100">
                                    <p className="text-gray-500">No popular products in this category</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </section>
    );
};

export default MostPopularOne;
