import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const FooterOne = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/product-types/`)
      .then(res => setTopProducts(res.data))
      .catch(() => setTopProducts([]));
  }, []);

  return (
    <footer className="footer py-120">
      <div className="container container-lg">
        <div className="footer-item-wrapper d-flex align-items-start flex-wrap justify-content-between">
          {/* Company with logo and contact */}
          <div className="footer-item">
            <div className="footer-item__logo mb-16">
              <Link to="/">
                <img src="assets/images/logo/pandalogo.png" alt="Panda Print" />
              </Link>
            </div>
            <p className="mb-24">
              Premier provider of custom 
              printing 
            </p>
            <div className="flex-align gap-16 mb-16">
              <span className="w-32 h-32 flex-center rounded-circle bg-main-600 text-white text-md flex-shrink-0">
                <i className="ph-fill ph-map-pin" />
              </span>
              <span className="text-md text-gray-900">New Minas, Nova Scotia</span>
            </div>
            <div className="flex-align gap-16 mb-16">
              <span className="w-32 h-32 flex-center rounded-circle bg-main-600 text-white text-md flex-shrink-0">
                <i className="ph-fill ph-phone-call" />
              </span>
              <div className="flex-align gap-16 flex-wrap">
                <a
                  href="tel:9023652806"
                  className="text-md text-gray-900 hover-text-main-600"
                >
                  (902) 365-2806
                </a>
              </div>
            </div>
            <div className="flex-align gap-16 mb-16">
              <span className="w-32 h-32 flex-center rounded-circle bg-main-600 text-white text-md flex-shrink-0">
                <i className="ph-fill ph-envelope" />
              </span>
              <a
                href="mailto:info@pandaprint.ca"
                className="text-md text-gray-900 hover-text-main-600"
              >
                info@pandaprint.ca
              </a>
            </div>
            {/* Social links directly after contact */}
            <div className="footer-social mb-24 mt-12">
              <h6 className="mb-8">Reach us on</h6>
              <ul className="flex-align gap-16">
                <li>
                  <a href="https://www.facebook.com/pandaprintshop/"
                    className="w-44 h-44 flex-center text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white" style={{backgroundColor:"#ffffffff"}}
                    target="_blank" rel="noopener noreferrer">
                    <i className="ph-fill ph-facebook-logo" />
                  </a>
                </li>
                <li>
                  <a href="https://www.twitter.com"
                    className="w-44 h-44 flex-center  text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white " style={{backgroundColor:"#ffffffff"}}
                    target="_blank" rel="noopener noreferrer">
                    <i className="ph-fill ph-twitter-logo" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/pandaprint902/"
                    className="w-44 h-44 flex-center  text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"  style={{backgroundColor:"#ffffffff"}}
                    target="_blank" rel="noopener noreferrer">
                    <i className="ph-fill ph-instagram-logo" />
                  </a>
                </li>
                <li>
                  <a href="https://www.pinterest.com"
                    className="w-44 h-44 flex-center text-main-600 text-xl rounded-circle hover-bg-main-600 hover-text-white"  style={{backgroundColor:"#ffffffff"}}
                    target="_blank" rel="noopener noreferrer">
                    <i className="ph-fill ph-linkedin-logo" />
                  </a>
                </li>
              </ul>
            </div>
                   
          </div>
             <div className="footer-item">

            <h4 className="footer-item__title  mb-24">Company</h4>
            <ul className="footer-menu">
              <li><Link to="#" className="text-gray-600 hover-text-main-600">About</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Accessibility Statement</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">CA Transparency Act</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Customer Reviews</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Editorial Team</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Legal Matters</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Our Advantage</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Policies</Link></li>
            </ul>
          </div>
          {/* Resources */}
          <div className="footer-item">
            <h4 className="footer-item__title mb-24">Resources</h4>
            <ul className="footer-menu">
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Blog</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Design Services</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">FAQ</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Price Calculator</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Sample Pack</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Sitemap</Link></li>
              <li><Link to="#" className="text-gray-600 hover-text-main-600">Templates</Link></li>
            </ul>
          </div>
          {/* Support */}
          <div className="footer-item">
            <h4 className="footer-item__title mb-24">Support</h4>
            <ul className="footer-menu">
              <li><Link to="/contact" className="text-gray-600 hover-text-main-600">Contact Us</Link></li>
              {/* <li><Link to="/" className="text-gray-600 hover-text-main-600">Return Policy</Link></li> */}
              <li><Link to="/shipping-policy" className="text-gray-600 hover-text-main-600">Shipping Policy</Link></li>
            </ul>
          </div>
          {/* Top Products - DYNAMIC */}
          <div className="footer-item">
            <h4 className="footer-item__title mb-24">Top Products</h4>
            <ul className="footer-menu">
              {topProducts.length === 0 && (
                <li className="text-gray-600">Loading...</li>
              )}
              {topProducts.map((ptype) => {
                const defaultMaterialId =
                  ptype.materials && ptype.materials.length > 0
                    ? ptype.materials[0].id
                    : '';
                return (
                  <li key={ptype.id}>
                    <Link
                      to={`/product-details?type=${ptype.id}${defaultMaterialId ? `&material=${defaultMaterialId}` : ''}`}
                      className="text-gray-600 hover-text-main-600"
                    >
                      {ptype.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterOne