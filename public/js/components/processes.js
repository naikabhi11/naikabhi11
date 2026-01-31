// Manufacturing Processes Component
const Processes = {
    processes: [],
    rawMaterials: [],

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Manufacturing Processes</h2>
                <p>Define and manage production workflows</p>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Process Templates</h3>
                    <button class="btn btn-primary" onclick="Processes.showAddModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Process
                    </button>
                </div>
                <div id="processes-list">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        await this.loadData();
        this.renderList();
    },

    async loadData() {
        try {
            [this.processes, this.rawMaterials] = await Promise.all([
                App.fetchAPI('/processes'),
                App.fetchAPI('/raw-materials')
            ]);
        } catch (error) {
            console.error('Error loading processes:', error);
        }
    },

    renderList() {
        const listContainer = document.getElementById('processes-list');

        if (this.processes.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Processes Defined</h3>
                    <p>Create your first manufacturing process template</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                ${this.processes.map(process => this.renderProcessCard(process)).join('')}
            </div>
        `;
    },

    renderProcessCard(process) {
        const inputMaterials = process.inputMaterials || [];
        const duration = process.estimatedDuration || 'N/A';

        return `
            <div class="card" style="margin: 0; display: flex; flex-direction: column;">
                <div class="card-header" style="align-items: flex-start; margin-bottom: 24px;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">${process.name}</h3>
                        <p style="margin: 4px 0 0; color: var(--text-tertiary); font-size: 0.85rem; line-height: 1.4;">
                            ${process.description || 'No description'}
                        </p>
                    </div>
                </div>
                
                <div style="flex: 1; margin-bottom: 24px;">
                    <h4 style="font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Input Materials</h4>
                    ${inputMaterials.length > 0 ? `
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${inputMaterials.map(m => `
                                <span class="badge" style="background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-secondary);">
                                    ${m.materialName} • ${m.quantity} ${m.unit}
                                </span>
                            `).join('')}
                        </div>
                    ` : '<p style="color: var(--text-tertiary); font-size: 0.85rem;">No materials specified</p>'}
                </div>
                
                <div style="padding-top: 20px; border-top: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">
                        <span style="color: var(--text-tertiary);">Output:</span> ${process.outputProduct || '—'}
                    </div>
                    <div class="flex gap-1">
                        <button class="btn btn-secondary" style="padding: 4px 10px;" onclick="Processes.showEditModal('${process._id}')">Edit</button>
                        <button class="btn btn-danger" style="padding: 4px 10px; background: rgba(255, 59, 48, 0.1); color: var(--accent-danger);" onclick="Processes.deleteProcess('${process._id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    },

    showAddModal() {
        const content = `
            <form id="process-form">
                <div class="form-group">
                    <label class="form-label">Process Name</label>
                    <input type="text" class="form-input" id="process-name" placeholder="e.g. CNC Milling Phase 1" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="process-description" placeholder="Describe the workflow steps..." style="min-height: 80px;"></textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Output Product</label>
                        <input type="text" class="form-input" id="process-output" placeholder="e.g. Machined Housing" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Est. Duration (hrs)</label>
                        <input type="number" class="form-input" id="process-duration" min="0" step="0.5" placeholder="2.5">
                    </div>
                </div>
                
                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <label class="form-label" style="margin: 0;">Input Materials</label>
                        <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 8px;" onclick="Processes.addMaterialRow()">
                            + Add Material
                        </button>
                    </div>
                    <div id="materials-container"></div>
                </div>
            </form>
        `;

        App.showModal('Add Manufacturing Process', content, () => this.saveProcess());
        setTimeout(() => this.addMaterialRow(), 100);
    },

    addMaterialRow(material = null) {
        const container = document.getElementById('materials-container');
        if (!container) return;

        const rowId = `material-row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const row = document.createElement('div');
        row.id = rowId;
        row.className = 'material-row';
        row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; margin-bottom: 12px; align-items: flex-end;';

        row.innerHTML = `
            <div>
                <input type="text" class="form-input material-name" value="${material?.materialName || ''}" placeholder="Material" style="padding: 8px;" required>
            </div>
            <div>
                <input type="number" class="form-input material-quantity" value="${material?.quantity || ''}" min="0" step="0.01" placeholder="Qty" style="padding: 8px;" required>
            </div>
            <div>
                <select class="form-select material-unit" style="padding: 8px;">
                    <option value="kg" ${material?.unit === 'kg' ? 'selected' : ''}>kg</option>
                    <option value="pcs" ${material?.unit === 'pcs' ? 'selected' : ''}>pcs</option>
                    <option value="m" ${material?.unit === 'm' ? 'selected' : ''}>m</option>
                    <option value="L" ${material?.unit === 'L' ? 'selected' : ''}>L</option>
                </select>
            </div>
            <button type="button" class="modal-close" onclick="Processes.removeMaterialRow('${rowId}')" style="background: rgba(255,59,48,0.1); color: var(--accent-danger); border-radius: 8px;">
                ×
            </button>
        `;

        container.appendChild(row);
    },

    removeMaterialRow(rowId) {
        const row = document.getElementById(rowId);
        if (row) {
            row.remove();
        }
    },

    showEditModal(id) {
        const process = this.processes.find(p => p._id === id);
        if (!process) return;

        const content = `
            <form id="process-form">
                <input type="hidden" id="process-id" value="${process._id}">
                
                <div class="form-group">
                    <label class="form-label">Process Name</label>
                    <input type="text" class="form-input" id="process-name" value="${process.name}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="process-description" style="min-height: 80px;">${process.description || ''}</textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label class="form-label">Output Product</label>
                        <input type="text" class="form-input" id="process-output" value="${process.outputProduct || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Est. Duration (hrs)</label>
                        <input type="number" class="form-input" id="process-duration" value="${process.estimatedDuration || ''}" min="0" step="0.5">
                    </div>
                </div>
                
                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <label class="form-label" style="margin: 0;">Input Materials</label>
                        <button type="button" class="btn btn-secondary" style="font-size: 0.75rem; padding: 4px 8px;" onclick="Processes.addMaterialRow()">
                            + Add Material
                        </button>
                    </div>
                    <div id="materials-container"></div>
                </div>
            </form>
        `;

        App.showModal('Edit Manufacturing Process', content, () => this.saveProcess());

        setTimeout(() => {
            const materials = process.inputMaterials || [];
            if (materials.length > 0) {
                materials.forEach(material => this.addMaterialRow(material));
            } else {
                this.addMaterialRow();
            }
        }, 100);
    },

    async saveProcess() {
        const id = document.getElementById('process-id')?.value;

        // Collect materials from dynamic form
        const inputMaterials = [];
        const materialRows = document.querySelectorAll('.material-row');

        materialRows.forEach(row => {
            const name = row.querySelector('.material-name')?.value.trim();
            const quantity = parseFloat(row.querySelector('.material-quantity')?.value);
            const unit = row.querySelector('.material-unit')?.value;

            if (name && quantity && unit) {
                inputMaterials.push({
                    materialName: name,
                    quantity: quantity,
                    unit: unit
                });
            }
        });

        const data = {
            name: document.getElementById('process-name').value,
            description: document.getElementById('process-description').value,
            outputProduct: document.getElementById('process-output').value,
            estimatedDuration: parseFloat(document.getElementById('process-duration').value) || 0,
            inputMaterials,
            status: 'active'
        };

        try {
            if (id) {
                await App.fetchAPI(`/processes/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                App.showNotification('Process updated successfully', 'info');
            } else {
                await App.fetchAPI('/processes', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                App.showNotification('Process added successfully', 'info');
            }

            App.closeModal();
            await this.loadData();
            this.renderList();
        } catch (error) {
            App.showNotification('Error saving process', 'danger');
        }
    },

    async deleteProcess(id) {
        if (!confirm('Are you sure you want to delete this process?')) return;

        try {
            await App.fetchAPI(`/processes/${id}`, { method: 'DELETE' });
            App.showNotification('Process deleted successfully', 'info');
            await this.loadData();
            this.renderList();
        } catch (error) {
            App.showNotification('Error deleting process', 'danger');
        }
    }
};
