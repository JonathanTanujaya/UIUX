// Web Worker for background stock calculations
// This file should be placed in public/workers/stock-calculator.js

class StockCalculatorWorker {
  constructor() {
    this.calculations = new Map();
    this.isRunning = false;
  }

  startCalculations() {
    this.isRunning = true;
    this.scheduleNextCalculation();
  }

  stopCalculations() {
    this.isRunning = false;
  }

  scheduleNextCalculation() {
    if (!this.isRunning) return;
    
    setTimeout(() => {
      this.performCalculations();
      this.scheduleNextCalculation();
    }, 30000); // Run every 30 seconds
  }

  async performCalculations() {
    try {
      // Mock calculation - in real implementation, this would fetch data
      const products = await this.fetchProducts();
      
      for (const product of products) {
        const results = await this.calculateProductMetrics(product);
        
        self.postMessage({
          type: 'CALCULATION_COMPLETE',
          productId: product.id,
          results: results
        });
      }
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        error: error.message
      });
    }
  }

  async fetchProducts() {
    // Mock data - replace with actual API call
    return [
      { id: 1, name: 'Product 1', cost: 100, leadTimeDays: 7 },
      { id: 2, name: 'Product 2', cost: 200, leadTimeDays: 10 }
    ];
  }

  async calculateProductMetrics(product) {
    // Simplified calculations for worker
    const averageDailyUsage = 10; // Mock value
    const leadTime = product.leadTimeDays || 7;
    const safetyStockDays = 3;
    
    const reorderPoint = averageDailyUsage * leadTime + (averageDailyUsage * safetyStockDays);
    const safetyStock = averageDailyUsage * safetyStockDays;
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      reorderPoint,
      safetyStock,
      calculatedAt: new Date().toISOString()
    };
  }
}

// Worker main thread
const calculator = new StockCalculatorWorker();

self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'START_CALCULATIONS':
      calculator.startCalculations();
      break;
    case 'STOP_CALCULATIONS':
      calculator.stopCalculations();
      break;
    case 'CALCULATE_PRODUCT':
      calculator.calculateProductMetrics(data.product)
        .then(results => {
          self.postMessage({
            type: 'CALCULATION_COMPLETE',
            productId: data.product.id,
            results
          });
        })
        .catch(error => {
          self.postMessage({
            type: 'ERROR',
            error: error.message
          });
        });
      break;
  }
};
