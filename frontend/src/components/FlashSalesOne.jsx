import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';

const SampleNextArrow = memo(function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
        <button type="button" onClick={onClick} className={`${className} flash-arrow flash-arrow-next`}>
            <i className="ph ph-caret-right" />
        </button>
    );
});

const SamplePrevArrow = memo(function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
        <button type="button" onClick={onClick} className={`${className} flash-arrow flash-arrow-prev`}>
            <i className="ph ph-caret-left" />
        </button>
    );
});

const FlashSalesOne = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countdowns, setCountdowns] = useState({});

    const colorThemes = [
        { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
        { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
        { bg: 'linear-gradient(135deg, #a8edea 0%, #6a85b6 100%)', accent: '#6a85b6' },
    ];

    const settings = {
        dots: false,
        arrows: true,
        infinite: flashSales.length > 1,
        speed: 800,
        slidesToShow: Math.min(3, flashSales.length),
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: flashSales.length > 1,
        autoplaySpeed: 4000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1400,
                settings: { 
                    slidesToShow: Math.min(3, flashSales.length),
                    infinite: flashSales.length > 1,
                },
            },
            {
                breakpoint: 1200,
                settings: { 
                    slidesToShow: Math.min(2, flashSales.length),
                    infinite: flashSales.length > 1,
                },
            },
            {
                breakpoint: 768,
                settings: { 
                    slidesToShow: Math.min(2, flashSales.length),
                    infinite: flashSales.length > 1,
                },
            },
            {
                breakpoint: 575,
                settings: { 
                    slidesToShow: 1,
                    infinite: flashSales.length > 1,
                },
            },
        ],
    };

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/flash-sales/active/`);
                console.log('Flash Sales Data:', response.data);
                setFlashSales(response.data);
                
                const initialCountdowns = {};
                response.data.forEach(sale => {
                    initialCountdowns[sale.id] = {
                        days: sale.days_remaining || 0,
                        hours: sale.hours_remaining || 0,
                        minutes: sale.minutes_remaining || 0,
                        seconds: sale.seconds_remaining || 0
                    };
                });
                setCountdowns(initialCountdowns);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching flash sales:', error);
                setLoading(false);
            }
        };

        fetchFlashSales();
    }, []);

    useEffect(() => {
        if (flashSales.length === 0) return;

        const interval = setInterval(() => {
            setCountdowns(prevCountdowns => {
                const newCountdowns = { ...prevCountdowns };
                const expiredIds = [];
                
                flashSales.forEach(sale => {
                    if (!newCountdowns[sale.id]) return;
                    
                    let { days, hours, minutes, seconds } = newCountdowns[sale.id];
                    
                    // Check if timer is already at zero
                    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                        expiredIds.push(sale.id);
                        return;
                    }
                    
                    if (seconds > 0) {
                        seconds--;
                    } else if (minutes > 0) {
                        minutes--;
                        seconds = 59;
                    } else if (hours > 0) {
                        hours--;
                        minutes = 59;
                        seconds = 59;
                    } else if (days > 0) {
                        days--;
                        hours = 23;
                        minutes = 59;
                        seconds = 59;
                    }
                    
                    newCountdowns[sale.id] = { days, hours, minutes, seconds };
                });
                
                // Remove expired flash sales
                if (expiredIds.length > 0) {
                    setFlashSales(prevSales => 
                        prevSales.filter(sale => !expiredIds.includes(sale.id))
                    );
                }
                
                return newCountdowns;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [flashSales]);

    if (loading) {
        return (
            <section className="flash-sales-section">
                <div className="container container-lg">
                    <div className="text-center py-4">
                        <div className="spinner-border text-main-600" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (flashSales.length === 0) return null;

    return (
        <section className="flash-sales-section">
            <div className="container container-lg">
                <div className="section-heading-compact">
                    <div className="flex-between flex-wrap gap-16">
                        <div>
                            <h5 className="section-title">Flash Sales</h5>
                        </div>
                        <Link to="#" className="btn-view-all">
                            View All <i className="ph ph-arrow-right ms-1" />
                        </Link>
                    </div>
                </div>

                <div className="flash-sales-slider">
                    <Slider {...settings} key={flashSales.length}>
                        {flashSales.map((sale, index) => {
                            const countdown = countdowns[sale.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
                            const theme = colorThemes[index % colorThemes.length];
                            const materialData = sale.material_data || {};
                            const productType = materialData.product_type || null;
                            const materialId = sale.material || null;
                            
                            return (
                                <div key={sale.id} className="flash-card-wrapper">
                                    <div className="flash-card" style={{ '--theme-gradient': theme.bg, '--theme-accent': theme.accent }}>
                                        
                                        {/* Discount Badge */}
                                        {sale.discount_percentage > 0 && (
                                            <div className="flash-card__badge">
                                                {sale.discount_percentage}% <span className="badge-label-small">OFF</span>
                                            </div>
                                        )}

                                        {/* Product Image */}
                                        <div className="flash-card__image">
                                            <img 
                                                src={materialData.swatch_url || 'assets/images/thumbs/default-material.jpg'} 
                                                alt={materialData.name || 'Material'}
                                                onError={(e) => e.target.src = 'assets/images/thumbs/default-material.jpg'}
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flash-card__info">
                                            {/* <div className="flash-card__category">
                                                <i className="ph ph-tag me-1" />
                                                PRODUCT
                                            </div> */}
                                            <h6 className="flash-card__name">{materialData.name || 'Material'}</h6>
                                        </div>

                                        {/* Compact Countdown */}
                                        <div className="flash-card__countdown">
                                            <div className="countdown-compact">
                                                <div className="countdown-item">
                                                    <span className="countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                                                    <span className="countdown-label">D</span>
                                                </div>
                                                <span className="countdown-sep">:</span>
                                                <div className="countdown-item">
                                                    <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                                                    <span className="countdown-label">H</span>
                                                </div>
                                                <span className="countdown-sep">:</span>
                                                <div className="countdown-item">
                                                    <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                                                    <span className="countdown-label">M</span>
                                                </div>
                                                <span className="countdown-sep">:</span>
                                                <div className="countdown-item">
                                                    <span className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                                                    <span className="countdown-label">S</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shop Button */}
                                        {productType && materialId ? (
                                            <Link
                                                to={`/product-details-material?type=${productType}&material=${materialId}`}
                                                className="flash-card__btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log('Navigating to:', `/product-details-material?type=${productType}&material=${materialId}`);
                                                }}
                                            >
                                                <i className="ph ph-shopping-cart me-1" />
                                                Shop Now
                                            </Link>
                                        ) : (
                                            <button className="flash-card__btn" disabled>
                                                <i className="ph ph-shopping-cart me-1" />
                                                Unavailable
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default FlashSalesOne;
