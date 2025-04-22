import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/gardenbaylogo2.png';
import SalesTab from './components/SalesTab';

// Define product type
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  quantity: number;
  date: string;
  expiryDate: string;
  supplier: string;
  archived: boolean;
}

function App() {
  const [selectedButton, setSelectedButton] = useState<string>('checkStocks');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductImage, setNewProductImage] = useState<string>('');
  const [newProductQuantity, setNewProductQuantity] = useState<string>('0');
  const [newProductExpiryDate, setNewProductExpiryDate] = useState<string>('');
  const [newProductSupplier, setNewProductSupplier] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentEditProduct, setCurrentEditProduct] = useState<Product | null>(null);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // Add resize event listener for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close sidebar automatically on small screens
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    // Close sidebar after selection on small screens
    if (windowWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setNewProductName('');
    setNewProductImage('');
    setNewProductQuantity('0');
    setNewProductExpiryDate('');
    setNewProductSupplier('');
  };

  const openEditProductModal = (product: Product) => {
    setCurrentEditProduct(product);
    setNewProductName(product.name);
    setNewProductImage(product.imageUrl);
    setNewProductQuantity(product.quantity.toString());
    setNewProductExpiryDate(product.expiryDate);
    setNewProductSupplier(product.supplier);
    setIsEditProductModalOpen(true);
  };

  const closeEditProductModal = () => {
    setIsEditProductModalOpen(false);
    setCurrentEditProduct(null);
    setNewProductName('');
    setNewProductImage('');
    setNewProductQuantity('0');
    setNewProductExpiryDate('');
    setNewProductSupplier('');
  };

  const handleAddProduct = () => {
    if (newProductName.trim() === '') {
      alert('Please enter a product name');
      return;
    }

    const quantity = parseInt(newProductQuantity) || 0;
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const newProduct: Product = {
      id: Date.now(),
      name: newProductName,
      imageUrl: newProductImage || '/api/placeholder/100/100', // Use placeholder if no image provided
      quantity: quantity,
      date: currentDate,
      expiryDate: newProductExpiryDate,
      supplier: newProductSupplier,
      archived: false
    };

    setProducts([...products, newProduct]);
    closeAddProductModal();
  };

  const handleUpdateProduct = () => {
    if (!currentEditProduct) return;

    if (newProductName.trim() === '') {
      alert('Please enter a product name');
      return;
    }

    const quantity = parseInt(newProductQuantity) || 0;

    const updatedProducts = products.map(product => {
      if (product.id === currentEditProduct.id) {
        return {
          ...product,
          name: newProductName,
          imageUrl: newProductImage || product.imageUrl,
          quantity: quantity,
          expiryDate: newProductExpiryDate,
          supplier: newProductSupplier
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    closeEditProductModal();
  };

  const handleArchiveProduct = (productId: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, archived: true };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const handleUnarchiveProduct = (productId: number) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, archived: false };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected image file
      const imageUrl = URL.createObjectURL(file);
      setNewProductImage(imageUrl);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (showArchived ? true : !product.archived)
  );

  // Function to check if a product is expired
  const isExpired = (expiryDate: string): boolean => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="app-container">
      {/* Fixed Header */}
      <div className="header-container">
        <button className="menu-button" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <img src={logo} alt="Logo" className="header-logo" />
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="main-content">
        {/* Fixed Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
          <button
            className={`menu-action-button ${selectedButton === 'checkStocks' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('checkStocks')}
          >
            Check Stocks
          </button>
          <button
            className={`menu-action-button ${selectedButton === 'purchase' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('purchase')}
          >
            Purchase
          </button>
          <button
            className={`menu-action-button ${selectedButton === 'sales' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('sales')}
          >
            Sales
          </button>
        </div>

        {/* Tab Content */}
        <div className={`tab-content-wrapper ${isSidebarOpen ? '' : 'shifted'}`}>
          {selectedButton === 'checkStocks' && (
            <div className="stocks-content">
              {/* Search and Add Product Container */}
              <div className="top-controls-container">
                <div className="inventory-search-container">
                  <span className="inventory-label">Inventory</span>
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label className="archive-toggle">
                    <input
                      type="checkbox"
                      checked={showArchived}
                      onChange={() => setShowArchived(!showArchived)}
                    />
                    Show Archived
                  </label>
                </div>
                <button className="add-product-button" onClick={openAddProductModal}>
                  Add Product
                </button>
              </div>
              <h2>Check Stocks</h2>

              {/* Products Table */}
              {filteredProducts.length > 0 ? (
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Date Added</th>
                        <th>Expiry Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id} className={`product-row ${product.archived ? 'archived' : ''}`}>
                          <td className="product-image-cell">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-table-image"
                                onError={(e) => {
                                  // Handle image loading error by replacing with N/A text
                                  const target = e.target as HTMLImageElement;
                                  const parent = target.parentNode as HTMLElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="product-image-placeholder">N/A</div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="product-image-placeholder">N/A</div>
                            )}
                          </td>
                          <td className="product-name-cell">{product.name}</td>
                          <td className="product-quantity-cell">{product.quantity}</td>
                          <td className="product-date-cell">{product.date}</td>
                          <td className={`product-expiry-cell ${isExpired(product.expiryDate) ? 'expired-product' : ''}`}>
                            {product.expiryDate || 'N/A'}
                          </td>
                          <td className="product-supplier-cell">{product.supplier || 'N/A'}</td>
                          <td className="product-actions-cell">
                            <button
                              className="edit-button"
                              onClick={() => openEditProductModal(product)}
                            >
                              Update
                            </button>
                            {!product.archived ? (
                              <button
                                className="archive-button"
                                onClick={() => handleArchiveProduct(product.id)}
                              >
                                Archive
                              </button>
                            ) : (
                              <button
                                className="unarchive-button"
                                onClick={() => handleUnarchiveProduct(product.id)}
                              >
                                Unarchive
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-products-message">No products available. Add products using the "Add Product" button.</p>
              )}
            </div>
          )}
          {selectedButton === 'purchase' && (
            <div>
              <h2>Purchase</h2>
              <p>Track and manage your purchases here.</p>
            </div>
          )}
          {selectedButton === 'sales' && (
            <div>
              <SalesTab />
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Product</h2>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                  type="text"
                  id="productName"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="productQuantity">Quantity:</label>
                <input
                  type="number"
                  id="productQuantity"
                  value={newProductQuantity}
                  min="0"
                  onChange={(e) => setNewProductQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="form-group">
                <label htmlFor="productExpiryDate">Expiry Date:</label>
                <input
                  type="date"
                  id="productExpiryDate"
                  value={newProductExpiryDate}
                  onChange={(e) => setNewProductExpiryDate(e.target.value)}
                />
              </div>
              
             
              <div className="form-group">
                <label htmlFor="productImage">Product Image:</label>
                <div className="image-upload-container">
                  {newProductImage ? (
                    <img src={newProductImage} alt="Product preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeAddProductModal}>
                  Cancel
                </button>
                <button className="modal-button submit" onClick={handleAddProduct}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditProductModalOpen && currentEditProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Edit Product</h2>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="editProductName">Product Name:</label>
                <input
                  type="text"
                  id="editProductName"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductQuantity">Quantity:</label>
                <input
                  type="number"
                  id="editProductQuantity"
                  value={newProductQuantity}
                  min="0"
                  onChange={(e) => setNewProductQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductExpiryDate">Expiry Date:</label>
                <input
                  type="date"
                  id="editProductExpiryDate"
                  value={newProductExpiryDate}
                  onChange={(e) => setNewProductExpiryDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductSupplier">Supplier:</label>
                <input
                  type="text"
                  id="editProductSupplier"
                  value={newProductSupplier}
                  onChange={(e) => setNewProductSupplier(e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editProductImage">Product Image:</label>
                <div className="image-upload-container">
                  {newProductImage ? (
                    <img src={newProductImage} alt="Product preview" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                  <input
                    type="file"
                    id="editProductImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeEditProductModal}>
                  Cancel
                </button>
                <button className="modal-button submit" onClick={handleUpdateProduct}>
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;