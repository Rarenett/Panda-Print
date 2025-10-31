import React from "react";
import Preloader from "../helper/Preloader";
import HeaderOne from "../components/HeaderOne";
import BannerOne from "../components/BannerOne";
import FeatureOne from "../components/FeatureOne";

import FlashSalesOne from "../components/FlashSalesOne";

// import PromotionalOne from "../components/PromotionalOne";
// import ProductListOne from "../components/ProductListOne";
// import OfferOne from "../components/OfferOne";
// import TopVendorsOne from "../components/TopVendorsOne";
// import DeliveryOne from "../components/DeliveryOne";
// import OrganicOne from "../components/OrganicOne";
// import ShortProductOne from "../components/ShortProductOne";
// import NewArrivalOne from "../components/NewArrivalOne";
// import NewsletterOne from "../components/NewsletterOne";

import RecommendedOne from "../components/RecommendedOne";
import HotDealsOne from "../components/HotDealsOne";

import BestSellsOne from "../components/BestSellsOne";

import BrandOne from "../components/BrandOne";

import ShippingOne from "../components/ShippingOne";
import FooterOne from "../components/FooterOne";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
// import TextSlider from "../components/TextSlider";

const HomePageOne = () => {

  return (

    <>

      {/* Preloader */}
      <Preloader />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#299E60" />

      {/* ColorInit */}
      <ColorInit color={false} />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />


      {/* FeatureOne */}
      <FeatureOne />
      {/* <br/><br/>
      <TextSlider /> */}


      {/* PromotionalOne */}
      {/* <PromotionalOne /> */}

      {/* FlashSalesOne */}
      <FlashSalesOne />
      <br />
      {/* ProductListOne */}
      {/* <ProductListOne /> */}

      {/* OfferOne */}
      {/* <OfferOne /> */}

      {/* RecommendedOne */}
      <RecommendedOne />
      {/* HotDealsOne */}
      <HotDealsOne />
      <br />
      <br />

      {/* TopVendorsOne */}
      {/* <TopVendorsOne /> */}

      {/* BestSellsOne */}
      <BestSellsOne />

      {/* DeliveryOne */}
      {/* <DeliveryOne /> */}

      {/* OrganicOne */}
      {/* <OrganicOne /> */}

      {/* ShortProductOne */}
      {/* <ShortProductOne /> */}

      {/* BrandOne */}
      <BrandOne />

      {/* NewArrivalOne */}
      {/* <NewArrivalOne /> */}

      {/* ShippingOne */}
      <ShippingOne />

      {/* NewsletterOne */}
      {/* <NewsletterOne /> */}

      {/* FooterOne */}
      <FooterOne />

      {/* BottomFooter */}
      <BottomFooter />


    </>
  );
};

export default HomePageOne;
