import React, { useEffect, useState, useRef } from "react";
import query from "jquery";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReactDOM from 'react-dom';

const HeaderOne = () => {
  const { isAuthenticated, logout } = useAuth();
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();

  const [scroll, setScroll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredMaterial, setHoveredMaterial] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const profileBtnRef = useRef();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuOverlay, setMobileMenuOverlay] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const previewTimeouts = useRef({});

  const handleToggleDropdown = () => {
    if (!dropdownOpen && profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 180
      });
    }
    setDropdownOpen(!dropdownOpen);
  };

  // Mobile menu handlers
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileMenuOverlay(!mobileMenuOverlay);
    if (mobileMenuOpen) {
      setMobileExpandedCategory(null);
    }
  };

  const handleMobileCategoryClick = (categoryId) => {
    setMobileExpandedCategory(mobileExpandedCategory === categoryId ? null : categoryId);
  };

  const clearPreviewTimeout = (categoryId) => {
    if (previewTimeouts.current[categoryId]) {
      clearTimeout(previewTimeouts.current[categoryId]);
      previewTimeouts.current[categoryId] = null;
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    if (profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 180
      });
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const handleMaterialHover = (e, material, productType, categoryId) => {
    // Only show preview on desktop (screen width > 1009px)
    if (window.innerWidth <= 1009) return;

    clearPreviewTimeout(categoryId);

    const panel = document.getElementById(`materialPreviewPanel-${categoryId}`);
    const image = document.getElementById(`previewImage-${categoryId}`);
    const title = document.getElementById(`previewTitle-${categoryId}`);
    const type = document.getElementById(`previewType-${categoryId}`);
    const description = document.getElementById(`previewDescription-${categoryId}`);

    if (panel && image && title && type && description) {
      image.src = material.swatch_url || 'assets/images/thumbs/default-material.png';
      image.alt = material.name;
      title.textContent = material.name;
      type.textContent = productType.name;

      const descriptions = [
        'Premium quality material perfect for professional signage and displays.',
        'Durable and weather-resistant, ideal for indoor and outdoor applications.',
        'High-quality finish that ensures vibrant colors and long-lasting results.',
        'Versatile material suitable for various printing techniques and designs.',
        'Professional-grade solution for creating eye-catching visual displays.',
        'Excellent choice for custom signage with superior print quality.',
        'Cost-effective solution without compromising on quality or durability.',
        'Industry-standard material trusted by professionals worldwide.',
        'Eco-friendly option that delivers outstanding visual impact.',
        'Perfect for both temporary and permanent signage applications.'
      ];
      description.textContent = descriptions[Math.floor(Math.random() * descriptions.length)];

      const dropdown = panel.closest('.category-mega-dropdown');

      if (dropdown) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const spaceOnRight = viewportWidth - dropdownRect.right;

        if (spaceOnRight >= 350) {
          panel.style.left = 'auto';
          panel.style.right = '-320px';
        } else {
          panel.style.right = 'auto';
          panel.style.left = '-320px';
        }

        panel.style.top = '0px';
        panel.style.bottom = 'auto';
      }

      panel.style.display = 'flex';
      setHoveredMaterial({ material, categoryId });
    }
  };

  const handleMaterialLeave = (e, categoryId) => {
    previewTimeouts.current[categoryId] = setTimeout(() => {
      const panel = document.getElementById(`materialPreviewPanel-${categoryId}`);
      if (panel) {
        panel.style.display = 'none';
      }
      if (hoveredMaterial && hoveredMaterial.categoryId === categoryId) {
        setHoveredMaterial(null);
      }
    }, 10000);
  };

  const handlePreviewPanelLeave = (categoryId) => {
    clearPreviewTimeout(categoryId);

    previewTimeouts.current[categoryId] = setTimeout(() => {
      const panel = document.getElementById(`materialPreviewPanel-${categoryId}`);
      if (panel) {
        panel.style.display = 'none';
      }
      if (hoveredMaterial && hoveredMaterial.categoryId === categoryId) {
        setHoveredMaterial(null);
      }
    }, 10000);
  };

  // Add this useEffect to handle dynamic dropdown positioning
  useEffect(() => {
    const handleDropdownPosition = () => {
      const navItems = document.querySelectorAll('.category-nav-item');

      navItems.forEach((item) => {
        const dropdown = item.querySelector('.category-mega-dropdown');
        if (!dropdown) return;

        item.addEventListener('mouseenter', () => {
          const rect = item.getBoundingClientRect();
          const dropdownWidth = dropdown.offsetWidth || 600;
          const viewportWidth = window.innerWidth;
          const spaceOnRight = viewportWidth - rect.right;
          const spaceOnLeft = rect.left;

          // Reset transforms
          dropdown.style.left = '';
          dropdown.style.right = '';
          dropdown.style.transform = '';

          // Check if there's more space on the right
          if (spaceOnRight >= dropdownWidth + 20) {
            // Align to left
            dropdown.style.left = '0';
            dropdown.style.right = 'auto';
          } else if (spaceOnLeft >= dropdownWidth + 20) {
            // Align to right
            dropdown.style.left = 'auto';
            dropdown.style.right = '0';
          } else {
            // Center align
            dropdown.style.left = '50%';
            dropdown.style.transform = 'translateX(-50%)';
          }
        });
      });
    };

    handleDropdownPosition();
    window.addEventListener('resize', handleDropdownPosition);

    return () => {
      window.removeEventListener('resize', handleDropdownPosition);
    };
  }, [categories]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories/`);
        setCategories(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        console.error("Error details:", error.response);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      if (scrollPosition > 200) {
        setScroll(true);
      } else if (scrollPosition < 100) {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const selectElement = query(".js-example-basic-single");
    if (selectElement && selectElement.length > 0) {
      selectElement.select2();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (selectElement && selectElement.data && selectElement.data("select2")) {
        selectElement.select2("destroy");
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previewTimeouts.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState("Eng");
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const [menuActive, setMenuActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleMenuClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  const [activeSearch, setActiveSearch] = useState(false);
  const handleSearchToggle = () => {
    setActiveSearch(!activeSearch);
  };

  const [activeAllCategory, setActiveAllCategory] = useState(false);
  const handleCategoryToggle = () => {
    setActiveAllCategory(!activeAllCategory);
  };
  const [activeIndexCat, setActiveIndexCat] = useState(null);
  const handleCatClick = (index) => {
    setActiveIndexCat(activeIndexCat === index ? null : index);
  };

  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
    Object.keys(previewTimeouts.current).forEach(categoryId => {
      clearTimeout(previewTimeouts.current[categoryId]);
      const panel = document.getElementById(`materialPreviewPanel-${categoryId}`);
      if (panel) {
        panel.style.display = 'none';
      }
    });
  };

  return (
    <>
      {scroll && <div style={{ height: `${headerHeight}px` }} />}

      <div className='overlay' />
      <div className={`side-overlay ${(menuActive || activeAllCategory) && "show"}`} onClick={() => {
        handleMenuToggle();
        handleCategoryToggle();
      }} />

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOverlay && "active"}`} onClick={handleMobileMenuToggle} />

      {/* Search Box */}
      <form action='#' className={`search-box ${activeSearch && "active"}`}>
        <button
          onClick={handleSearchToggle}
          type='button'
          className='search-box__close position-absolute inset-block-start-0 inset-inline-end-0 m-16 w-48 h-48 border border-gray-100 rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1'
        >
          <i className='ph ph-x' />
        </button>
        <div className='container'>
          <div className='position-relative'>
            <input
              type='text'
              className='form-control py-16 px-24 text-xl rounded-pill pe-64'
              placeholder='Search for a material'
            />
            <button
              type='submit'
              className='w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8'
            >
              <i className='ph ph-magnifying-glass' />
            </button>
          </div>
        </div>
      </form>

      {/* Mobile Category Menu (NEW) */}
      <div className={`mobile-category-menu ${mobileMenuOpen && "active"}`}>
        <div className='mobile-menu-header'>
          <h3>Categories</h3>
          <button className='close-btn' onClick={handleMobileMenuToggle}>
            <i className='ph ph-x' />
          </button>
        </div>

        <div className='mobile-menu-content'>
          {isLoading ? (
            <div className='text-center py-16'>Loading...</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className='mobile-category-item'>
                <div
                  className={`mobile-category-title ${mobileExpandedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleMobileCategoryClick(category.id)}
                >
                  <i className='ph ph-stack' />
                  <span>{category.name}</span>
                  <i className='ph ph-caret-down arrow' />
                </div>

                <div className={`mobile-product-types ${mobileExpandedCategory === category.id ? 'expanded' : ''}`}>
                  {category.product_types && category.product_types.length > 0 ? (
                    category.product_types.map((productType) => (
                      <div key={productType.id} className='mobile-product-type'>
                        <div className='mobile-type-title'>{productType.name}</div>
                        <div className='mobile-materials-list'>
                          {productType.materials && productType.materials.length > 0 ? (
                            productType.materials.map((material) => (
                              <Link
                                key={material.id}
                                to={`/product-details-material?type=${productType.id}&material=${material.id}`}
                                className='mobile-material-link'
                                onClick={handleMobileMenuToggle}
                              >
                                {material.name}
                              </Link>
                            ))
                          ) : (
                            <div className='mobile-material-link' style={{ opacity: 0.5, cursor: 'default' }}>
                              No materials available
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='mobile-product-type'>
                      <div className='mobile-materials-list'>
                        <div className='mobile-material-link' style={{ opacity: 0.5, cursor: 'default' }}>
                          No product types available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>




      {/* Mobile Menu - Keep existing */}
      <div className={`mobile-menu scroll-sm d-lg-none d-block ${menuActive && "active"}`}>
        <button
          onClick={() => {
            handleMenuToggle();
            setActiveIndex(null);
          }}
          type='button'
          className='close-button'
        >
          <i className='ph ph-x' />
        </button>
        <div className='mobile-menu__inner'>
          <Link to='/' className='mobile-menu__logo'>
            <img src='assets/images/logo/logo.png' alt='Logo' />
          </Link>
          <div className='mobile-menu__menu'>
            {/* Keep your existing mobile menu items */}
          </div>
        </div>
      </div>







      {/* Middle Header */}
      <header
        ref={headerRef}
        className={`header-middle style-two bg-color-neutral ${scroll ? 'header-scrolled' : ''}`}
      >
        <div className='container container-lg'>
          <nav className='header-inner flex-between'>

            {/* 1. Mobile Menu Toggle (3-dot icon) - First on Mobile */}
            <button
              className='mobile-menu-toggle'
              onClick={handleMobileMenuToggle}
              aria-label='Toggle menu'
            >
              <div className={`menu-icon ${mobileMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>

            {/* 2. Logo - Second on Mobile, First on Desktop */}
            <div className='logo'>
              <Link to='/' className='link'>
                <div className='logo-wrapper'>
                  <img
                    src='assets/images/logo/pandalogo.png'
                    alt='Logo'
                    className='logo-image'
                  />
                  <div className='logo-shine'></div>
                  <div className='bubbles-container'>
                    <span className='bubble'></span>
                    <span className='bubble'></span>
                    <span className='bubble'></span>
                    <span className='bubble'></span>
                    <span className='bubble'></span>
                  </div>
                </div>
                <span className='logo-tagline'>You think it. We print it.</span>
              </Link>
            </div>

            {/* 3. Search Section - Hidden on mobile */}
            <div className='flex-align gap-16 search-section'>
              <form action='#' className='flex-align flex-wrap form-location-wrapper'>
                <div className='search-category style-two d-flex h-48 search-form d-sm-flex d-none enhanced-search'>
                  <select
                    className='js-example-basic-single border border-gray-200 border-end-0 rounded-0 border-0 category-select'
                    name='category'
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <div className='search-form__wrapper position-relative'>
                    <input
                      type='text'
                      className='search-form__input common-input py-13 ps-16 pe-18 rounded-0 border-0'
                      placeholder='Search for a product or brand'
                    />
                    <div className='search-underline'></div>
                  </div>
                  <button
                    type='submit'
                    className='bg-main-two-600 flex-center text-xl text-white flex-shrink-0 w-48 hover-bg-main-two-700 d-lg-flex d-none search-btn'
                  >
                    <i className='ph ph-magnifying-glass' />
                  </button>
                </div>
              </form>
            </div>

            {/* Header Icons */}
            {/* Header Icons */}
            <div className='header-right flex-align'>
              <div className='header-two-activities flex-align flex-wrap gap-32'>
                {/* Profile/Login dropdown */}
                {isAuthenticated ? (
                  <div
                    className="profile-dropdown"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={profileBtnRef}
                  >
                    <div className="profile-dropdown__toggle flex-align flex-column gap-8 header-icon-btn">
                      <span className="text-2xl d-flex position-relative">
                        <i className="ph ph-user icon-animated" style={{ color: 'white !important' }} />
                        <span className="icon-ripple"></span>
                      </span>
                      <span className="text-md text-white item-hover__text d-none d-lg-flex">
                        Profile
                      </span>
                    </div>

                    {dropdownOpen && ReactDOM.createPortal(
                      <ul
                        className="profile-dropdown__menu"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                        style={{
                          position: 'fixed',
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                          minWidth: '180px',
                          background: 'linear-gradient(135deg, #62d3e4 0%, #6470da 100%)',
                          borderRadius: '14px',
                          boxShadow: '0 8px 32px rgba(24,40,120,0.25)',
                          padding: '12px 0',
                          zIndex: 9999,
                          border: '1.5px solid #bee3f8',
                          listStyle: 'none',
                          margin: 0
                        }}
                      >
                        <li style={{
                          padding: '10px 20px',
                          fontWeight: 700,
                          color: '#fff',
                          fontSize: '15px',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          marginBottom: '4px',
                          background: 'linear-gradient(90deg, rgba(100, 112, 218, 0.3) 0%, rgba(98, 211, 228, 0.3) 100%)'
                        }}>
                          Profile
                        </li>
                        <li>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 20px',
                              color: '#fff',
                              textDecoration: 'none',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              fontWeight: 500,
                              letterSpacing: '0.3px'
                            }}
                          >
                            <i className="ph ph-user-circle" style={{ fontSize: '16px' }}></i>
                            My Account
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              logout();
                              setDropdownOpen(false);
                              navigate('/account');
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 20px',
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              color: '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              fontWeight: 500,
                              letterSpacing: '0.3px'
                            }}
                          >
                            <i className="ph ph-sign-out" style={{ fontSize: '16px' }}></i>
                            Logout
                          </button>
                        </li>
                      </ul>,
                      document.body
                    )}
                  </div>
                ) : (
                  <Link
                    to='/account'
                    className='flex-align flex-column gap-8 item-hover-two header-icon-btn'
                  >
                    <span className='text-2xl d-flex position-relative'>
                      <i className='ph ph-user icon-animated' style={{ color: 'white !important' }} />
                      <span className='icon-ripple'></span>
                    </span>
                    <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                      Login
                    </span>
                  </Link>
                )}

                {/* Wishlist */}
                <Link
                  to='/wishlist'
                  className='flex-align flex-column gap-8 item-hover-two header-icon-btn'
                >
                  <span className='text-2xl d-flex position-relative me-6 mt-6'>
                    <i className='ph ph-heart icon-animated' style={{ color: 'white !important' }} />
                    <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4 badge-pulse'>
                      2
                    </span>
                    <span className='icon-ripple'></span>
                  </span>
                  <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                    Wishlist
                  </span>
                </Link>



                {/* Cart */}
                <Link
                  to='/cart'
                  className='flex-align flex-column gap-8 item-hover-two header-icon-btn cart-special'
                >
                  <span className='text-2xl d-flex position-relative me-6 mt-6'>
                    <i className='ph ph-shopping-cart-simple icon-animated' style={{ color: 'white !important' }} />
                    <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4 badge-pulse cart-badge'>
                      2
                    </span>
                    <span className='icon-ripple'></span>
                  </span>
                  <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                    Cart
                  </span>
                </Link>
              </div>
            </div>

          </nav>
        </div>
      </header>

      {/* ==================== Enhanced Navigation Header Start ==================== */}
      <header className={`header bg-white border-bottom border-gray-100 ${scroll && "fixed-header"}`}>
        <div className='container container-lg'>
          <nav className='header-inner d-flex justify-content-between gap-8'>
            <div className='flex-align menu-category-wrapper'>

              {/* ALL CATEGORIES BUTTON - KEEP EXISTING */}
              <div className='category on-hover-item'>
                <button
                  onClick={handleCategoryToggle}
                  type='button'
                  className='category__button flex-align gap-8 fw-medium p-16 border-end border-start border-gray-100 text-heading'
                >
                  <span className='icon text-2xl d-xs-flex d-none'>
                    <i className='ph ph-dots-nine' />
                  </span>
                  <span className='d-sm-flex d-none'>All</span> Categories
                  <span className='arrow-icon text-xl d-flex'>
                    <i className='ph ph-caret-down' />
                  </span>
                </button>

                {/* ALL CATEGORIES DROPDOWN - KEEP EXISTING */}
                <div className={`responsive-dropdown cat on-hover-dropdown common-dropdown nav-submenu p-0 submenus-submenu-wrapper ${activeAllCategory && "active"}`}>
                  <button
                    onClick={() => {
                      handleCategoryToggle();
                      setActiveIndexCat(null);
                    }}
                    type='button'
                    className='close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex'
                  >
                    <i className='ph ph-x' />
                  </button>

                  <div className='logo px-16 d-lg-none d-block'>
                    <Link to='/' className='link'>
                      <img src='assets/images/logo/logo.png' alt='Logo' />
                    </Link>
                  </div>

                  <ul className='scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto'>
                    {isLoading ? (
                      <li className='text-center py-16'>Loading...</li>
                    ) : (
                      categories.map((category, index) => (
                        <li
                          key={category.id}
                          onClick={() => handleCatClick(index)}
                          className={`has-submenus-submenu ${activeIndexCat === index ? "active" : ""}`}
                        >
                          <Link to='#' className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'>
                            <span className='text-xl d-flex'>
                              <i className='ph ph-stack' />
                            </span>
                            <span>{category.name}</span>
                            <span className='icon text-md d-flex ms-auto'>
                              <i className='ph ph-caret-right' />
                            </span>
                          </Link>

                          <div className={`submenus-submenu py-16 ${activeIndexCat === index ? "open" : ""}`}>
                            <h6 className='text-lg px-16 submenus-submenu__title'>
                              {category.name}
                            </h6>
                            <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                              {category.product_types && category.product_types.length > 0 ? (
                                category.product_types.map((productType) => (
                                  <li key={productType.id}>
                                    <Link to={`/product-details?type=${productType.id}`}>
                                      {productType.name}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <li className='text-gray-400 px-16 py-8'>
                                  No product types
                                </li>
                              )}
                            </ul>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              {/* INDIVIDUAL CATEGORY NAVIGATION - NEW */}
              <ul className='category-nav-list'>
                {isLoading ? (
                  <li className='text-center py-16'>Loading...</li>
                ) : (
                  categories.map((category) => (
                    <li
                      key={category.id}
                      className='category-nav-item'
                      onMouseEnter={() => handleCategoryHover(category.id)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      <Link to={`#`} className='category-nav-link'>
                        <span className='category-icon'>
                          <i className='ph ph-stack' />
                        </span>
                        <span className='category-name'>{category.name}</span>
                        <span className='category-arrow'>
                          <i className='ph ph-caret-down' />
                        </span>
                      </Link>

                      {/* Mega Dropdown with Product Types and Materials */}
                      <div className={`category-mega-dropdown ${activeCategory === category.id ? 'active' : ''}`}>
                        <div className='mega-dropdown-inner'>
                          <div className='mega-dropdown-header'>
                            <h3 className='mega-dropdown-title'>{category.name}</h3>
                            {/* <p className='mega-dropdown-subtitle'>
                              {category.product_types?.length || 0} Product Types
                            </p> */}
                          </div>

                          <div className='product-types-wrapper'>
                            {category.product_types && category.product_types.length > 0 ? (
                              category.product_types.map((productType) => (
                                <div key={productType.id} className='product-type-section'>
                                  <h4 className='product-type-title'>
                                    <i className='ph ph-package' /> {productType.name}
                                    {productType.is_custom_size && (
                                      <span className='custom-size-badge'>Custom Size</span>
                                    )}
                                  </h4>

                                  <div className='materials-grid'>
                                    {productType.materials && productType.materials.length > 0 ? (
                                      productType.materials.map((material) => (
                                        <Link
                                          key={material.id}
                                          to={`/product-details-material?type=${productType.id}&material=${material.id}`}
                                          className='material-card'
                                          onMouseEnter={(e) => handleMaterialHover(e, material, productType, category.id)}
                                          onMouseLeave={(e) => handleMaterialLeave(e, category.id)}
                                        >
                                          {material.swatch_url && (
                                            <div className='material-image'>
                                              <img
                                                src={material.swatch_url}
                                                alt={material.name}
                                                onError={(e) => {
                                                  e.target.src = 'assets/images/thumbs/default-material.png';
                                                }}
                                              />
                                            </div>
                                          )}
                                          <div className='material-info'>
                                            <h5 className='material-name'>{material.name}</h5>
                                          </div>
                                        </Link>
                                      ))
                                    ) : (
                                      <div className='no-materials-message'>
                                        <p>No materials available</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className='no-products-message'>
                                <i className='ph ph-package' />
                                <p>No product types available</p>
                              </div>
                            )}
                          </div>

                          {category.product_types && category.product_types.length > 0 && (
                            <div className='mega-dropdown-footer'>
                              <Link to={`/shop?category=${category.id}`} className='view-all-link'>
                                View All {category.name} <i className='ph ph-arrow-right' />
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Material Hover Preview Panel - UNIQUE PER CATEGORY */}
                        <div
                          className='material-preview-panel'
                          id={`materialPreviewPanel-${category.id}`}
                          onMouseEnter={() => clearPreviewTimeout(category.id)}
                          onMouseLeave={() => handlePreviewPanelLeave(category.id)}
                          style={{ display: 'none' }}
                        >
                          <div className='material-preview-image'>
                            <img src='' alt='' id={`previewImage-${category.id}`} />
                          </div>
                          <div className='material-preview-content'>
                            <h4 className='material-preview-title' id={`previewTitle-${category.id}`}></h4>
                            <p className='material-preview-type' id={`previewType-${category.id}`}></p>
                            <p className='material-preview-description' id={`previewDescription-${category.id}`}></p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>

            </div>
          </nav>
        </div>
      </header>
      {/* ==================== Enhanced Navigation Header End ==================== */}


    </>
  );
};

export default HeaderOne;
