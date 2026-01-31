// Reports and Analytics Component
const Reports = {
    dashboardData: null,
    productionData: null,
    inventoryData: null,

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Reports & Analytics</h2>
                <p>Insights and metrics for manufacturing operations</p>
            </div>
            
            <div id="reports-content">
                <div class="spinner"></div>
            </div>
        `;

        await this.loadData();
        this.renderReports();
    },

    async loadData() {
        try {
            [this.dashboardData, this.productionData, this.inventoryData] = await Promise.all([
                App.fetchAPI('/analytics/dashboard'),
                App.fetchAPI('/analytics/production'),
                App.fetchAPI('/analytics/inventory')
            ]);
        } catch (error) {
            console.error('Error loading reports data:', error);
        }
    },

    renderReports() {
        const reportsContainer = document.getElementById('reports-content');

        if (!this.dashboardData || !this.productionData || !this.inventoryData) {
            reportsContainer.innerHTML = '<p class="text-center">Unable to load reports data</p>';
            return;
        }

        reportsContainer.innerHTML = `
            <!-- Key Metrics -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Key Performance Indicators</h3>
                </div>
                <div class="stats-grid" style="margin: 0;">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon" style="color: var(--accent-success)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
                        </div>
                        <div class="stat-value">${this.dashboardData.qualityPassRate}%</div>
                        <div class="stat-label">Quality Pass Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon" style="color: var(--accent-primary)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
                        </div>
                        <div class="stat-value">${this.productionData.activeProduction}</div>
                        <div class="stat-label">Active Production</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon" style="color: var(--accent-secondary)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                        </div>
                        <div class="stat-value">${this.productionData.completedToday}</div>
                        <div class="stat-label">Completed Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-icon" style="color: var(--accent-warning)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg></div>
                        </div>
                        <div class="stat-value">${this.productionData.averageProgress}%</div>
                        <div class="stat-label">Avg. Progress</div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Production Analysis -->
                <div class="card" style="margin: 0;">
                    <div class="card-header">
                        <h3 class="card-title">Production Stages</h3>
                    </div>
                    ${this.renderWIPByStage()}
                </div>

                <!-- Quality & Alerts Summary -->
                <div class="card" style="margin: 0;">
                    <div class="card-header">
                        <h3 class="card-title">Health Overview</h3>
                    </div>
                    <div style="display: grid; gap: 12px;">
                        <div style="padding: 16px; background: rgba(52, 199, 89, 0.05); border-radius: 12px; border-left: 4px solid var(--accent-success);">
                            <div style="font-size: 0.8rem; color: var(--text-tertiary); text-transform: uppercase;">Pass Rate</div>
                            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-success);">${this.dashboardData.qualityPassRate}%</div>
                        </div>
                        <div style="padding: 16px; background: rgba(255, 59, 48, 0.05); border-radius: 12px; border-left: 4px solid var(--accent-danger);">
                            <div style="font-size: 0.8rem; color: var(--text-tertiary); text-transform: uppercase;">Quality Issues</div>
                            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-danger);">${this.dashboardData.qualityIssuesCount} Active</div>
                        </div>
                        <div style="padding: 16px; background: rgba(255, 149, 0, 0.05); border-radius: 12px; border-left: 4px solid var(--accent-warning);">
                            <div style="font-size: 0.8rem; color: var(--text-tertiary); text-transform: uppercase;">Stock Alerts</div>
                            <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-warning);">${this.dashboardData.lowStockCount} Low Level</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Inventory Analysis -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Inventory Insights</h3>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                    <div>
                        <h4 style="font-size: 0.85rem; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 16px;">Raw Materials</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="padding: 20px; background: var(--bg-glass); border-radius: 16px; border: 1px solid var(--border-glass);">
                                <div style="font-size: 1.5rem; font-weight: 700;">$${this.inventoryData.totalRawMaterialValue.toLocaleString()}</div>
                                <div style="color: var(--text-tertiary); font-size: 0.8rem;">Total Value</div>
                            </div>
                            <div style="padding: 20px; background: var(--bg-glass); border-radius: 16px; border: 1px solid var(--border-glass);">
                                <div style="font-size: 1.5rem; font-weight: 700;">${this.inventoryData.rawMaterialTypes}</div>
                                <div style="color: var(--text-tertiary); font-size: 0.8rem;">Types</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="font-size: 0.85rem; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 16px;">Finished Products</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="padding: 20px; background: var(--bg-glass); border-radius: 16px; border: 1px solid var(--border-glass);">
                                <div style="font-size: 1.5rem; font-weight: 700;">${this.inventoryData.totalFinishedProducts}</div>
                                <div style="color: var(--text-tertiary); font-size: 0.8rem;">Units</div>
                            </div>
                            <div style="padding: 20px; background: var(--bg-glass); border-radius: 16px; border: 1px solid var(--border-glass);">
                                <div style="font-size: 1.5rem; font-weight: 700;">${this.inventoryData.finishedProductTypes}</div>
                                <div style="color: var(--text-tertiary); font-size: 0.8rem;">Types</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            ${this.renderTopMaterials()}
        `;
    },

    renderWIPByStage() {
        const stages = this.productionData.wipByStage || {};
        const stageEntries = Object.entries(stages);

        if (stageEntries.length === 0) {
            return '<p style="color: var(--text-tertiary); font-size: 0.9rem;">No active production to analyze</p>';
        }

        const total = stageEntries.reduce((sum, [_, count]) => sum + count, 0);

        return `
            <div style="display: grid; gap: 16px;">
                ${stageEntries.map(([stage, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem;">
                                <span style="font-weight: 600; text-transform: capitalize;">${stage}</span>
                                <span style="color: var(--text-secondary); opacity: 0.8;">${count} items (${percentage}%)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderTopMaterials() {
        const topMaterials = this.inventoryData.topMaterials || [];

        if (topMaterials.length === 0) {
            return '';
        }

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">High-Value Inventory</h3>
                </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Material Name</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topMaterials.map((material, index) => `
                                <tr>
                                    <td style="width: 60px;"><span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-primary);">#${index + 1}</span></td>
                                    <td><strong style="color: var(--text-primary); font-size: 0.9rem;">${material.name}</strong></td>
                                    <td><span style="font-weight: 600; color: var(--text-secondary);">$${material.value.toLocaleString()}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};
