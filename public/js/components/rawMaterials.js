// Raw Materials Component
const RawMaterials = {
    materials: [],

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Raw Materials Inventory</h2>
                <p>Manage raw materials and track stock levels</p>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Materials List</h3>
                    <button class="btn btn-primary" onclick="RawMaterials.showAddModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Material
                    </button>
                </div>
                <div id="materials-list">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        await this.loadMaterials();
        this.renderList();
    },

    async loadMaterials() {
        try {
            this.materials = await App.fetchAPI('/raw-materials');
        } catch (error) {
            console.error('Error loading materials:', error);
        }
    },

    renderList() {
        const listContainer = document.getElementById('materials-list');

        if (this.materials.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Materials Found</h3>
                    <p>Add your first raw material to get started</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Supplier</th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.materials.map(material => this.renderMaterialRow(material)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderMaterialRow(material) {
        const isLowStock = material.quantity <= (material.minimumStockLevel || 0);
        const statusBadge = isLowStock
            ? '<span class="badge badge-warning">Low Stock</span>'
            : '<span class="badge badge-success">In Stock</span>';

        return `
            <tr>
                <td><strong style="color: var(--text-primary);">${material.name}</strong></td>
                <td><span style="font-size: 0.8rem; opacity: 0.8;">${material.type || 'N/A'}</span></td>
                <td>${material.quantity} <span style="font-size: 0.8rem; color: var(--text-tertiary);">${material.unit}</span></td>
                <td>${material.supplier || '—'}</td>
                <td>$${material.costPerUnit ? material.costPerUnit.toFixed(2) : '0.00'}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="flex gap-1">
                        <button class="btn btn-secondary" style="padding: 4px 10px;" onclick="RawMaterials.showEditModal('${material._id}')">
                            Edit
                        </button>
                        <button class="btn btn-danger" style="padding: 4px 10px; background: rgba(255, 59, 48, 0.1); color: var(--accent-danger);" onclick="RawMaterials.deleteMaterial('${material._id}')">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    showAddModal() {
        const content = `
            <form id="material-form">
                <div class="form-group">
                    <label class="form-label">Material Name</label>
                    <input type="text" class="form-input" id="material-name" placeholder="e.g. Aluminum 6061" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Material Type</label>
                    <select class="form-select" id="material-type">
                        <option value="Metal">Metal</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Rubber">Rubber</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input" id="material-quantity" required min="0" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Unit</label>
                        <select class="form-select" id="material-unit">
                            <option value="kg">Kilograms (kg)</option>
                            <option value="lbs">Pounds (lbs)</option>
                            <option value="pcs">Pieces (pcs)</option>
                            <option value="m">Meters (m)</option>
                            <option value="L">Liters (L)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <input type="text" class="form-input" id="material-supplier" placeholder="Optional">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Cost/Unit ($)</label>
                        <input type="number" class="form-input" id="material-cost" min="0" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Min Stock Level</label>
                        <input type="number" class="form-input" id="material-min-stock" min="0" step="0.01">
                    </div>
                </div>
            </form>
        `;

        App.showModal('Add Raw Material', content, () => this.saveMaterial());
    },

    showEditModal(id) {
        const material = this.materials.find(m => m._id === id);
        if (!material) return;

        const content = `
            <form id="material-form">
                <input type="hidden" id="material-id" value="${material._id}">
                
                <div class="form-group">
                    <label class="form-label">Material Name</label>
                    <input type="text" class="form-input" id="material-name" value="${material.name}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Material Type</label>
                    <select class="form-select" id="material-type">
                        <option value="Metal" ${material.type === 'Metal' ? 'selected' : ''}>Metal</option>
                        <option value="Plastic" ${material.type === 'Plastic' ? 'selected' : ''}>Plastic</option>
                        <option value="Rubber" ${material.type === 'Rubber' ? 'selected' : ''}>Rubber</option>
                        <option value="Chemical" ${material.type === 'Chemical' ? 'selected' : ''}>Chemical</option>
                        <option value="Other" ${material.type === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-input" id="material-quantity" value="${material.quantity}" required min="0" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Unit</label>
                        <select class="form-select" id="material-unit">
                            <option value="kg" ${material.unit === 'kg' ? 'selected' : ''}>Kilograms (kg)</option>
                            <option value="lbs" ${material.unit === 'lbs' ? 'selected' : ''}>Pounds (lbs)</option>
                            <option value="pcs" ${material.unit === 'pcs' ? 'selected' : ''}>Pieces (pcs)</option>
                            <option value="m" ${material.unit === 'm' ? 'selected' : ''}>Meters (m)</option>
                            <option value="L" ${material.unit === 'L' ? 'selected' : ''}>Liters (L)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Supplier</label>
                    <input type="text" class="form-input" id="material-supplier" value="${material.supplier || ''}">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Cost/Unit ($)</label>
                        <input type="number" class="form-input" id="material-cost" value="${material.costPerUnit || 0}" min="0" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Min Stock Level</label>
                        <input type="number" class="form-input" id="material-min-stock" value="${material.minimumStockLevel || 0}" min="0" step="0.01">
                    </div>
                </div>
            </form>
        `;

        App.showModal('Edit Raw Material', content, () => this.saveMaterial());
    },

    async saveMaterial() {
        const id = document.getElementById('material-id')?.value;
        const data = {
            name: document.getElementById('material-name').value,
            type: document.getElementById('material-type').value,
            quantity: parseFloat(document.getElementById('material-quantity').value),
            unit: document.getElementById('material-unit').value,
            supplier: document.getElementById('material-supplier').value,
            costPerUnit: parseFloat(document.getElementById('material-cost').value) || 0,
            minimumStockLevel: parseFloat(document.getElementById('material-min-stock').value) || 0
        };

        try {
            if (id) {
                await App.fetchAPI(`/raw-materials/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                App.showNotification('Material updated successfully', 'info');
            } else {
                await App.fetchAPI('/raw-materials', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                App.showNotification('Material added successfully', 'info');
            }

            App.closeModal();
            await this.loadMaterials();
            this.renderList();
        } catch (error) {
            App.showNotification('Error saving material', 'danger');
        }
    },

    async deleteMaterial(id) {
        if (!confirm('Are you sure you want to delete this material?')) return;

        try {
            await App.fetchAPI(`/raw-materials/${id}`, { method: 'DELETE' });
            App.showNotification('Material deleted successfully', 'info');
            await this.loadMaterials();
            this.renderList();
        } catch (error) {
            App.showNotification('Error deleting material', 'danger');
        }
    }
};
