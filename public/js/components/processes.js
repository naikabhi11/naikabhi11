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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                    </svg>
                    <h3>No Processes Defined</h3>
                    <p>Create your first manufacturing process template</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div style="display: grid; gap: 1.5rem;">
                ${this.processes.map(process => this.renderProcessCard(process)).join('')}
            </div>
        `;
    },

    renderProcessCard(process) {
        const inputMaterials = process.inputMaterials || [];
        const duration = process.estimatedDuration || 'N/A';

        return `
            <div class="card" style="margin: 0;">
                <div class="card-header">
                    <div>
                        <h3 style="margin: 0; font-size: 1.25rem;">${process.name}</h3>
                        <p style="margin: 0.25rem 0 0; color: var(--text-secondary); font-size: 0.9rem;">
                            ${process.description || 'No description'}
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="Processes.showEditModal('${process._id}')">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="Processes.deleteProcess('${process._id}')">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Input Materials</h4>
                        ${inputMaterials.length > 0 ? `
                            <ul style="margin: 0; padding-left: 1.25rem;">
                                ${inputMaterials.map(m => `
                                    <li style="margin-bottom: 0.5rem;">
                                        ${m.materialName}: ${m.quantity} ${m.unit}
                                    </li>
                                `).join('')}
                            </ul>
                        ` : '<p style="color: var(--text-muted);">No materials specified</p>'}
                    </div>
                    
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Process Details</h4>
                        <p style="margin: 0 0 0.5rem;"><strong>Output:</strong> ${process.outputProduct || 'Not specified'}</p>
                        <p style="margin: 0 0 0.5rem;"><strong>Duration:</strong> ${duration} hours</p>
                        <p style="margin: 0;"><strong>Status:</strong> 
                            <span class="badge badge-${process.status === 'active' ? 'success' : 'info'}">
                                ${process.status || 'active'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    showAddModal() {
        const content = `
            <form id="process-form">
                <div class="form-group">
                    <label class="form-label">Process Name *</label>
                    <input type="text" class="form-input" id="process-name" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="process-description"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Output Product *</label>
                    <input type="text" class="form-input" id="process-output" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Estimated Duration (hours)</label>
                    <input type="number" class="form-input" id="process-duration" min="0" step="0.5">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Input Materials (JSON format)</label>
                    <textarea class="form-textarea" id="process-materials" placeholder='[{"materialName": "Steel", "quantity": 10, "unit": "kg"}]'></textarea>
                    <small style="color: var(--text-muted);">Enter as JSON array with materialName, quantity, and unit</small>
                </div>
            </form>
        `;

        App.showModal('Add Manufacturing Process', content, () => this.saveProcess());
    },

    showEditModal(id) {
        const process = this.processes.find(p => p._id === id);
        if (!process) return;

        const materialsJSON = JSON.stringify(process.inputMaterials || [], null, 2);

        const content = `
            <form id="process-form">
                <input type="hidden" id="process-id" value="${process._id}">
                
                <div class="form-group">
                    <label class="form-label">Process Name *</label>
                    <input type="text" class="form-input" id="process-name" value="${process.name}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" id="process-description">${process.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Output Product *</label>
                    <input type="text" class="form-input" id="process-output" value="${process.outputProduct || ''}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Estimated Duration (hours)</label>
                    <input type="number" class="form-input" id="process-duration" value="${process.estimatedDuration || ''}" min="0" step="0.5">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Input Materials (JSON format)</label>
                    <textarea class="form-textarea" id="process-materials">${materialsJSON}</textarea>
                    <small style="color: var(--text-muted);">Enter as JSON array with materialName, quantity, and unit</small>
                </div>
            </form>
        `;

        App.showModal('Edit Manufacturing Process', content, () => this.saveProcess());
    },

    async saveProcess() {
        const id = document.getElementById('process-id')?.value;

        let inputMaterials = [];
        try {
            const materialsText = document.getElementById('process-materials').value.trim();
            if (materialsText) {
                inputMaterials = JSON.parse(materialsText);
            }
        } catch (e) {
            App.showNotification('Invalid JSON format for input materials', 'danger');
            return;
        }

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
