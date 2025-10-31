import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCountdown } from '../helper/Countdown';

const ProductDetailsMaterial = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const typeId = searchParams.get('type');
    const materialId = searchParams.get('material');

    // States
    const [productType, setProductType] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [customizationFields, setCustomizationFields] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(getCountdown());
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [customizationSelections, setCustomizationSelections] = useState({});
   // State remains the same
const [width, setWidth] = useState(36);
const [height, setHeight] = useState(24);

// Text input handlers with number validation
const handleWidthChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string during editing
    if (value === '') {
        setWidth('');
        return;
    }
    
    // Only allow digits
    if (/^\d+$/.test(value)) {
        const numValue = parseInt(value);
        if (numValue >= 0 && numValue <= 9999) { // Max reasonable size
            setWidth(numValue);
        }
    }
};

    const addToWishlist = () => {
        const existing = JSON.parse(localStorage.getItem('wishlist')) || [];
        const exists = existing.find(
            item => item.product_type.id === productType.id && item.materials.some(m => m.id === selectedMaterial.id)
        );
        let newWishlist;
        if (!exists) {
            newWishlist = [...existing];
            const found = newWishlist.find(item => item.product_type.id === productType.id);
            if (found) {
                found.materials.push(selectedMaterial);
            } else {
                newWishlist.push({
                    id: productType.id, // Simplify id to productType id
                    product_type: productType,
                    materials: [selectedMaterial]
                });
            }
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            alert("Added to wishlist!");
        } else {
            alert("This material is already in your wishlist.");
        }
    };
    // Add to cart function - saves customized product with price details
    const addToCart = () => {
        if (!productType || !selectedMaterial) {
            alert("Please select a product and material");
            return;
        }

        // Calculate final price details
        const priceDetails = calculatePrice();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Create cart item with all customization details
        const cartItem = {
            product_type: productType,
            material: {
                ...selectedMaterial,
                customized_price: parseFloat(priceDetails.subtotal) // Store the calculated subtotal per unit
            },
            quantity: quantity,
            customization: {
                width: width,
                height: height,
                area_sqft: parseFloat(priceDetails.areaSqFt),
                selections: customizationSelections,
                fields: customizationFields
            },
            price_breakdown: {
                base_price: parseFloat(priceDetails.basePrice),
                material_cost: parseFloat(priceDetails.materialCost),
                flat_modifiers: parseFloat(priceDetails.flatModifiers),
                subtotal: parseFloat(priceDetails.subtotal),
                quantity: quantity,
                total: parseFloat(priceDetails.total)
            }
        };

        // Check if same item exists (same product type, material, and customization)
        const existingIndex = cart.findIndex(item =>
            item.product_type.id === productType.id &&
            item.material.id === selectedMaterial.id &&
            JSON.stringify(item.customization) === JSON.stringify(cartItem.customization)
        );

        if (existingIndex > -1) {
            // Update quantity if same item exists
            cart[existingIndex].quantity += quantity;
            cart[existingIndex].price_breakdown.quantity = cart[existingIndex].quantity;
            cart[existingIndex].price_breakdown.total =
                cart[existingIndex].price_breakdown.subtotal * cart[existingIndex].quantity;
        } else {
            // Add new item
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Added ${quantity} item(s) to cart!`);
        navigate('/cart');
    };


const handleHeightChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string during editing
    if (value === '') {
        setHeight('');
        return;
    }
    
    // Only allow digits
    if (/^\d+$/.test(value)) {
        const numValue = parseInt(value);
        if (numValue >= 0 && numValue <= 9999) { // Max reasonable size
            setHeight(numValue);
        }
    }
};

const handleWidthBlur = () => {
    if (width === '' || width === 0) {
        setWidth(1);
    }
};

const handleHeightBlur = () => {
    if (height === '' || height === 0) {
        setHeight(1);
    }
};


    // Zoom states
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    // ========================================
    // UPDATED PRICE CALCULATION
    // ========================================
    const calculatePrice = () => {
        if (!selectedMaterial || !productType) {
            return {
                basePrice: '0.00',
                areaSqFt: '0.00',
                materialCost: '0.00',
                flatModifiers: '0.00',
                subtotal: '0.00',
                total: '0.00'
            };
        }

        // 1. BASE PRICE from product type
        const basePrice = parseFloat(productType.base_unit_cost || 0);

        // 2. AREA CALCULATION (width × height in inches → square feet)
        const areaSqFt = (width * height) / 144;

        // 3. MATERIAL COST (material cost per sqft × area)
        const materialCost = parseFloat(selectedMaterial.material_cost_per_sqft || 0) * areaSqFt;

        // 4. FIELD OPTIONS FLAT MODIFIERS ONLY
        let flatModifiers = 0;

        // Loop through all selected customization options
        Object.keys(customizationSelections).forEach(fieldId => {
            const selection = customizationSelections[fieldId];
            const field = customizationFields.find(f => f.id === parseInt(fieldId));

            if (field && field.options) {
                const selectedOption = field.options.find(opt => opt.id === selection.id);

                if (selectedOption && selectedOption.price_modifier_flat) {
                    flatModifiers += parseFloat(selectedOption.price_modifier_flat);
                }
            }
        });

        // 5. CALCULATE SUBTOTAL (base + material + flat modifiers)
        const subtotal = basePrice + materialCost + flatModifiers;

        // 6. FINAL TOTAL × QUANTITY
        const finalTotal = subtotal * quantity;

        return {
            basePrice: basePrice.toFixed(2),
            areaSqFt: areaSqFt.toFixed(2),
            materialCost: materialCost.toFixed(2),
            flatModifiers: flatModifiers.toFixed(2),
            subtotal: subtotal.toFixed(2),
            total: finalTotal.toFixed(2)
        };
    };

    // Get similar materials (excluding selected one)
    const getSimilarMaterials = () => {
        if (!materials || !selectedMaterial) return [];
        return materials.filter(mat => mat.id !== selectedMaterial.id);
    };

    // FETCH DATA when typeId or materialId changes
    useEffect(() => {
        setIsLoading(true);

        const fetchProductType = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/product-types/${typeId}/`
                );

                setProductType(res.data);

                const materialsData = res.data.materials || [];
                setMaterials(materialsData);

                // Find the material to select
                let materialToSelect = null;

                if (materialId) {
                    materialToSelect = materialsData.find(m => m.id === parseInt(materialId));
                }

                if (!materialToSelect && materialsData.length > 0) {
                    materialToSelect = materialsData[0];
                }

                if (materialToSelect) {
                    setSelectedMaterial(materialToSelect);

                    // Update images
                    const sortedImages = [...(materialToSelect.product_images || [])].sort(
                        (a, b) => a.display_order - b.display_order
                    );
                    setProductImages(sortedImages);

                    const mainImg = sortedImages.find(img => img.role === 'MAIN') || sortedImages[0];
                    setMainImage(mainImg?.image_url || 'assets/images/thumbs/placeholder.png');
                    setActiveImageIndex(0);

                    // Set customization fields
                    const fields = materialToSelect.customization_fields || [];
                    setCustomizationFields(fields);

                    // AUTO-SELECT FIRST OPTION FOR EACH FIELD
                    const defaultSelections = {};
                    fields.forEach(field => {
                        if (field.options && field.options.length > 0) {
                            const firstOption = field.options[0];
                            defaultSelections[field.id] = {
                                id: firstOption.id,
                                value: firstOption.value
                            };
                        }
                    });
                    setCustomizationSelections(defaultSelections);
                } else {
                    setMainImage('assets/images/thumbs/placeholder.png');
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching product type:", error);
                setIsLoading(false);
            }
        };

        if (typeId) {
            fetchProductType();
        }
    }, [typeId, materialId]);

    // Handle material selection - UPDATE URL
    const handleMaterialSelection = (material) => {
        navigate(`/product-details-material?type=${typeId}&material=${material.id}`);
    };

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getCountdown());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : quantity);

    const handleCustomizationChange = (fieldId, optionId, optionValue) => {
        setCustomizationSelections(prev => ({
            ...prev,
            [fieldId]: { id: optionId, value: optionValue }
        }));
    };

    // Handle thumbnail click
    const handleThumbnailClick = (image, index) => {
        setMainImage(image.image_url);
        setActiveImageIndex(index);
    };

    // Navigate through images
    const navigateImage = (direction) => {
        if (!productImages || productImages.length === 0) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = activeImageIndex < productImages.length - 1 ? activeImageIndex + 1 : 0;
        } else {
            newIndex = activeImageIndex > 0 ? activeImageIndex - 1 : productImages.length - 1;
        }

        setActiveImageIndex(newIndex);
        setMainImage(productImages[newIndex].image_url);
    };

    // Zoom handlers
    const handleMouseEnter = () => setIsZoomed(true);
    const handleMouseLeave = () => setIsZoomed(false);

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    // Scroll thumbnails
    const scrollThumbnails = (direction) => {
        const container = document.querySelector('.thumbnails-scroll-container');
        if (container) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        navigateImage(direction === 'left' ? 'prev' : 'next');
    };




    // Render customization field
    const renderCustomizationField = (field) => {
        const fieldType = field.field_type?.toUpperCase();

        if (fieldType === 'IMAGE_CARD') {
            return (
                <div key={field.id} className="form-group">
                    <label>
                        {field.field_name}
                        {field.is_required && <span className="required"> *</span>}
                    </label>
                    <div className="image-card-options">
                        {field.options && field.options.map(option => (
                            <div
                                key={option.id}
                                className={`image-card-item ${customizationSelections[field.id]?.id === option.id ? 'selected' : ''}`}
                                onClick={() => handleCustomizationChange(field.id, option.id, option.value)}
                            >
                                {option.image_url && (
                                    <img src={option.image_url} alt={option.value} />
                                )}
                                <span className="option-label">{option.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div key={field.id} className="form-group">
                <div className="form-row">
                    <label>
                        {field.field_name}
                        {field.is_required && <span className="required"> *</span>}
                    </label>
                    <select
                        className="form-select"
                        value={customizationSelections[field.id]?.id || ''}
                        onChange={(e) => {
                            const selectedOption = field.options.find(opt => opt.id === parseInt(e.target.value));
                            if (selectedOption) {
                                handleCustomizationChange(field.id, selectedOption.id, selectedOption.value);
                            }
                        }}
                    >
                        {field.options && field.options.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.value}
                                {option.price_modifier_flat > 0 && ` (+$${parseFloat(option.price_modifier_flat).toFixed(2)})`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="product-details-wrapper">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!productType) {
        return (
            <div className="product-details-wrapper">
                <div className="loading-state">
                    <p>Product not found</p>
                </div>
            </div>
        );
    }

    const priceDetails = calculatePrice();
    const similarMaterials = getSimilarMaterials();

    return (
        <div className="product-details-wrapper product-details-material">
            <section className="product-details py-80">
                <div className="container container-lg">
                    <div className="product-main-grid">
                        {/* LEFT COLUMN */}
                        <div className="product-left-column">
                            {/* Images Section */}
                            <div className="product-images-section">
                                <div
                                    className="main-image-container"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                    ref={imageRef}
                                >
                                    <div className="image-badge">Premium Quality</div>
                                    <img
                                        src={mainImage}
                                        alt={productType.name}
                                        key={`main-${mainImage}`}
                                        style={{
                                            transform: isZoomed ? 'scale(3.5)' : 'scale(1)',
                                            transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                                            transition: 'none'
                                        }}
                                    />
                                    {isZoomed && (
                                        <div className="zoom-hint">
                                            <i className="ph ph-magnifying-glass-plus" /> Move to zoom
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {productImages && productImages.length > 1 && (
                                    <div className="thumbnails-wrapper">
                                        <button
                                            className="thumbnail-nav-btn left"
                                            onClick={() => scrollThumbnails('left')}
                                            type="button"
                                        >
                                            <i className="ph ph-caret-left" />
                                        </button>

                                        <div className="thumbnails-scroll-container">
                                            {productImages.map((image, index) => (
                                                <div
                                                    key={`thumb-${image.id}-${index}`}
                                                    className={`thumbnail-item ${activeImageIndex === index ? 'active' : ''}`}
                                                    onClick={() => handleThumbnailClick(image, index)}
                                                >
                                                    <img
                                                        src={image.image_url}
                                                        alt={image.caption || `Thumbnail ${index + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            className="thumbnail-nav-btn right"
                                            onClick={() => scrollThumbnails('right')}
                                            type="button"
                                        >
                                            <i className="ph ph-caret-right" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="product-info-section">
                                <h1 className="product-title">{selectedMaterial?.name}</h1>
                                <p className="product-subtitle">
                                    {productType.description || 'Vibrant – Durable – Weather-Resistant'}
                                </p>

                                <div className="rating-section">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="ph-fill ph-star" />
                                        ))}
                                    </div>
                                    <span className="rating-text">4.7</span>
                                    <span className="reviews-count">(21,671 Reviews)</span>
                                </div>

                                <p className="product-description">
                                    {productType.long_description || `Personalized ${productType.name} that are built to last for many years.`}
                                </p>

                                <div className="product-features">
                                    <h6><i className="ph ph-check-circle" /> Key Features</h6>
                                    <ul className="features-list">
                                        <li>
                                            <div className="check-icon"><i className="ph ph-check" /></div>
                                            <div>
                                                <span className="feature-label">Material:</span>
                                                <span className="feature-value">{selectedMaterial?.name || 'Premium quality materials'}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="check-icon"><i className="ph ph-check" /></div>
                                            <div>
                                                <span className="feature-label">Customization:</span>
                                                <span className="feature-value">Fully customizable designs</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="check-icon"><i className="ph ph-check" /></div>
                                            <div>
                                                <span className="feature-label">Durability:</span>
                                                <span className="feature-value">Weather-resistant, built to last</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="check-icon"><i className="ph ph-check" /></div>
                                            <div>
                                                <span className="feature-label">Installation:</span>
                                                <span className="feature-value">Easy setup with support</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="product-right-sidebar">
                            <div className="sidebar-card">
                                {/* Selected Material Display */}
                                {selectedMaterial && (
                                    <div className="selected-material-display">
                                        <div className="material-display-header">
                                            <i className="ph ph-package" />
                                            <h5>Selected Material</h5>
                                        </div>
                                        <div className="material-display-content">
                                            <div className="material-display-image">
                                                {selectedMaterial.image_swatch ? (
                                                    <img src={selectedMaterial.image_swatch} alt={selectedMaterial.name} />
                                                ) : (
                                                    <i className="ph ph-image" />
                                                )}
                                            </div>
                                            <div className="material-display-info">
                                                <h6 className="material-display-name">{selectedMaterial.name}</h6>
                                                <p className="material-display-price">
                                                    ${parseFloat(selectedMaterial.material_cost_per_sqft).toFixed(2)} per sq ft
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="customization-section">
                                    <div className="sidebar-header">
                                        <i className="ph ph-sliders" />
                                        <h5>Customize Your Product</h5>
                                    </div>

                                    {/* Size Inputs */}
                                    {/* Size Inputs - Required Fields */}
                                    <div className="form-group">
                                        <div className="form-row">
                                            <label>
                                                Size (in Inches) <span className="required">*</span>
                                            </label>
                                            <div className="size-inputs">
                                                <div className="size-input-group">
                                                    <label>W</label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        value={width}
                                                        onChange={handleWidthChange}
                                                        onBlur={handleWidthBlur}
                                                        placeholder="Width"
                                                        required
                                                        min="1"
                                                        aria-label="Width in inches"
                                                    />
                                                </div>
                                                <span className="separator">×</span>
                                                <div className="size-input-group">
                                                    <label>H</label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        value={height}
                                                        onChange={handleHeightChange}
                                                        onBlur={handleHeightBlur}
                                                        placeholder="Height"
                                                        required
                                                        min="1"
                                                        aria-label="Height in inches"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Dynamic Customization Fields */}
                                    {customizationFields && customizationFields.length > 0 && (
                                        <>
                                            {customizationFields.map(field => renderCustomizationField(field))}
                                        </>
                                    )}

                                    {/* Buy More Save More with Live Price */}
                                    <div className="buy-more-save-wrapper">
                                        <div className="buy-more-save">
                                            <i className="ph ph-tag" /> Buy More, Save More!
                                        </div>
                                        <div className="live-price-display">
                                            <div className="price-label">Current Price:</div>
                                            <div className="price-amount">${priceDetails.total}</div>
                                            <div className="price-breakdown">
                                                <small>
                                                    <i className="ph ph-info" />
                                                    Base: ${priceDetails.basePrice} + Material: ${priceDetails.materialCost}
                                                    {parseFloat(priceDetails.flatModifiers) > 0 && ` + Options: $${priceDetails.flatModifiers}`}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cart Section with Updated Price Breakdown */}
                                <div className="cart-section">
                                    <div className="price-summary">
                                        {/* Base Price */}
                                        <div className="price-row">
                                            <span className="label">
                                                <i className="ph ph-tag" /> Base Price:
                                            </span>
                                            <span className="value">${priceDetails.basePrice}</span>
                                        </div>

                                        {/* Area Calculation */}
                                        <div className="price-row info-row">
                                            <span className="label">
                                                <i className="ph ph-ruler" /> Size:
                                            </span>
                                            <span className="value">{width}" × {height}" ({priceDetails.areaSqFt} sq ft)</span>
                                        </div>

                                        {/* Material Cost */}
                                        <div className="price-row">
                                            <span className="label">
                                                <i className="ph ph-package" /> Material Cost:
                                            </span>
                                            <span className="value">
                                                ${priceDetails.materialCost}
                                                <small className="price-calc">
                                                    (@${parseFloat(selectedMaterial?.material_cost_per_sqft || 0).toFixed(2)}/sq ft)
                                                </small>
                                            </span>
                                        </div>

                                        {/* Options Modifiers */}
                                        {parseFloat(priceDetails.flatModifiers) > 0 && (
                                            <div className="price-row">
                                                <span className="label">
                                                    <i className="ph ph-plus-circle" /> Options:
                                                </span>
                                                <span className="value text-success">+${priceDetails.flatModifiers}</span>
                                            </div>
                                        )}

                                        {/* Quantity */}
                                        <div className="price-row">
                                            <span className="label">
                                                <i className="ph ph-stack" /> Quantity:
                                            </span>
                                            <span className="value">×{quantity}</span>
                                        </div>

                                        {/* Divider */}
                                        <div className="price-divider"></div>

                                        {/* Total */}
                                        <div className="price-row total">
                                            <span className="label">
                                                <i className="ph ph-currency-dollar-simple" /> Total:
                                            </span>
                                            <span className="value">${priceDetails.total}</span>
                                        </div>
                                    </div>

                                    <div className="quantity-selector">
                                        <label>Quantity</label>
                                        <div className="quantity-controls">
                                            <button onClick={decrementQuantity} type="button" disabled={quantity === 1}>
                                                <i className="ph ph-minus" />
                                            </button>
                                            <input type="number" value={quantity} readOnly />
                                            <button onClick={incrementQuantity} type="button">
                                                <i className="ph ph-plus" />
                                            </button>
                                        </div>
                                    </div>

                                   <div className="action-buttons">
                                        <button className="btn-primary" onClick={addToCart}>
                                            <i className="ph ph-shopping-cart" /> Add To Cart - ${priceDetails.total}
                                        </button>

                                    </div>

                                    <div className="wishlist-compare">
                                        <button onClick={addToWishlist} className="icon-btn">
                                            <i className="ph ph-heart" /> Wishlist
                                        </button>
                                        <Link to="../" className="icon-btn">
                                            <i className="ph ph-shuffle" /> Compare
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Tabs */}
                    <div className="product-tabs-section">
                        <div className="tabs-header">
                            <ul className="nav-tabs" role="tablist">
                                   <li className="nav-item">
                                    <button className="nav-link active">
                                        <i className="ph ph-article" />
                                        <span
                                            className="nav-text"
                                            style={{
                                                display: window.innerWidth <= 545 ? 'none' : 'inline'
                                            }}
                                        >
                                            Description
                                        </span>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link">
                                        <i className="ph ph-list-bullets" />
                                        <span
                                            className="nav-text"
                                            style={{
                                                display: window.innerWidth <= 545 ? 'none' : 'inline'
                                            }}
                                        >
                                            Specifications
                                        </span>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link">
                                        <i className="ph ph-star" />
                                        <span
                                            className="nav-text"
                                            style={{
                                                display: window.innerWidth <= 545 ? 'none' : 'inline'
                                            }}
                                        >
                                            Reviews
                                        </span>
                                    </button>
                                </li>
                            </ul>
                            <div className="guarantee-badge">
                                <img src="assets/images/icon/satisfaction-icon.png" alt="Guarantee" />
                                <span>100% Satisfaction Guaranteed</span>
                            </div>
                        </div>

                        <div className="tabs-content">
                            <h6><i className="ph ph-info" /> Product Description</h6>
                            <p>
                                {productType.long_description || 'High-quality materials and craftsmanship ensure that your custom product stands out and lasts for years.'}
                            </p>

                            <div className="features-grid">
                                <div className="feature-card">
                                    <div className="feature-icon"><i className="ph ph-shield-check" /></div>
                                    <h6 className="feature-title">Weather Resistant</h6>
                                    <p className="feature-text">Built to withstand harsh conditions</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon"><i className="ph ph-palette" /></div>
                                    <h6 className="feature-title">Custom Design</h6>
                                    <p className="feature-text">Fully customizable to your needs</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon"><i className="ph ph-timer" /></div>
                                    <h6 className="feature-title">Fast Production</h6>
                                    <p className="feature-text">Quick turnaround time</p>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon"><i className="ph ph-wrench" /></div>
                                    <h6 className="feature-title">Easy Installation</h6>
                                    <p className="feature-text">Simple setup with support</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Materials Section */}
                    {similarMaterials.length > 0 && (
                        <div className="similar-materials-section">
                            <div className="section-heading">
                                <h3 className="section-heading__title">
                                    <i className="ph ph-stack" /> Similar Materials
                                </h3>
                                <p className="section-heading__desc">Explore other material options for this product</p>
                            </div>

                            <div className="similar-materials-grid">
                                {similarMaterials.map(material => (
                                    <div
                                        key={material.id}
                                        className="similar-material-card"
                                        onClick={() => handleMaterialSelection(material)}
                                    >
                                        <div className="similar-material-image">
                                            {material.image_swatch ? (
                                                <img src={material.image_swatch} alt={material.name} />
                                            ) : (
                                                <i className="ph ph-image" />
                                            )}
                                        </div>
                                        <div className="similar-material-info">
                                            <h6 className="similar-material-name">{material.name}</h6>
                                            <p className="similar-material-price">
                                                ${parseFloat(material.material_cost_per_sqft).toFixed(2)} per sq ft
                                            </p>
                                            <button className="select-material-btn" type="button">
                                                <i className="ph ph-check-circle" /> Select This Material
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ProductDetailsMaterial;
