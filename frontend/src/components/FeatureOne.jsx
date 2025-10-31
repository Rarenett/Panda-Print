import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import axios from "axios";

const FeatureOne = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product-types/`);
        setProductTypes(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product types:", error);
        setIsLoading(false);
      }
    };

    fetchProductTypes();
  }, []);

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button" onClick={onClick}
        className={` ${className} slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

 
  const settings = {
    dots: false,
    infinite: true, // ✅ Enable infinite loop
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 3,
          infinite: true,
          swipe: true
        } 
      },
      { 
        breakpoint: 600, 
        settings: { 
          slidesToShow: 2,
          infinite: true,
          swipe: true,
          arrows: false
        } 
      },
      { 
        breakpoint: 480, 
        settings: { 
          slidesToShow: 1,
          infinite: true,
          swipe: true,
          arrows: false
        } 
      }
    ]
  };

  return (
    <div className="feature" id="featureSection">
      <div className="container container-lg">
        <div className="position-relative arrow-center">
          <div className="feature-item-wrapper">
            {isLoading ? (
              <div className="text-center py-48">Loading products...</div>
            ) : (
              <Slider {...settings}>
                {productTypes.map((productType) => (
                  <div key={productType.id} className="feature-item text-center">
                    <div className="feature-item__thumb rounded-circle">
                      <Link 
                        to={`/product-details?type=${productType.id}`} 
                        className="feature-item__link"
                      >
                        <img
                          src={productType.image_url || "assets/images/thumbs/placeholder.webp"}
                          alt={productType.name}
                          className="feature-item__image"
                        />
                      </Link>
                    </div>
                    <div className="feature-item__content mt-16">
                      <h6 className="text-lg mb-8">
                        <Link to={`/product-details?type=${productType.id}`} className="text-inherit">
                          {productType.name}
                        </Link>
                      </h6>
                      <span className="text-sm text-gray-400">
                        {productType.category_name}
                      </span>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureOne;
