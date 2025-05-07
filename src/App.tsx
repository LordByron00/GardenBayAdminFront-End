import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './App.css';
import SalesTab from './components/SalesTab';
import Cookies from 'js-cookie';
import Nav from './components/nav';
import Header from './components/header';


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


function App() {
  const [selectedButton, setSelectedButton] = useState<string>('checkStocks');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);


  // Separate states for Inventory and Product Management
  const [inventoryProducts, setInventoryProducts] = useState<Product[]>([]);
  const [productManagementProducts, setProductManagementProducts] = useState<Product[]>([]);

  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductImage, setNewProductImage] = useState<string>('');
  const [newProductQuantity, setNewProductQuantity] = useState<string>('0');
  const [newProductExpiryDate, setNewProductExpiryDate] = useState<string>('');
  const [newProductSupplier, setNewProductSupplier] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');

 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentEditProduct, setCurrentEditProduct] = useState<Product | null>(null);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const navigate = useNavigate(); // React Router hook for navigation


  // for Products/menu
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [currentEditMenu, setCurrentEditMenu] = useState<MenuItem | null>(null);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState<boolean>(false);

  const [newProductManagementCategory, setNewProductManagementCategory] = useState('');
  const [newProductManagementDescription, setNewProductManagementDescription] = useState('');
  const [newProductManagementPrice, setNewProductManagementPrice] = useState(0);
  const [newProductManagementName, setNewProductManagementName] = useState<string>('');
  const [newProductManagementImage, setNewProductManagementImage] = useState<string>('');
  const [newProductManagementImageFile, setNewProductManagementImageFile] = useState<File>();

  useEffect(() => {
    const abortController = new AbortController();

    getMenu();
    getCRSF();

    return () => {
      abortController.abort();
    }; 
    
  }, []);

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

  if (menu.length > 0) {
    console.log(menu);
  } else {
    console.log('nothing');
  }

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

  // const toggleSidebar = () => {
  //   setIsSidebarOpen((prev) => !prev);
  // };

  const handleLogout = () => {
    // Perform any cleanup actions if needed (e.g., clearing user state)
    navigate('/'); // Redirect to the login page
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
    setNewProductManagementName('');
    setNewProductManagementImage('');
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
  
  const openEditMenuModal = (menu: MenuItem) => {
    setCurrentEditMenu(menu)
    setNewProductManagementName(menu.name);
    setNewProductManagementImage(`//${menu.image_url}`);
    setNewProductManagementCategory(menu.category);
    setNewProductManagementDescription(menu.description);
    setNewProductManagementPrice(menu.price);
    setIsEditMenuModalOpen(true);
  };

  const closeEditMenuModal = () => {
    setIsEditMenuModalOpen(false);
    setCurrentEditProduct(null);
    setNewProductName('');
    setNewProductImage('');
    setNewProductQuantity('0');
    setNewProductExpiryDate('');
    setNewProductSupplier('');
  };

  const handleAddProduct = async () => {
    if (selectedButton === 'checkStocks') {
      // Inventory Tab Logic
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

      setInventoryProducts([...inventoryProducts, newProduct]);
    } else if (selectedButton === 'productmanage') {
      // Product Management Tab Logic
      if (newProductManagementName.trim() === '') {
        alert('Please enter a product name');
        return;
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

      // setProductManagementProducts([...productManagementProducts, newProduct]);
      // setMenu([...menu, newMenu])
      await sendData(newMenu);
      getMenu();
    }

    closeAddProductModal();
  };

  const sendData = async (newMenu: MenuItem) => {
    const formData = new FormData();
    formData.append('name', newProductManagementName);
    formData.append('image', newProductManagementImage);
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
        // Log more details on failure
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

  const handleUpdateProduct = () => {
    if (!currentEditProduct) return;

    if (newProductName.trim() === '') {
      alert('Please enter a product name');
      return;
    }

    const quantity = parseInt(newProductQuantity) || 0;

    const updatedProducts = (selectedButton === 'checkStocks' ? inventoryProducts : productManagementProducts).map(product => {
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

    if (selectedButton === 'checkStocks') {
      setInventoryProducts(updatedProducts);
    } else if (selectedButton === 'productmanage') {
      setProductManagementProducts(updatedProducts);
    }

    closeEditProductModal();
  };


  const handleUpdateMenu = async () => {
    if (!currentEditMenu) return;

    if (newProductManagementName.trim() === '') {
      alert('Please enter a product name');
      return;
    }


    // const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

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

    console.log('newProductManagementImageFile: ' + newProductManagementImageFile);


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

    // setMenu(updatedItem);
    getMenu();
    
    closeEditMenuModal();
  };


  const handleArchiveProduct = (productId: number) => {
    const updatedProducts = (selectedButton === 'checkStocks' ? inventoryProducts : productManagementProducts).map(product => {
      if (product.id === productId) {
        return { ...product, archived: true };
      }
      return product;
    });

    if (selectedButton === 'checkStocks') {
      setInventoryProducts(updatedProducts);
    } else if (selectedButton === 'productmanage') {
      setProductManagementProducts(updatedProducts);
    }
  };

  const handleArchiveMenu = (productId: number) => {
    const updatedProducts = (selectedButton === 'checkStocks' ? inventoryProducts : productManagementProducts).map(product => {
      if (product.id === productId) {
        return { ...product, archived: true };
      }
      return product;
    });

    if (selectedButton === 'checkStocks') {
      setInventoryProducts(updatedProducts);
    } else if (selectedButton === 'productmanage') {
      setProductManagementProducts(updatedProducts);
    }
  };

  const handleUnarchiveProduct = (productId: number) => {
    const updatedProducts = (selectedButton === 'checkStocks' ? inventoryProducts : productManagementProducts).map(product => {
      if (product.id === productId) {
        return { ...product, archived: false };
      }
      return product;
    });

    if (selectedButton === 'checkStocks') {
      setInventoryProducts(updatedProducts);
    } else if (selectedButton === 'productmanage') {
      setProductManagementProducts(updatedProducts);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected image file
      const imageUrl = URL.createObjectURL(file);
      setNewProductImage(imageUrl);
    }
  };

  const filteredInventoryProducts = inventoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (showArchived ? true : !product.archived)
  );

  // const filteredProductManagementProducts = productManagementProducts.filter(product =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //   (showArchived ? true : !product.archived)
  // );

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
      <Header setSidebarOpen={setIsSidebarOpen} />


      {/* Main Content Area with Sidebar */}
      <div className="main-content">
        {/* Fixed Sidebar */}
        <Nav isSidebarOpen={isSidebarOpen} />
        {/* <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
          <button
            className={`menu-action-button ${selectedButton === 'checkStocks' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('checkStocks')}
          >
            Inventory
          </button>
          <button
            className={`menu-action-button ${selectedButton === 'productmanage' ? 'selected' : ''}`}
            onClick={() => handleButtonClick('productmanage')}
          >
            Product Management
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
          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div> */}


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
                  Add Item
                </button>
              </div>
              <h2>Check Stocks</h2>

              {/* Products Table */}
              {filteredInventoryProducts.length > 0 ? (
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
                      {filteredInventoryProducts.map(product => (
                        <tr key={product.id} className={`product-row ${product.archived ? 'archived' : ''}`}>
                          <td className="product-image-cell">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-table-image"
                                onError={(e) => {
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
          {selectedButton === 'productmanage' && (
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
                        <th>Date Added</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.map(product => (
                        <tr key={product.id} className={`product-row ${product.archived ? 'archived' : ''}`}>
                          <td className="product-image-cell">
                            {product.image_url ? (
                              <img
                                src={`//${product.image_url}`}
                                alt={product.name}
                                className="product-table-image"
                              />
                            ) : (
                              <div className="product-image-placeholder">N/A</div>
                            )}
                          </td>
                          <td className="product-name-cell">{product.name}</td>
                          <td className="product-quantity-cell">{product.price}</td>
                          <td className="product-date-cell">{product.created_at}</td>
                          {/* <td className="product-supplier-cell">{product.supplier || 'N/A'}</td> */}
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
                                onClick={() => handleArchiveProduct(product.id)}
                              >
                                Archive
                              </button>
                            ) : (
                              <button
                                className="unarchive-button"
                                onClick={() => handleArchiveMenu(product.id)}
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
              
              {/* Add modal for Menu */}
              <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                  type="text"
                  id="productName"
                  value={selectedButton === 'checkStocks' ? newProductName : newProductManagementName}
                  onChange={(e) =>
                    selectedButton === 'checkStocks'
                      ? setNewProductName(e.target.value)
                      : setNewProductManagementName(e.target.value)
                  }
                  placeholder="Enter product name"
                />
            </div>

            <div className="form-group">
              <label htmlFor="productCategory">Category:</label>
              <select
                id="productCategory"
                value={selectedButton === 'checkStocks' ? newProductCategory : newProductManagementCategory}
                onChange={(e) =>
                  selectedButton === 'checkStocks'
                    ? setNewProductCategory(e.target.value)
                    : setNewProductManagementCategory(e.target.value)
                }
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="main">Main Dish</option>
                <option value="side">Side Dish</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="productDescription">Description:</label>
              <textarea
                id="productDescription"
                rows={3}
                value={selectedButton === 'checkStocks' ? newProductDescription : newProductManagementDescription}
                onChange={(e) =>
                  selectedButton === 'checkStocks'
                    ? setNewProductDescription(e.target.value)
                    : setNewProductManagementDescription(e.target.value)
                }
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productPrice">Price:</label>
              <input
                type="number"
                id="productPrice"
                min="0"
                step="1"
                value={selectedButton === 'checkStocks' ? newProductPrice : newProductManagementPrice}
                onChange={(e) =>
                  selectedButton === 'checkStocks'
                    ? setNewProductPrice(e.target.value)
                    : setNewProductManagementPrice(parseInt(e.target.value))
                }
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productImage">Product Image:</label>
              <div className="image-upload-container">
                {(selectedButton === 'checkStocks' ? newProductImage : newProductManagementImage) ? (
                  <img
                    src={selectedButton === 'checkStocks' ? newProductImage : newProductManagementImage}
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
                      selectedButton === 'checkStocks'
                        ? setNewProductImage(imageUrl)
                        : setNewProductManagementImage(imageUrl)
                          setNewProductManagementImageFile(file)
                        ;
                    }
                  }}
                />
              </div>
            </div>


              {/* Add modal for Inventory */}
              {selectedButton === 'checkStocks' && (
                <>
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
                    <label htmlFor="productExpiryDate">Expiring Date:</label>
                    <input
                      type="date"
                      id="productExpiryDate"
                      value={newProductExpiryDate}
                      onChange={(e) => setNewProductExpiryDate(e.target.value)}
                    />
                  </div>
                </>
              )}
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
              <div className="form-group">
                <label htmlFor="editProductDate">Date Added:</label>
                <input
                  type="date"
                  id="editProductDate"
                  value={currentEditMenu?.created_at}
                  readOnly
                />
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

      {/* Edit menu modal */}
      {isEditMenuModalOpen && selectedButton === 'productmanage' && currentEditMenu && (
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
                  onChange={(e) =>
                    setNewProductManagementName(e.target.value)
                  }
                  placeholder="Enter product name"
                />
            </div>

            <div className="form-group">
              <label htmlFor="productCategory">Category:</label>
              <select
                id="productCategory"
                value={newProductManagementCategory}
                onChange={(e) =>
                  setNewProductManagementCategory(e.target.value)
                }
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="main">Main Dish</option>
                <option value="side">Side Dish</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="productDescription">Description:</label>
              <textarea
                id="productDescription"
                rows={3}
                value={newProductManagementDescription}
                onChange={(e) =>
                  setNewProductManagementDescription(e.target.value)
                }
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="productPrice">Price:</label>
              <input
                type="number"
                id="productPrice"
                min="0"
                step="1"
                value={newProductManagementPrice}
                onChange={(e) =>
                  setNewProductManagementPrice(parseInt(e.target.value))
                }
                placeholder="Enter price"
              />
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
                        setNewProductManagementImage(imageUrl)
                        setNewProductManagementImageFile(file)
                        ;
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

export default App;