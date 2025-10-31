import React from 'react'
import { Link } from 'react-router-dom';
import Slider from "react-slick";
// import './BannerOne.scss';

const BannerOne = () => {

   function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <button
            type="button" 
            onClick={onClick}
            className="banner-arrow banner-arrow--next"
        >
            <i className="ph ph-caret-right" />
        </button>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className="banner-arrow banner-arrow--prev"
        >
            <i className="ph ph-caret-left" />
        </button>
    );
}


    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        dotsClass: 'slick-dots banner-dots',
    };

    return (
        <div className="banner-wrapper">
            <div className="container container-lg">
                <div className="banner-container">
                    
                    {/* Animated decorative elements */}
                    <div className="banner-decorations">
                        <div className="banner-decoration banner-decoration--1"></div>
                        <div className="banner-decoration banner-decoration--2"></div>
                        <div className="banner-decoration banner-decoration--3"></div>
                        <div className="banner-decoration banner-decoration--4"></div>
                    </div>
                    
                    <div className="banner-slider-wrapper">
                        <Slider {...settings}>
                            {/* Slide 1 */}
                            <div className="banner-slide">
                                <div className="banner-slide__inner banner-slide__inner--gradient-orange">
                                    <div className="banner-content">
                                        <h1 className="banner-content__title">
                                            Ink it. Print it. Love it.
                                        </h1>
                                        <p className="banner-content__subtitle">
                                            Exclusive deals! Up to 35% Off
                                        </p>
                                        <Link
                                            to="/shop"
                                            className="banner-content__btn"
                                        >
                                            Shop Now{" "}
                                            <span className="banner-content__btn-icon">
                                                <i className="ph ph-shopping-cart-simple" />
                                            </span>
                                        </Link>
                                    </div>
                                    {/* <div className="banner-image">
                                        <img 
                                            src="assets/images/thumbs/banner5.webp" 
                                            alt="Print Products" 
                                            className="banner-image__img"
                                        />
                                    </div> */}
                                </div>
                            </div>

                            {/* Slide 2 */}
                            <div className="banner-slide">
                                <div className="banner-slide__inner banner-slide__inner--gradient-purple">
                                    <div className="banner-content">
                                        <h1 className="banner-content__title">
                                            We Print Just For You!
                                        </h1>
                                        <p className="banner-content__subtitle">
                                            Custom designs, premium quality
                                        </p>
                                        <Link
                                            to="/shop"
                                            className="banner-content__btn"
                                        >
                                            Explore Shop{" "}
                                            <span className="banner-content__btn-icon">
                                                <i className="ph ph-shopping-cart-simple" />
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="banner-image">
                                        {/* <img 
                                            src="assets/images/thumbs/banner3.jpg" 
                                            alt="Custom Prints" 
                                            className="banner-image__img"
                                        /> */}
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BannerOne
