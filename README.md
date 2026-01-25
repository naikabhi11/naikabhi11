# Manufacturing Tracking System

A comprehensive web application for tracking products through the manufacturing lifecycle in the mechanical industry, from raw materials to finished goods.

![Manufacturing Tracking](https://img.shields.io/badge/Status-Production%20Ready-success)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Required-blue)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Community Edition

### Installation

1. **Install MongoDB** (if not already installed):
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Application**:
   ```bash
   npm start
   ```

4. **Access the App**:
   
   Open your browser to: **http://localhost:3000**

## ✨ Features

- **📦 Raw Materials Management** - Track inventory, suppliers, and stock levels
- **⚙️ Manufacturing Processes** - Define production workflows and templates
- **🔄 Production Tracking** - Monitor work-in-progress through manufacturing stages
- **✅ Quality Control** - Record inspections and maintain quality standards
- **📊 Finished Products** - Manage completed inventory with batch traceability
- **📈 Reports & Analytics** - Real-time insights and performance metrics

## 🎨 Modern Design

- Dark mode theme with glassmorphism effects
- Vibrant gradients and smooth animations
- Responsive layout for all devices
- Intuitive navigation and user experience

## 🔄 Complete Workflow

1. Add raw materials to inventory
2. Create manufacturing process templates
3. Start production batches
4. Track progress through stages
5. Perform quality inspections
6. Complete and move to finished products
7. Analyze performance with reports

## 📁 Project Structure

```
├── server.js              # Express server with MongoDB
├── package.json           # Dependencies
└── public/
    ├── index.html        # Main HTML
    ├── css/
    │   └── styles.css    # Design system
    └── js/
        ├── app.js        # Main controller
        └── components/   # Feature modules
```

## 🗄️ Database

Uses MongoDB with collections:
- `rawMaterials` - Raw materials inventory
- `processes` - Manufacturing process templates
- `wip` - Work-in-progress items
- `finishedProducts` - Completed products
- `qualityChecks` - Quality inspection records

## 🔧 API Endpoints

All endpoints are RESTful and return JSON:

- `/api/raw-materials` - Raw materials CRUD
- `/api/processes` - Manufacturing processes CRUD
- `/api/wip` - Work-in-progress CRUD
- `/api/finished-products` - Finished products CRUD
- `/api/quality-checks` - Quality inspections
- `/api/analytics/*` - Dashboard, production, and inventory analytics

## 💡 Usage Tips

1. Start by adding raw materials
2. Define reusable process templates
3. Update WIP progress regularly
4. Record quality inspections
5. Monitor dashboard for alerts
6. Use reports to optimize operations

## 🐛 Troubleshooting

**MongoDB Connection Error**
```bash
# Ensure MongoDB is running
brew services start mongodb-community
```

**Port 3000 Already in Use**
- Stop other applications using port 3000
- Or modify PORT in server.js

## 📄 License

ISC

## 🤝 Contributing

This is a production tracking application for mechanical manufacturing. Feel free to customize for your specific needs.

---

**Built with ❤️ for Manufacturing Excellence**
