import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';
import { getCountdown } from '../helper/Countdown';

const BestSellsOne = () => {
    const [timeLeft, setTimeLeft] = useState(getCountdown());
    const [mostPopularProducts, setMostPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchMostPopular = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/most-popular/`);
                setMostPopularProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching best sells products:', error);
                setLoading(false);
            }
        };

        fetchMostPopular();
    }, []);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1399,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
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

    const goToPrevious = () => {
        sliderRef.current?.slickPrev();
    };

    const goToNext = () => {
        sliderRef.current?.slickNext();
    };

    return (
        <section className="best-sells pt-80 pb-80">
            <div className="container container-lg">
                {/* Section Heading with Navigation */}
                <div className="section-heading mb-24">
                    <div className="flex-between flex-wrap gap-8">
                        <h5 className="mb-0">Daily Best Sells</h5>
                        <div className="flex-align gap-16">
                            <Link
                                to="#"
                                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline best-sell-responsive"
                            >
                                View All Deals
                            </Link>
                            {/* Custom Navigation Buttons */}
                            <div className="flex-align gap-8">
                                <button
                                    onClick={goToPrevious}
                                    className="w-40 h-40 flex-center rounded-circle border border-gray-100 hover-border-main-600 hover-bg-main-600 hover-text-white transition-1"
                                    aria-label="Previous"
                                >
                                    <i className="ph ph-caret-left text-xl" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="w-40 h-40 flex-center rounded-circle border border-gray-100 hover-border-main-600 hover-bg-main-600 hover-text-white transition-1"
                                    aria-label="Next"
                                >
                                    <i className="ph ph-caret-right text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="best-sells-container">
                    
                    {/* Products Slider */}
                    <div className="best-sells-products">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-main-600" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <Slider ref={sliderRef} {...settings}>
                                {mostPopularProducts.map((product) => {
                                    const materialData = product.material_data || {};
                                    const originalPrice = parseFloat(materialData.material_cost_per_sqft || 0);
                                    const salePercentage = product.sale_percentage || 0;
                                    const discountedPrice = salePercentage > 0 
                                        ? (originalPrice * (1 - salePercentage / 100)).toFixed(2)
                                        : originalPrice.toFixed(2);

                                    return (
                                        <div key={product.id} className="px-8">
                                            <div className="product-card h-100 p-12 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                                {salePercentage > 0 ? (
                                                    <span className="product-card__badge bg-danger-600 px-8 py-4 text-sm text-white">
                                                        Sale {salePercentage}%
                                                    </span>
                                                ) : product.badge && (
                                                    <span className={`product-card__badge ${getBadgeClass(product.badge_color)} px-8 py-4 text-sm text-white`}>
                                                        {product.badge}
                                                    </span>
                                                )}

                                                <Link
                                                    to={`/product-details-material?type=${materialData.product_type}&material=${product.material}`}
                                                    className="product-card__thumb flex-center mb-12"
                                                >
                                                    <img 
                                                        src={materialData.swatch_url || 'assets/images/thumbs/default-product.jpg'} 
                                                        alt={materialData.name || product.title}
                                                        onError={(e) => e.target.src = 'assets/images/thumbs/default-product.jpg'}
                                                    />
                                                </Link>

                                                <div className="product-card__content p-sm-2">
                                                    <h6 className="title text-lg fw-semibold mb-12">
                                                        <Link 
                                                            to={`/product-details-material?type=${materialData.product_type}&material=${product.material}`} 
                                                            className="link text-line-2"
                                                        >
                                                            {materialData.name || product.title}
                                                        </Link>
                                                    </h6>

                                                    <div className="product-card__price mb-12">
                                                        {salePercentage > 0 ? (
                                                            <>
                                                                <span className="text-heading text-md fw-semibold">
                                                                    ${discountedPrice}{" "}
                                                                    <span className="text-gray-500 fw-normal">/sqft</span>{" "}
                                                                </span>
                                                                <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                                                    ${originalPrice.toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-heading text-md fw-semibold">
                                                                ${originalPrice.toFixed(2)}{" "}
                                                                <span className="text-gray-500 fw-normal">/sqft</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex-align gap-6 mb-16">
                                                        <span className="text-xs fw-bold text-gray-600">4.8</span>
                                                        <span className="text-15 fw-bold text-warning-600 d-flex">
                                                            <i className="ph-fill ph-star" />
                                                        </span>
                                                        <span className="text-xs fw-bold text-gray-600">(2.5k)</span>
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
                                })}
                            </Slider>
                        )}
                    </div>

                    {/* Featured Card (Orange/Yellow) */}
                    <div className="best-sells-featured best-sell-responsive">
                        <div className="best-sells-card">
                            <img
                                src="assets/images/shape/offer-shape.png"
                                alt=""
                                className="best-sells-card__bg"
                            />
                            <div className="best-sells-card__thumb">
                                <img src="assets/images/thumbs/Best sells.jpg" alt="Best Seller" />
                            </div>
                            <div className="best-sells-card__content">
                                <h4 className="best-sells-card__title">Best Seller</h4>
                                <div className="best-sells-countdown">
                                    <div className="countdown-item">
                                        <span className="countdown-value">{timeLeft.hours}</span>
                                        <span className="countdown-label">Hours</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="countdown-value">{timeLeft.minutes}</span>
                                        <span className="countdown-label">Min</span>
                                    </div>
                                    <div className="countdown-item">
                                        <span className="countdown-value">{timeLeft.seconds}</span>
                                        <span className="countdown-label">Sec</span>
                                    </div>
                                </div>
                                <Link to="#" className="best-sells-card__btn">
                                    Shop Now <i className="ph ph-arrow-right" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default BestSellsOne;
