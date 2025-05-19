import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import Nav from './components/nav';
import Header from './components/header';


// Define product typeHeader
interface Stock {
  id: number;
  name: string;
  image: string;
  image_url: string;
  quantity: number;
  date_received: string;
  date_expiration: string;
  supplier: string;
  archived: boolean;
}

interface StockFormErrors {
  name?: string;
  supplier?: string;
  quantity?: string;
  image?: string;
  dateReceived?: string;
  dateExpiration?: string;
}



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState<boolean>(false);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState<boolean>(false);


  // Separate states for Inventory and Product Management
  const [Stocks, setStocks] = useState<Stock[]>([]);
  const [currentStock, setcurrentStock] = useState<Stock | null>(null);
  const [stockName, setStockName] = useState<string>('');
  const [stockImage, setStockImage] = useState<string>('');
  const [stockImageFile, setStockImageFile] = useState<File | null>();
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockReceived, setStockReceived] = useState<string>('');
  const [stockExpiryDate, setStockExpiryDate] = useState<string>('');
  const [stockSupplier, setStockSupplier] = useState<string>('');
  // const [stockArchived, setStockArchived] = useState<boolean>(false);
 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const abortController = new AbortController();

    getStocks();
    getCRSF();

    return () => {
      abortController.abort();
    }; 
    
  }, []);


  const [StockFormErrors, setStockFormErrors] = useState<StockFormErrors>({});
  const [addStockErrors, setAddStockErrors] = useState<StockFormErrors>({});
  const [editStockErrors, setEditStockErrors] = useState<StockFormErrors>({});

  const validateAddStockForm = (): boolean => {
    const errors: StockFormErrors = {};

    if (!stockName.trim()) errors.name = "Stock name is required";
    if (!stockSupplier.trim()) errors.supplier = "Supplier is required";
    if (stockQuantity <= 0 || stockQuantity === undefined || stockQuantity === null || typeof stockQuantity !== 'number' || isNaN(stockQuantity)) errors.quantity = "Quantity must be greater than 0";
    if (!stockExpiryDate) errors.dateExpiration = "Date expiration is required";

    setAddStockErrors(errors);
    return Object.keys(errors).length === 0;
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

  const getStocks = async () => {
    try {
      const response = await fetch('http://localhost:8000/stocks');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  if (Stocks.length > 0) {
    console.log(Stocks);
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

  const openAddProductModal = () => {
    setIsAddStockModalOpen(true);
  };

const clearError = () => {

  const errors: StockFormErrors = {};
  errors.name = "";
  errors.supplier = "";
  errors.quantity = "";
  errors.dateReceived = "";
  errors.dateExpiration = "";

  setAddStockErrors(errors);
}

  const closeAddStockModal = () => {
    setIsAddStockModalOpen(false);
    setStockName('');
    setStockImage('');
    setStockImageFile(null);
    setStockQuantity(0);
    setStockReceived('');
    setStockExpiryDate('');
    setStockSupplier('');
    clearError();
  };

  const openEditStockModal = (Stock: Stock) => {
    setcurrentStock(Stock);
    setStockName(Stock.name);
    setStockImage(Stock.image_url);
    setStockQuantity(Stock.quantity);
    setStockExpiryDate(Stock.date_expiration);
    setStockSupplier(Stock.supplier);
    setIsEditStockModalOpen(true);
  };

  const closeEditStockModal = () => {
    setIsEditStockModalOpen(false);
    setcurrentStock(null);
    setStockName('');
    setStockImage('');
    setStockImageFile(null);
    setStockQuantity(0);
    setStockExpiryDate('');
    setStockSupplier('');
    clearError();
  };
  
  const handleAddProduct = async () => {
    if (!validateAddStockForm()) {
      return;
    }
    
    const quantity = stockQuantity;
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const newStock: Stock = {
      id: Date.now(),
      name: stockName,
      image: stockImage,
      image_url: stockImage,
      quantity: quantity,
      date_received: currentDate,
      date_expiration: stockExpiryDate,
      supplier: stockSupplier,
      archived: false
    };

    setStocks([...Stocks, newStock]);

      // setProductManagementProducts([...productManagementProducts, newProduct]);
      // setMenu([...menu, newMenu])
      await sendData(newStock);
      getStocks();

      closeAddStockModal();
  };

  const sendData = async (newMenu: Stock) => {
    const formData = new FormData();
    formData.append('name', stockName);
    // formData.append('image', stockImage);
    formData.append('quantity', stockQuantity.toString());
    formData.append('date_received', stockReceived);
    formData.append('date_expiration', stockExpiryDate);
    formData.append('supplier', stockSupplier);
    formData.append('archived', '0');
    if (stockImageFile) {
      formData.append('image', stockImageFile); // The key 'image' must match the backend's request->file('image')
    }
    console.log('stockImageFile: ' + stockImageFile);
    
    try {

      const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
      if (!rawXsrfToken) {
         console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
         throw new Error('CSRF Token not found in cookies.');
      }
      const xsrfToken = decodeURIComponent(rawXsrfToken); 

      const response = await fetch('//localhost:8000/stocks', {
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

  const handleUpdateStock = async () => {
    if (!validateAddStockForm()) {
      return;
    }

    if (!currentStock) return;

    if (stockName.trim() === '' || stockSupplier.trim() === '' || stockQuantity <= 0 || stockExpiryDate === '') {
      alert('Fill all the fields');
      return;
    }

    const rawXsrfToken = Cookies.get('XSRF-TOKEN'); 
    if (!rawXsrfToken) {
        console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
        throw new Error('CSRF Token not found in cookies.');
    }
    const xsrfToken = decodeURIComponent(rawXsrfToken); 

    const formData = new FormData();
    formData.append('name', stockName);
    // formData.append('image', stockImage);
    formData.append('quantity', stockQuantity.toString());
    // formData.append('date_received', currentStock.date_received);
    formData.append('date_expiration', stockExpiryDate);
    formData.append('supplier', stockSupplier);
    formData.append('archived', '0');

    if (stockImageFile) {
      formData.append('image', stockImageFile); 
    }

    formData.append('_method', 'PUT');

    const response = await fetch(`http://localhost:8000/stock/${currentStock.id}`, {
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

    getStocks();
    closeEditStockModal();
  };

  const handleDeleteStock = async (stock: Stock) => {
    // if (!currentStock) return;
    const rawXsrfToken = Cookies.get('XSRF-TOKEN'); 
    if (!rawXsrfToken) {
        console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
        throw new Error('CSRF Token not found in cookies.');
    }
    const xsrfToken = decodeURIComponent(rawXsrfToken); 

    const response = await fetch(`http://localhost:8000/stock/${stock.id}`, {
      method: 'DELETE',
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

    const deletedItem = await response.json();
    console.log(deletedItem);

    getStocks();
  }

  const toggleArchiveStock = async (stock: Stock) => {

    const rawXsrfToken = Cookies.get('XSRF-TOKEN'); // Read from cookie jar
    if (!rawXsrfToken) {
        console.error('XSRF Token cookie not found. Ensure it is being set correctly by the backend and is not HttpOnly if you need to read it.');
        throw new Error('CSRF Token not found in cookies.');
    }
    const xsrfToken = decodeURIComponent(rawXsrfToken); 

    const archive = stock.archived ? '0' : '1';

    const formData = new FormData();
    formData.append('archived', archive);
    formData.append('_method', 'PUT');

    const response = await fetch(`http://localhost:8000/stock/${stock.id}`, {
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

    getStocks();
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
  

  const filteredStock = Stocks.filter(stock =>
    showArchived ? (stock.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    :  (stock.name.toLowerCase().includes(searchTerm.toLowerCase()) && !stock.archived)
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
                  <span className="inventory-label">Inventory Management</span>
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search stocks..."
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
                  Add Stock
                </button>
              </div>
              <h2>Inventory Management</h2>

              {/* Products Table */}
              {Stocks.length > 0 ? (
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Date Received</th>
                        <th>Date Expiration</th>
                        <th>Supplier</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStock.map(stock => (
                        <tr key={stock.id} className={`product-row ${stock.archived ? 'archived' : ''}`}>
                          <td className="product-image-cell">
                            <img
                                src={`${stock.image_url}`}
                                alt={stock.name}
                                className="product-table-image"
                              />
                          </td>
                          <td className="product-name-cell">{stock.name}</td>
                          <td className="product-quantity-cell">{stock.quantity}</td>
                          <td className="product-date-cell">{formatdate(stock.date_received)}</td>
                          <td className="product-date-cell">{formatdate(stock.date_expiration)}</td>
                          <td className="product-supplier-cell">{stock.supplier}</td>
                          <td className="product-actions-cell">
                            <button
                              className="edit-button"
                              onClick={() => openEditStockModal(stock)}
                            >
                              Update
                            </button>
                            {/* {!stock.archived ? (
                              <button
                                className="archive-button"
                                onClick={() => 
                                  toggleArchiveStock(stock)
                                }
                              >
                                Archive
                              </button>
                            ) : (
                              <button
                                className="unarchive-button"
                                onClick={() => 
                                  toggleArchiveStock(stock)
                                }
                              >
                                Unarchive
                              </button>
                            )} */}
                            <button
                              className="archive-button"
                              onClick={() => handleDeleteStock(stock)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-products-message">No products available. Add stock using the "Add Stock" button.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddStockModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Stock</h2>
            <div className="modal-form">

              {/* Stock Name */}
              <div className="form-group">
                <label htmlFor="productName">Name:</label>
                <input
                  type="text"
                  id="productName"
                  value={stockName}
                  onChange={(e) => {
                    setStockName(e.target.value);
                    if (addStockErrors.name) setAddStockErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter stock name"
                  className={addStockErrors.name ? 'input-error' : ''}
                />
                {addStockErrors.name && <div className="error-message">{addStockErrors.name}</div>}
              </div>

              {/* Supplier */}
              <div className="form-group">
                <label htmlFor="productSupplier">Supplier:</label>
                <input
                  type="text"
                  id="productSupplier"
                  value={stockSupplier}
                  onChange={(e) => {
                    setStockSupplier(e.target.value);
                    if (addStockErrors.supplier) setAddStockErrors(prev => ({ ...prev, supplier: undefined }));
                  }}
                  placeholder="Enter stock supplier"
                  className={addStockErrors.supplier ? 'input-error' : ''}
                />
                {addStockErrors.supplier && <div className="error-message">{addStockErrors.supplier}</div>}
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label htmlFor="productQuantity">Quantity:</label>
                <input
                  type="number"
                  id="productQuantity"
                  min="0"
                  step="1"
                  value={stockQuantity}
                  onChange={(e) => {
                    setStockQuantity(parseInt(e.target.value));
                    if (addStockErrors.quantity) setAddStockErrors(prev => ({ ...prev, quantity: undefined }));
                  }}
                  placeholder="Enter quantity"
                  className={addStockErrors.quantity ? 'input-error' : ''}
                />
                {addStockErrors.quantity && <div className="error-message">{addStockErrors.quantity}</div>}
              </div>

              {/* Image */}
              <div className="form-group">
                <label htmlFor="productImage">Image:</label>
                <div className="image-upload-container">
                  {stockImage ? (
                    <img src={stockImage} alt="Product preview" className="image-preview" />
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
                        setStockImage(imageUrl);
                        setStockImageFile(file);
                        if (addStockErrors.image) setAddStockErrors(prev => ({ ...prev, image: undefined }));
                      }
                    }}
                  />
                </div>
                {addStockErrors.image && <div className="error-message">{addStockErrors.image}</div>}
              </div>

              {/* Date Received */}
              <div className="form-group">
                <label htmlFor="dateReceived">Date Received:</label>
                <input
                  type="date"
                  id="dateReceived"
                  value={stockReceived}
                  onChange={(e) => {
                    setStockReceived(e.target.value);
                    if (addStockErrors.dateReceived) setAddStockErrors(prev => ({ ...prev, dateReceived: undefined }));
                  }}
                  className={addStockErrors.dateReceived ? 'input-error' : ''}
                />
                {addStockErrors.dateReceived && <div className="error-message">{addStockErrors.dateReceived}</div>}
              </div>

              {/* Date Expiration */}
              <div className="form-group">
                <label htmlFor="dateExpiration">Date Expiration:</label>
                <input
                  type="date"
                  id="dateExpiration"
                  value={stockExpiryDate}
                  onChange={(e) => {
                    setStockExpiryDate(e.target.value);
                    if (addStockErrors.dateExpiration) setAddStockErrors(prev => ({ ...prev, dateExpiration: undefined }));
                  }}
                  className={addStockErrors.dateExpiration ? 'input-error' : ''}
                />
                {addStockErrors.dateExpiration && <div className="error-message">{addStockErrors.dateExpiration}</div>}
              </div>

              <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeAddStockModal}>
                  Cancel
                </button>
                <button className="modal-button submit" onClick={handleAddProduct}>
                  Add Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Edit menu modal */}
      {isEditStockModalOpen && currentStock && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <h2 className="modal-title">Update Stock</h2>
            <div className="modal-form">
              
              <div className="form-group">
                <label htmlFor="editProductName">Name:</label>
                <input
                  type="text"
                  id="editProductName"
                  value={stockName}
                  onChange={(e) => {
                      setStockName(e.target.value)
                    if (addStockErrors.name) setAddStockErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }
                  placeholder="Enter  stock name"
                  className={addStockErrors.name ? 'input-error' : ''}
                />
                {addStockErrors.name && <div className="error-message">{addStockErrors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="productName">Supplier:</label>
              <input
                type="text"
                id="productName"
                value={stockSupplier}
                onChange={(e) =>{
                  setStockSupplier(e.target.value)
                  if (addStockErrors.supplier) setAddStockErrors(prev => ({ ...prev, supplier: undefined }));
                }
                }
                placeholder="Enter stock supplier"
                className={addStockErrors.supplier ? 'input-error' : ''}
              />
                {addStockErrors.supplier && <div className="error-message">{addStockErrors.supplier}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="productQuantity">Quantity:</label>
              <input
                type="number"
                id="productQuantity"
                min="0"
                step="1"
                value={stockQuantity}
                onChange={(e) =>{
                  setStockQuantity(parseInt(e.target.value))
                  if (addStockErrors.quantity) setAddStockErrors(prev => ({ ...prev, quantity: undefined }));
                  }
                }
                placeholder="Enter quantity"
                className={addStockErrors.quantity ? 'input-error' : ''}
              />
                {addStockErrors.quantity && <div className="error-message">{addStockErrors.quantity}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="productImage">Image:</label>
              <div className="image-upload-container">
                {(stockImage) ? (
                  <img
                    src={stockImage}
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
                        setStockImage(imageUrl)
                        setStockImageFile(file)
                        ;
                    }
                  }}
                />
              </div>

            <div className="form-group">
              <label htmlFor="dateExpiration">Date Expiration:</label>
              <input
                  type="date"
                  id="dateExpiration"
                  value={stockExpiryDate}
                  onChange={(e) => {
                    setStockExpiryDate(e.target.value)
                    if (addStockErrors.dateExpiration) setAddStockErrors(prev => ({ ...prev, dateExpiration: undefined }));
                  }}
                  className={addStockErrors.dateExpiration ? 'input-error' : ''}
              />
                {addStockErrors.dateExpiration && <div className="error-message">{addStockErrors.dateExpiration}</div>}
            </div>

            </div>
              <div className="modal-buttons">
                <button className="modal-button cancel" onClick={closeEditStockModal}>
                  Cancel
                </button>
                <button className="modal-button submit" onClick={handleUpdateStock}>
                  Update Stock
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