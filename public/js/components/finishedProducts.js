// Finished Products Component
const FinishedProducts = {
    products: [],

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Finished Products</h2>
                <p>Manage completed products inventory</p>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Products Inventory</h3>
                    <button class="btn btn-primary" onclick="FinishedProducts.showAddModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Product
                    </button>
                </div>
                <div id="products-list">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        await this.loadProducts();
        this.renderList();
    },

    async loadProducts() {
        try {
            this.products = await App.fetchAPI('/finished-products');
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },

    renderList() {
        const listContainer = document.getElementById('products-list');

        if (this.products.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Finished Products</h3>
                    <p>Complete production batches to add finished products</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU / Batch</th>
                            <th>Quantity</th>
                            <th>Mfg. Date</th>
                            <th>Quality</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.products.map(product => this.renderProductRow(product)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderProductRow(product) {
        const qualityBadge = {
            'pass': '<span class="badge badge-success">Passed</span>',
            'fail': '<span class="badge badge-danger">Failed</span>',
            'pending': '<span class="badge badge-warning">Pending</span>'
        }[product.qualityStatus] || '<span class="badge badge-info">Unknown</span>';

        const mfgDate = product.manufacturingDate ? App.formatDate(product.manufacturingDate) : 'N/A';

        return `
            <tr>
                <td><strong style="color: var(--text-primary);">${product.name}</strong></td>
                <td>
                    <div style="font-size: 0.85rem;">${product.sku || '—'}</div>
                    <div style="font-size: 0.75rem; color: var(--text-tertiary);">#${product.batchNumber || '—'}</div>
                </td>
                <td>${product.quantity || 0}</td>
                <td>${mfgDate}</td>
                <td>${qualityBadge}</td>
                <td><span style="font-size: 0.85rem; opacity: 0.8;">${product.location || 'Warehouse'}</span></td>
                <td>
                    <div class="flex gap-1">
                        <button class="btn btn-secondary" style="padding: 4px 10px;" onclick="FinishedProducts.showEditModal('${product._id}')">Edit</button>
                        <button class="btn btn-danger" style="padding: 4px 10px; background: rgba(255, 59, 48, 0.1); color: var(--accent-danger);" onclick="FinishedProducts.deleteProduct('${product._id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    },

    showAddModal() {
        const content = `
            <form id="product-form">
                <div class="form-group">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-input" id="product-name" placeholder="e.g. Precision Gear" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">SKU</label>
                        <input type="text" class="form-input" id="product-sku" placeholder="PF-1234" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input" id="product-quantity" min="1" value="1" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Batch Number</label>
                        <input type="text" class="form-input" id="product-batch">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Manufacturing Date</label>
                        <input type="date" class="form-input" id="product-date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Quality Status</label>
                        <select class="form-select" id="product-quality">
                            <option value="pending">Pending</option>
                            <option value="pass">Passed</option>
                            <option value="fail">Failed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-input" id="product-location" value="Warehouse">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Specifications</label>
                    <textarea class="form-textarea" id="product-specs" style="min-height: 80px;"></textarea>
                </div>
            </form>
        `;

        App.showModal('Add Finished Product', content, () => this.saveProduct());
    },

    showEditModal(id) {
        const product = this.products.find(p => p._id === id);
        if (!product) return;

        const mfgDate = product.manufacturingDate
            ? new Date(product.manufacturingDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

        const content = `
            <form id="product-form">
                <input type="hidden" id="product-id" value="${product._id}">
                
                <div class="form-group">
                    <label class="form-label">Product Name</label>
                    <input type="text" class="form-input" id="product-name" value="${product.name}" required>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">SKU</label>
                        <input type="text" class="form-input" id="product-sku" value="${product.sku || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input" id="product-quantity" value="${product.quantity || 1}" min="1" required>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Batch Number</label>
                        <input type="text" class="form-input" id="product-batch" value="${product.batchNumber || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Manufacturing Date</label>
                        <input type="date" class="form-input" id="product-date" value="${mfgDate}">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Quality Status</label>
                        <select class="form-select" id="product-quality">
                            <option value="pending" ${product.qualityStatus === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="pass" ${product.qualityStatus === 'pass' ? 'selected' : ''}>Passed</option>
                            <option value="fail" ${product.qualityStatus === 'fail' ? 'selected' : ''}>Failed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-input" id="product-location" value="${product.location || 'Warehouse'}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Specifications</label>
                    <textarea class="form-textarea" id="product-specs" style="min-height: 80px;">${product.specifications || ''}</textarea>
                </div>
            </form>
        `;

        App.showModal('Edit Finished Product', content, () => this.saveProduct());
    },

    async saveProduct() {
        const id = document.getElementById('product-id')?.value;
        const data = {
            name: document.getElementById('product-name').value,
            sku: document.getElementById('product-sku').value,
            quantity: parseInt(document.getElementById('product-quantity').value),
            batchNumber: document.getElementById('product-batch').value,
            manufacturingDate: document.getElementById('product-date').value,
            qualityStatus: document.getElementById('product-quality').value,
            location: document.getElementById('product-location').value,
            specifications: document.getElementById('product-specs').value
        };

        try {
            if (id) {
                await App.fetchAPI(`/finished-products/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                App.showNotification('Product updated successfully', 'info');
            } else {
                await App.fetchAPI('/finished-products', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                App.showNotification('Product added successfully', 'info');
            }

            App.closeModal();
            await this.loadProducts();
            this.renderList();
        } catch (error) {
            App.showNotification('Error saving product', 'danger');
        }
    },

    async deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await App.fetchAPI(`/finished-products/${id}`, { method: 'DELETE' });
            App.showNotification('Product deleted successfully', 'info');
            await this.loadProducts();
            this.renderList();
        } catch (error) {
            App.showNotification('Error deleting product', 'danger');
        }
    }
};
