document.addEventListener('DOMContentLoaded', () => {
    const API_URL = "http://54.84.82.77:3001/api";
    
    const productForm = document.getElementById('productForm');
    const productsList = document.getElementById('productsList');
    const formTitle = document.getElementById('formTitle');
    const cancelBtn = document.getElementById('cancelBtn');
    const showAllBtn = document.getElementById('showAllBtn');
    const showAvailableBtn = document.getElementById('showAvailableBtn');
    const showUnavailableBtn = document.getElementById('showUnavailableBtn');
    
    let editMode = false;
    let currentFilter = null;

    function resetForm() {
        productForm.reset();
        document.getElementById('productId').value = '';
        formTitle.textContent = 'Add New Product';
        cancelBtn.style.display = 'none';
        editMode = false;
    }

    async function fetchProducts(filterAvailable = null) {
        try {
            let url = `${API_URL}/products`;
            if (filterAvailable !== null) {
                url += `?available=${filterAvailable}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to load products. Please try again later.');
        }
    }

    function displayProducts(products) {
        productsList.innerHTML = '';
        
        if (products.length === 0) {
            productsList.innerHTML = '<p class="text-center">No products found.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'card mb-3';
            
            const statusClass = product.available ? 'text-success' : 'text-danger';
            const statusText = product.available ? 'Available' : 'Not Available';
            
            productCard.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${product.name}</h5>
                        <span class="fw-bold">$${product.price}</span>
                    </div>
                    <p class="card-text">${product.description || 'No description'}</p>
                    <p class="card-text ${statusClass} fst-italic">${statusText}</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-primary edit-btn me-2" data-id="${product.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">Delete</button>
                    </div>
                </div>
            `;
            
            productsList.appendChild(productCard);
            
            const editBtn = productCard.querySelector('.edit-btn');
            const deleteBtn = productCard.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => editProduct(product));
            deleteBtn.addEventListener('click', () => deleteProduct(product.id));
        });
    }

    async function createProduct(productData) {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product: productData })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            fetchProducts(currentFilter);
            resetForm();
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product. Please try again.');
        }
    }

    async function updateProduct(id, productData) {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product: productData })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            fetchProducts(currentFilter);
            resetForm();
        } catch (error) {
            console.error(`Error updating product with id ${id}:`, error);
            alert('Failed to update product. Please try again.');
        }
    }

    async function deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            fetchProducts(currentFilter);
        } catch (error) {
            console.error(`Error deleting product with id ${id}:`, error);
            alert('Failed to delete product. Please try again.');
        }
    }

    function editProduct(product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description || '';
        document.getElementById('price').value = product.price;
        document.getElementById('available').checked = product.available;
        
        formTitle.textContent = 'Edit Product';
        cancelBtn.style.display = 'inline-block';
        editMode = true;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            available: document.getElementById('available').checked
        };
        
        if (editMode) {
            const id = document.getElementById('productId').value;
            updateProduct(id, productData);
        } else {
            createProduct(productData);
        }
    });

    cancelBtn.addEventListener('click', resetForm);
    
    showAllBtn.addEventListener('click', () => {
        currentFilter = null;
        fetchProducts();
    });
    
    showAvailableBtn.addEventListener('click', () => {
        currentFilter = true;
        fetchProducts(true);
    });
    
    showUnavailableBtn.addEventListener('click', () => {
        currentFilter = false;
        fetchProducts(false);
    });

    fetchProducts();
}); 