// Production (Work in Progress) Component
const Production = {
    wipItems: [],
    processes: [],

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Production Tracking (WIP)</h2>
                <p>Monitor work-in-progress items through manufacturing stages</p>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Active Production Batches</h3>
                    <button class="btn btn-primary" onclick="Production.showAddModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Start Production
                    </button>
                </div>
                <div id="wip-list">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        await this.loadData();
        this.renderList();
    },

    async loadData() {
        try {
            [this.wipItems, this.processes] = await Promise.all([
                App.fetchAPI('/wip'),
                App.fetchAPI('/processes')
            ]);
        } catch (error) {
            console.error('Error loading WIP data:', error);
        }
    },

    renderList() {
        const listContainer = document.getElementById('wip-list');

        if (this.wipItems.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Active Production</h3>
                    <p>Start a new production batch to begin tracking</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px;">
                ${this.wipItems.map(item => this.renderWIPCard(item)).join('')}
            </div>
        `;
    },

    renderWIPCard(item) {
        const progress = item.progress || 0;
        const startDate = App.formatDate(item.startDate);

        return `
            <div class="card" style="margin: 0; display: flex; flex-direction: column;">
                <div class="card-header" style="align-items: flex-start; margin-bottom: 20px;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">Batch #${item.batchNumber}</h3>
                        <p style="margin: 4px 0 0; color: var(--text-tertiary); font-size: 0.85rem;">
                            ${item.processName || 'Unknown Process'}
                        </p>
                    </div>
                </div>
                
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
                        <span style="color: var(--text-secondary);">${item.currentStage || 'Stage'}</span>
                        <span style="font-weight: 600; color: var(--accent-primary);">${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 0.85rem;">
                    <div>
                        <p style="margin: 0; color: var(--text-tertiary); font-size: 0.75rem; text-transform: uppercase;">Operator</p>
                        <p style="margin: 4px 0 0; font-weight: 500;">${item.assignedOperator || 'Unassigned'}</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: var(--text-tertiary); font-size: 0.75rem; text-transform: uppercase;">Start Date</p>
                        <p style="margin: 4px 0 0; font-weight: 500;">${startDate}</p>
                    </div>
                </div>
                
                <div style="padding-top: 20px; border-top: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;">
                    <div class="flex gap-1" style="flex-wrap: wrap;">
                        <button class="btn btn-secondary" style="padding: 4px 10px;" onclick="Production.showEditModal('${item._id}')">Update</button>
                        <button class="btn btn-success" style="padding: 4px 10px; background: rgba(52, 199, 89, 0.1); color: var(--accent-success); border: 1px solid rgba(52, 199, 89, 0.2);" onclick="Production.completeProduction('${item._id}')">Complete</button>
                    </div>
                    <button class="btn btn-danger" style="padding: 4px 10px; background: transparent; border-color: transparent; color: var(--text-tertiary);" onclick="Production.cancelProduction('${item._id}')">Cancel</button>
                </div>
            </div>
        `;
    },

    showAddModal() {
        const processOptions = this.processes.map(p =>
            `<option value="${p._id}">${p.name}</option>`
        ).join('');

        const content = `
            <form id="wip-form">
                <div class="form-group">
                    <label class="form-label">Batch Number *</label>
                    <input type="text" class="form-input" id="wip-batch" value="BATCH-${Date.now()}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Manufacturing Process *</label>
                    <select class="form-select" id="wip-process" required>
                        <option value="">Select a process...</option>
                        ${processOptions}
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input type="number" class="form-input" id="wip-quantity" min="1" value="1">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Current Stage</label>
                    <select class="form-select" id="wip-stage">
                        <option value="Preparation">Preparation</option>
                        <option value="Machining">Machining</option>
                        <option value="Assembly">Assembly</option>
                        <option value="Finishing">Finishing</option>
                        <option value="Quality Check">Quality Check</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Assigned Operator</label>
                    <input type="text" class="form-input" id="wip-operator">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Progress (%)</label>
                    <input type="number" class="form-input" id="wip-progress" min="0" max="100" value="0">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-textarea" id="wip-notes"></textarea>
                </div>
            </form>
        `;

        App.showModal('Start New Production', content, () => this.saveWIP());
    },

    showEditModal(id) {
        const item = this.wipItems.find(w => w._id === id);
        if (!item) return;

        const content = `
            <form id="wip-form">
                <input type="hidden" id="wip-id" value="${item._id}">
                
                <div class="form-group">
                    <label class="form-label">Batch Number</label>
                    <input type="text" class="form-input" id="wip-batch" value="${item.batchNumber}" readonly>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Current Stage</label>
                    <select class="form-select" id="wip-stage">
                        <option value="Preparation" ${item.currentStage === 'Preparation' ? 'selected' : ''}>Preparation</option>
                        <option value="Machining" ${item.currentStage === 'Machining' ? 'selected' : ''}>Machining</option>
                        <option value="Assembly" ${item.currentStage === 'Assembly' ? 'selected' : ''}>Assembly</option>
                        <option value="Finishing" ${item.currentStage === 'Finishing' ? 'selected' : ''}>Finishing</option>
                        <option value="Quality Check" ${item.currentStage === 'Quality Check' ? 'selected' : ''}>Quality Check</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Progress (%)</label>
                    <input type="number" class="form-input" id="wip-progress" min="0" max="100" value="${item.progress || 0}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Assigned Operator</label>
                    <input type="text" class="form-input" id="wip-operator" value="${item.assignedOperator || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-textarea" id="wip-notes">${item.notes || ''}</textarea>
                </div>
            </form>
        `;

        App.showModal('Update Production Progress', content, () => this.saveWIP());
    },

    async saveWIP() {
        const id = document.getElementById('wip-id')?.value;
        const processId = document.getElementById('wip-process')?.value;

        let processName = '';
        if (processId) {
            const process = this.processes.find(p => p._id === processId);
            processName = process ? process.name : '';
        }

        const data = {
            batchNumber: document.getElementById('wip-batch').value,
            processId: processId || undefined,
            processName: processName || document.getElementById('wip-batch').value,
            quantity: parseInt(document.getElementById('wip-quantity')?.value) || 1,
            currentStage: document.getElementById('wip-stage').value,
            assignedOperator: document.getElementById('wip-operator').value,
            progress: parseInt(document.getElementById('wip-progress').value) || 0,
            notes: document.getElementById('wip-notes').value
        };

        try {
            if (id) {
                await App.fetchAPI(`/wip/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                App.showNotification('Production updated successfully', 'info');
            } else {
                await App.fetchAPI('/wip', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                App.showNotification('Production started successfully', 'info');
            }

            App.closeModal();
            await this.loadData();
            this.renderList();
        } catch (error) {
            App.showNotification('Error saving production', 'danger');
        }
    },

    async completeProduction(id) {
        const item = this.wipItems.find(w => w._id === id);
        if (!item) return;

        if (!confirm('Mark this production as complete and move to finished products?')) return;

        try {
            // Create finished product
            await App.fetchAPI('/finished-products', {
                method: 'POST',
                body: JSON.stringify({
                    name: item.processName,
                    sku: `FP-${item.batchNumber}`,
                    quantity: item.quantity || 1,
                    batchNumber: item.batchNumber,
                    manufacturingDate: new Date(),
                    qualityStatus: 'pending',
                    specifications: `Completed from batch ${item.batchNumber}`
                })
            });

            // Delete from WIP
            await App.fetchAPI(`/wip/${id}`, { method: 'DELETE' });

            App.showNotification('Production completed successfully', 'info');
            await this.loadData();
            this.renderList();
        } catch (error) {
            App.showNotification('Error completing production', 'danger');
        }
    },

    async cancelProduction(id) {
        if (!confirm('Are you sure you want to cancel this production?')) return;

        try {
            await App.fetchAPI(`/wip/${id}`, { method: 'DELETE' });
            App.showNotification('Production cancelled', 'info');
            await this.loadData();
            this.renderList();
        } catch (error) {
            App.showNotification('Error cancelling production', 'danger');
        }
    }
};
