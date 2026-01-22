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
                    <div style="text-align: center; padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px;">
                        <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${this.dashboardData.qualityPassRate}%</div>
                        <div style="color: var(--text-secondary);">Quality Pass Rate</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: rgba(75, 174, 254, 0.1); border-radius: 12px;">
                        <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${this.productionData.activeProduction}</div>
                        <div style="color: var(--text-secondary);">Active Production</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: rgba(240, 147, 251, 0.1); border-radius: 12px;">
                        <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${this.productionData.completedToday}</div>
                        <div style="color: var(--text-secondary);">Completed Today</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: rgba(254, 225, 64, 0.1); border-radius: 12px;">
                        <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${this.productionData.averageProgress}%</div>
                        <div style="color: var(--text-secondary);">Avg. Progress</div>
                    </div>
                </div>
            </div>
            
            <!-- Production Analysis -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Production Analysis</h3>
                </div>
                <div>
                    <h4 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1rem;">Work in Progress by Stage</h4>
                    ${this.renderWIPByStage()}
                </div>
            </div>
            
            <!-- Inventory Analysis -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Inventory Analysis</h3>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1rem;">Raw Materials</h4>
                        <div style="padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; margin-bottom: 1rem;">
                            <div style="font-size: 1.75rem; font-weight: 700;">$${this.inventoryData.totalRawMaterialValue}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Total Value</div>
                        </div>
                        <div style="padding: 1.5rem; background: rgba(75, 174, 254, 0.1); border-radius: 12px;">
                            <div style="font-size: 1.75rem; font-weight: 700;">${this.inventoryData.rawMaterialTypes}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Material Types</div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1rem;">Finished Products</h4>
                        <div style="padding: 1.5rem; background: rgba(240, 147, 251, 0.1); border-radius: 12px; margin-bottom: 1rem;">
                            <div style="font-size: 1.75rem; font-weight: 700;">${this.inventoryData.totalFinishedProducts}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Total Units</div>
                        </div>
                        <div style="padding: 1.5rem; background: rgba(254, 225, 64, 0.1); border-radius: 12px;">
                            <div style="font-size: 1.75rem; font-weight: 700;">${this.inventoryData.finishedProductTypes}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">Product Types</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Top Materials by Value -->
            ${this.renderTopMaterials()}
            
            <!-- Quality Metrics -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Quality Metrics</h3>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">
                    <div style="text-align: center; padding: 1.5rem; background: rgba(75, 174, 254, 0.1); border-radius: 12px;">
                        <div style="font-size: 2rem; font-weight: 700; color: #4facfe; margin-bottom: 0.5rem;">${this.dashboardData.qualityPassRate}%</div>
                        <div style="color: var(--text-secondary);">Pass Rate</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: rgba(255, 107, 107, 0.1); border-radius: 12px;">
                        <div style="font-size: 2rem; font-weight: 700; color: #ff6b6b; margin-bottom: 0.5rem;">${this.dashboardData.qualityIssuesCount}</div>
                        <div style="color: var(--text-secondary);">Quality Issues</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: rgba(254, 225, 64, 0.1); border-radius: 12px;">
                        <div style="font-size: 2rem; font-weight: 700; color: #fee140; margin-bottom: 0.5rem;">${this.dashboardData.lowStockCount}</div>
                        <div style="color: var(--text-secondary);">Low Stock Alerts</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderWIPByStage() {
        const stages = this.productionData.wipByStage || {};
        const stageEntries = Object.entries(stages);

        if (stageEntries.length === 0) {
            return '<p style="color: var(--text-muted);">No active production to analyze</p>';
        }

        const total = stageEntries.reduce((sum, [_, count]) => sum + count, 0);

        return `
            <div style="display: grid; gap: 1rem;">
                ${stageEntries.map(([stage, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600; text-transform: capitalize;">${stage}</span>
                                <span style="color: var(--text-secondary);">${count} items (${percentage}%)</span>
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
                    <h3 class="card-title">Top Materials by Value</h3>
                </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Material Name</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topMaterials.map((material, index) => `
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <div style="width: 32px; height: 32px; border-radius: 8px; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                                                ${index + 1}
                                            </div>
                                            <strong>${material.name}</strong>
                                        </div>
                                    </td>
                                    <td><strong>$${material.value}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};
