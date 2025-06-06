import React, { useState, useEffect } from 'react';
import './App.css';
import SalesTab from './components/SalesTab';
import Cookies from 'js-cookie';
import Nav from './components/nav';
import Header from './components/header';


interface MenuItem {
  id: number;
  name: string;
  image: string;
  image_url: string;
  category: string;
  description: string;
  price: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

// Interface for form validation errors
interface FormErrors {
  name?: string;
  category?: string;
  description?: string;
  price?: string;
  image?: string;
}

function Product() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);


  // for Products/menu
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [currentEditMenu, setCurrentEditMenu] = useState<MenuItem | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState<boolean>(false);

  const [newProductManagementCategory, setNewProductManagementCategory] = useState('');
  const [newProductManagementDescription, setNewProductManagementDescription] = useState('');
  const [newProductManagementPrice, setNewProductManagementPrice] = useState(0);
  const [newProductManagementName, setNewProductManagementName] = useState<string>('');
  const [newProductManagementImage, setNewProductManagementImage] = useState<string>('');
  const [newProductManagementImageFile, setNewProductManagementImageFile] = useState<File | null>();

  // Form validation state
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    const abortController = new AbortController();

    getMenu();
    getCRSF();

    return () => {
      abortController.abort();
    };

  }, []);

  const getMenu = async () => {
    try {
      const response = await fetch('http://localhost:8000/menu');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const getCRSF = async () => {
    const csrfResponse = await fetch('//localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include',
      mode: 'cors',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
      },
    });

    if (!csrfResponse.ok) throw new Error('CSRF fetch failed');

    const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
    if (!rawXsrfToken) {
      console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
      throw new Error('CSRF Token not found in cookies.');
    }
    const xsrfToken = decodeURIComponent(rawXsrfToken);
    console.log('XSRF Token:', xsrfToken);
  };

  if (menu.length > 0) {
    console.log(menu);
  } else {
    console.log('nothing');
  }

  // Add resize event listener for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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

  const filteredMenu = menu.filter(menu =>
    showArchived ? (menu.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : (menu.name.toLowerCase().includes(searchTerm.toLowerCase()) && !menu.archived)
  );

  // Validate form fields
  const validateProductForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!newProductManagementName.trim()) {
      errors.name = "Product name is required";
    }

    // Category validation
    if (!newProductManagementCategory) {
      errors.category = "Category is required";
    }

    // Price validation
    if (newProductManagementPrice <= 0) {
      errors.price = "Price must be greater than zero";
    }

    // Optional: Description validation (if you want to enforce a max length)
    if (newProductManagementDescription.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }

    if (!newProductManagementDescription) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
    setFormErrors({}); // Clear previous errors
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setNewProductManagementName('');
    setNewProductManagementImage('');
    setNewProductManagementPrice(0);
    setNewProductManagementDescription('');
    setNewProductManagementCategory('');
    setFormErrors({});
    setNewProductManagementImageFile(null);
  };


  const openEditMenuModal = (menu: MenuItem) => {
    setCurrentEditMenu(menu)
    setNewProductManagementName(menu.name);
    setNewProductManagementImage(`${menu.image_url}`);
    setNewProductManagementCategory(menu.category);
    setNewProductManagementDescription(menu.description);
    setNewProductManagementPrice(menu.price);
    setFormErrors({}); // Clear previous errors
    setIsEditMenuModalOpen(true);
  };

  const closeEditMenuModal = () => {
    setIsEditMenuModalOpen(false);
    setCurrentEditMenu(null);
    setNewProductManagementName('');
    setNewProductManagementImage('');
    setNewProductManagementPrice(0);
    setNewProductManagementDescription('');
    setNewProductManagementCategory('');
    setFormErrors({});
    setNewProductManagementImageFile(null);
  };

  const handleAddProduct = async () => {
    // Validate form before proceeding
    if (!validateProductForm()) {
      return; // Stop if validation fails
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const newMenu: MenuItem = {
      id: Date.now(),
      name: newProductManagementName,
      category: newProductManagementCategory,
      image: newProductManagementImage, // Use placeholder if no image provided
      image_url: newProductManagementImage, // Use placeholder if no image provided
      price: Number(newProductManagementPrice), // Default quantity for Product Management
      created_at: currentDate,
      archived: false,
      description: newProductManagementDescription,
      updated_at: currentDate,
    };

    await sendData(newMenu);
    getMenu();
    closeAddProductModal();
  };

  const sendData = async (newMenu: MenuItem) => {

    const formData = new FormData();
    formData.append('name', newProductManagementName);
    // formData.append('image', newProductManagementImage);
    formData.append('category', newProductManagementCategory);
    formData.append('description', newProductManagementDescription);
    formData.append('price', `${newProductManagementPrice}`);
    formData.append('archived', '0');

    if (newProductManagementImageFile) {
      formData.append('image', newProductManagementImageFile); // The key 'image' must match the backend's request->file('image')
    }
    console.log('newProductManagementImageFile: ' + newProductManagementImageFile);

    try {

      const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
      if (!rawXsrfToken) {
        console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
        throw new Error('CSRF Token not found in cookies.');
      }
      const xsrfToken = decodeURIComponent(rawXsrfToken);

      const response = await fetch('//localhost:8000/menu', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-XSRF-TOKEN': xsrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Success:', data);
    } catch (err) {
      console.error('Upload failed:', err);
    }

  }


  function formatdate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A'; // Or return '', or some other placeholder
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.error("Invalid date string received:", dateString);
        return 'Invalid Date';
      }

      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1);
      const day = date.getUTCDate();

      const monthString = String(month).padStart(2, '0');
      const dayString = String(day).padStart(2, '0');

      return `${year}-${monthString}-${dayString}`;

    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return 'Error'; // Indicate that an error occurred during formatting
    }
  }

  const handleUpdateMenu = async () => {
    if (!currentEditMenu) return;

    // Validate form before proceeding
    if (!validateProductForm()) {
      return; // Stop if validation fails
    }

    const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
    if (!rawXsrfToken) {
      console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
      throw new Error('CSRF Token not found in cookies.');
    }
    const xsrfToken = decodeURIComponent(rawXsrfToken);

    const formData = new FormData();
    formData.append('name', newProductManagementName);
    formData.append('category', newProductManagementCategory);
    formData.append('description', newProductManagementDescription);
    formData.append('price', `${newProductManagementPrice}`);
    formData.append('archived', '0');

    if (newProductManagementImageFile) {
      formData.append('image', newProductManagementImageFile);
    }

    formData.append('_method', 'PUT');

    const response = await fetch(`http://localhost:8000/menu/${currentEditMenu.id}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorData.message}`);
    }

    const updatedItem = await response.json();
    console.log('Menu item updated:', updatedItem);

    getMenu();

    closeEditMenuModal();
  };

  const toggleArchiveMenu = async (menu: MenuItem) => {

    const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
    if (!rawXsrfToken) {
      console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
      throw new Error('CSRF Token not found in cookies.');
    }
    const xsrfToken = decodeURIComponent(rawXsrfToken); 

    const archive = menu.archived ? '0' : '1';

    const formData = new FormData();
    formData.append('archived', archive);
    formData.append('_method', 'PUT');

    const response = await fetch(`http://localhost:8000/menu/${menu.id}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorData.message}`);
    }

    const updatedItem = await response.json();
    console.log('Menu item updated:', updatedItem);

    getMenu();
  };

  // Handle form field changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewProductManagementName(value);

    // Clear error when user starts typing
    if (formErrors.name && value.trim()) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewProductManagementCategory(value);

    // Clear error when user selects a category
    if (formErrors.category && value) {
      setFormErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewProductManagementDescription(value);

    // Clear error if description is now valid
    if (formErrors.description && value.length <= 1000) {
      setFormErrors(prev => ({ ...prev, description: undefined }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNewProductManagementPrice(value);

    // Clear error if price is now valid
    if (formErrors.price && value > 0) {
      setFormErrors(prev => ({ ...prev, price: undefined }));
    }
  };

  return (
    <div className="app-container">
      {/* Fixed Header */}
      <Header setSidebarOpen={setIsSidebarOpen} />


      {/* Main Content Area with Sidebar */}
      <div className="main-content">

      {/* Fixed Sidebar */}
      <Nav isSidebarOpen={isSidebarOpen} />

        {/* Tab Content */}
        <div className={`tab-content-wrapper ${isSidebarOpen ? '' : 'shifted'}`}>
          {(
            <div className="stocks-content">
              {/* Search and Add Product Container */}
              <div className="top-controls-container">
                <div className="inventory-search-container">
                  <span className="inventory-label">Product Management</span>
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search products..."
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
              <h2>Product Management</h2>

              {/* Products Table */}
              {menu.length > 0 ? (
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMenu.map(product => (
                        <tr key={product.id} className={`product-row ${product.archived ? 'archived' : ''}`}>
                          <td className="product-image-cell">
                            {product.image_url ? (
                              <img
                                src={`${product.image_url}`}
                                alt={product.name}
                                className="product-table-image"
                              />
                            ) : (
                              <div className="product-image-placeholder">N/A</div>
                            )}
                          </td>
                          <td className="product-name-cell">{product.name}</td>
                          <td className="product-quantity-cell">{product.price}</td>
                          <td className="product-category-cell">{product.category}</td>
                          <td className="product-date-cell">{formatdate(product.created_at)}</td>
                          {/* <td className="product-supplier-cell">{product.supplier || 'N/A'}</td> */}
                          {/* const formattedDate = formatDateToYYYYMMDD(product.created_at); */}

                          <td className="product-actions-cell">
                            <button
                              className="edit-button"
                              onClick={() => openEditMenuModal(product)}
                            >
                              Update
                            </button>
                            {!product.archived ? (
                              <button
                                className="archive-button"
                                onClick={() => 
                                  toggleArchiveMenu(product)
                                }
                              >
                                Archive
                              </button>
                            ) : (
                              <button
                                className="unarchive-button"
                                onClick={() => 
                                  toggleArchiveMenu(product)
                                }
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
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">

            <h2 className="modal-title">Add New Product</h2>
            <div className="modal-form">

              {/* Add modal for Menu */}
              <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                  type="text"
                  id="productName"
                  value={newProductManagementName}
                  onChange={handleNameChange}
                  placeholder="Enter product name"
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Category:</label>
                <select
                  id="productCategory"
                  value={newProductManagementCategory}
                  onChange={handleCategoryChange}
                  className={formErrors.category ? "input-error" : ""}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="main">Main Dish</option>
                  <option value="side">Side Dish</option>
                  <option value="dessert">Dessert</option>
                  <option value="drinks">Drinks</option>
                </select>
                {formErrors.category && <div className="error-message">{formErrors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Description:</label>
                <textarea
                  id="productDescription"
                  rows={3}
                  value={newProductManagementDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter product description"
                  className={formErrors.description ? "input-error" : ""}
                />
                {formErrors.description && <div className="error-message">{formErrors.description}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productPrice">Price:</label>
                <input
                  type="number"
                  id="productPrice"
                  min="0"
                  step="1"
                  value={newProductManagementPrice}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
                  className={formErrors.price ? "input-error" : ""}
                />
                {formErrors.price && <div className="error-message">{formErrors.price}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productImage">Product Image:</label>
                <div className="image-upload-container">
                  {(newProductManagementImage) ? (
                    <img
                      src={newProductManagementImage}
                      alt="Product preview"
                      className="image-preview"
                    />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setNewProductManagementImage(imageUrl);
                        setNewProductManagementImageFile(file);
                        // Clear image error if it exists
                        if (formErrors.image) {
                          setFormErrors(prev => ({ ...prev, image: undefined }));
                        }
                      }
                    }}
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

      {/* Edit menu modal */}
      {isEditMenuModalOpen && currentEditMenu && (
        <div className="modal-overlay">
          <div className="modal-content">

            <h2 className="modal-title">Update New Product</h2>
            <div className="modal-form">

              <div className="form-group">
                <label htmlFor="editProductName">Product Name:</label>
                <input
                  type="text"
                  id="editProductName"
                  value={newProductManagementName}
                  onChange={handleNameChange}
                  placeholder="Enter product name"
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productCategory">Category:</label>
                <select
                  id="productCategory"
                  value={newProductManagementCategory}
                  onChange={handleCategoryChange}
                  className={formErrors.category ? "input-error" : ""}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="main">Main Dish</option>
                  <option value="side">Side Dish</option>
                  <option value="dessert">Dessert</option>
                  <option value="drinks">Drinks</option>
                </select>
                {formErrors.category && <div className="error-message">{formErrors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">Description:</label>
                <textarea
                  id="productDescription"
                  rows={3}
                  value={newProductManagementDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter product description"
                  className={formErrors.description ? "input-error" : ""}
                />
                {formErrors.description && <div className="error-message">{formErrors.description}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productPrice">Price:</label>
                <input
                  type="number"
                  id="productPrice"
                  min="0"
                  step="1"
                  value={newProductManagementPrice}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
                  className={formErrors.price ? "input-error" : ""}
                />
                {formErrors.price && <div className="error-message">{formErrors.price}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="productImage">Product Image:</label>
                <div className="image-upload-container">
                  {(newProductManagementImage) ? (
                    <img
                      src={newProductManagementImage}
                      alt="Product preview"
                      className="image-preview"
                    />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setNewProductManagementImage(imageUrl);
                        setNewProductManagementImageFile(file);
                        // Clear image error if it exists
                        if (formErrors.image) {
                          setFormErrors(prev => ({ ...prev, image: undefined }));
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeEditMenuModal}>
                  Cancel
                </button>
                <button className="modal-button submit" onClick={handleUpdateMenu}>
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

export default Product;