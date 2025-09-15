// StockEngine - Core calculation engine for inventory management
class StockEngine {
  constructor() {
    this.calculations = new Map();
    this.listeners = new Set();
    this.workers = new Map();
    this.auditTrail = [];
    this.decimalPrecision = 4;
  }

  // ===== CORE CALCULATION METHODS =====

  /**
   * Calculate reorder point based on lead time and demand
   * Formula: (Average Daily Usage × Lead Time) + Safety Stock
   */
  calculateReorderPoint(product, options = {}) {
    const {
      averageDailyUsage = this.getAverageDailyUsage(product.id),
      leadTimeDays = product.leadTimeDays || 7,
      safetyStockDays = product.safetyStockDays || 3,
      seasonalFactor = 1.0,
    } = options;

    const baseReorderPoint = averageDailyUsage * leadTimeDays;
    const safetyStock = averageDailyUsage * safetyStockDays;
    const reorderPoint = (baseReorderPoint + safetyStock) * seasonalFactor;

    return this.roundToDecimal(reorderPoint);
  }

  /**
   * Calculate safety stock using statistical method
   * Formula: Z-score × √(Lead Time) × Standard Deviation of Demand
   */
  calculateSafetyStock(product, serviceLevel = 0.95) {
    const zScore = this.getZScore(serviceLevel);
    const leadTime = product.leadTimeDays || 7;
    const demandStdDev = this.getDemandStandardDeviation(product.id);

    const safetyStock = zScore * Math.sqrt(leadTime) * demandStdDev;
    return this.roundToDecimal(Math.max(0, safetyStock));
  }

  /**
   * Calculate Economic Order Quantity (EOQ)
   * Formula: √((2 × Annual Demand × Ordering Cost) / Holding Cost per Unit)
   */
  calculateEOQ(product) {
    const annualDemand = this.getAnnualDemand(product.id);
    const orderingCost = product.orderingCost || 50; // Default ordering cost
    const holdingCostPercentage = product.holdingCostPercentage || 0.25; // 25% of unit cost
    const unitCost = product.cost || 0;
    const holdingCostPerUnit = unitCost * holdingCostPercentage;

    if (holdingCostPerUnit === 0) return 0;

    const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCostPerUnit);
    return this.roundToDecimal(eoq);
  }

  /**
   * Calculate inventory turnover ratio
   * Formula: Cost of Goods Sold / Average Inventory Value
   */
  calculateInventoryTurnover(product, period = 365) {
    const cogs = this.getCOGS(product.id, period);
    const avgInventoryValue = this.getAverageInventoryValue(product.id, period);

    if (avgInventoryValue === 0) return 0;
    return this.roundToDecimal(cogs / avgInventoryValue);
  }

  /**
   * Calculate ABC classification based on value and movement
   */
  calculateABCClassification(products) {
    // Calculate annual value for each product
    const productsWithValue = products.map(product => ({
      ...product,
      annualValue: this.getAnnualDemand(product.id) * (product.cost || 0),
    }));

    // Sort by annual value descending
    productsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    // Calculate cumulative percentages
    const totalValue = productsWithValue.reduce((sum, p) => sum + p.annualValue, 0);
    let cumulativeValue = 0;

    return productsWithValue.map(product => {
      cumulativeValue += product.annualValue;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;

      let classification;
      if (cumulativePercentage <= 80) {
        classification = 'A';
      } else if (cumulativePercentage <= 95) {
        classification = 'B';
      } else {
        classification = 'C';
      }

      return { ...product, classification, cumulativePercentage };
    });
  }

  // ===== STOCK VALUATION METHODS =====

  /**
   * Calculate FIFO (First In, First Out) valuation
   */
  calculateFIFOValuation(stockMovements) {
    const inventory = [];
    let totalValue = 0;
    let totalQuantity = 0;

    stockMovements.forEach(movement => {
      if (movement.type === 'IN') {
        inventory.push({
          quantity: movement.quantity,
          unitCost: movement.unitCost,
          date: movement.date,
          lotNumber: movement.lotNumber,
        });
        totalQuantity += movement.quantity;
        totalValue += movement.quantity * movement.unitCost;
      } else if (movement.type === 'OUT') {
        let remainingToDeduct = movement.quantity;

        while (remainingToDeduct > 0 && inventory.length > 0) {
          const oldestLot = inventory[0];
          const deductFromLot = Math.min(remainingToDeduct, oldestLot.quantity);

          totalValue -= deductFromLot * oldestLot.unitCost;
          totalQuantity -= deductFromLot;
          remainingToDeduct -= deductFromLot;

          oldestLot.quantity -= deductFromLot;
          if (oldestLot.quantity === 0) {
            inventory.shift();
          }
        }
      }
    });

    return {
      totalQuantity: this.roundToDecimal(totalQuantity),
      totalValue: this.roundToDecimal(totalValue),
      averageUnitCost: totalQuantity > 0 ? this.roundToDecimal(totalValue / totalQuantity) : 0,
      inventory: inventory.map(lot => ({
        ...lot,
        quantity: this.roundToDecimal(lot.quantity),
      })),
    };
  }

  /**
   * Calculate LIFO (Last In, First Out) valuation
   */
  calculateLIFOValuation(stockMovements) {
    const inventory = [];
    let totalValue = 0;
    let totalQuantity = 0;

    stockMovements.forEach(movement => {
      if (movement.type === 'IN') {
        inventory.push({
          quantity: movement.quantity,
          unitCost: movement.unitCost,
          date: movement.date,
          lotNumber: movement.lotNumber,
        });
        totalQuantity += movement.quantity;
        totalValue += movement.quantity * movement.unitCost;
      } else if (movement.type === 'OUT') {
        let remainingToDeduct = movement.quantity;

        while (remainingToDeduct > 0 && inventory.length > 0) {
          const newestLot = inventory[inventory.length - 1];
          const deductFromLot = Math.min(remainingToDeduct, newestLot.quantity);

          totalValue -= deductFromLot * newestLot.unitCost;
          totalQuantity -= deductFromLot;
          remainingToDeduct -= deductFromLot;

          newestLot.quantity -= deductFromLot;
          if (newestLot.quantity === 0) {
            inventory.pop();
          }
        }
      }
    });

    return {
      totalQuantity: this.roundToDecimal(totalQuantity),
      totalValue: this.roundToDecimal(totalValue),
      averageUnitCost: totalQuantity > 0 ? this.roundToDecimal(totalValue / totalQuantity) : 0,
      inventory: inventory.map(lot => ({
        ...lot,
        quantity: this.roundToDecimal(lot.quantity),
      })),
    };
  }

  /**
   * Calculate weighted average cost valuation
   */
  calculateWeightedAverageValuation(stockMovements) {
    let totalQuantity = 0;
    let totalValue = 0;
    let averageUnitCost = 0;

    stockMovements.forEach(movement => {
      if (movement.type === 'IN') {
        const newTotalQuantity = totalQuantity + movement.quantity;
        const newTotalValue = totalValue + movement.quantity * movement.unitCost;

        totalQuantity = newTotalQuantity;
        totalValue = newTotalValue;
        averageUnitCost = totalQuantity > 0 ? totalValue / totalQuantity : 0;
      } else if (movement.type === 'OUT') {
        totalQuantity -= movement.quantity;
        totalValue -= movement.quantity * averageUnitCost;

        // Ensure no negative values
        totalQuantity = Math.max(0, totalQuantity);
        totalValue = Math.max(0, totalValue);

        if (totalQuantity === 0) {
          averageUnitCost = 0;
          totalValue = 0;
        }
      }
    });

    return {
      totalQuantity: this.roundToDecimal(totalQuantity),
      totalValue: this.roundToDecimal(totalValue),
      averageUnitCost: this.roundToDecimal(averageUnitCost),
    };
  }

  // ===== EXPIRY MANAGEMENT =====

  /**
   * Check for expired or near-expiry items
   */
  checkExpiryStatus(lots, alertDays = 30) {
    const now = new Date();
    const alertDate = new Date(now.getTime() + alertDays * 24 * 60 * 60 * 1000);

    return lots.map(lot => {
      const expiryDate = new Date(lot.expiryDate);
      let status = 'OK';
      let daysToExpiry = Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1000));

      if (expiryDate <= now) {
        status = 'EXPIRED';
      } else if (expiryDate <= alertDate) {
        status = 'NEAR_EXPIRY';
      }

      return {
        ...lot,
        status,
        daysToExpiry,
        isExpired: status === 'EXPIRED',
        isNearExpiry: status === 'NEAR_EXPIRY',
      };
    });
  }

  // ===== DEMAND FORECASTING =====

  /**
   * Simple moving average forecast
   */
  calculateMovingAverageFromMovements(movements, periods = 3) {
    if (movements.length < periods) return 0;

    const recentMovements = movements
      .filter(m => m.type === 'OUT')
      .slice(-periods)
      .map(m => m.quantity);

    const sum = recentMovements.reduce((total, qty) => total + qty, 0);
    return this.roundToDecimal(sum / recentMovements.length);
  }

  /**
   * Exponential smoothing forecast
   */
  calculateExponentialSmoothing(movements, alpha = 0.3) {
    const outMovements = movements.filter(m => m.type === 'OUT');
    if (outMovements.length === 0) return 0;

    let forecast = outMovements[0].quantity;

    for (let i = 1; i < outMovements.length; i++) {
      forecast = alpha * outMovements[i].quantity + (1 - alpha) * forecast;
    }

    return this.roundToDecimal(forecast);
  }

  // ===== MULTI-LOCATION SUPPORT =====

  /**
   * Calculate optimal stock allocation across locations
   */
  calculateOptimalAllocation(totalStock, locations) {
    const totalDemand = locations.reduce((sum, loc) => sum + loc.demandRate, 0);

    if (totalDemand === 0) {
      const equalAllocation = totalStock / locations.length;
      return locations.map(loc => ({
        ...loc,
        allocatedStock: this.roundToDecimal(equalAllocation),
      }));
    }

    return locations.map(location => {
      const demandRatio = location.demandRate / totalDemand;
      const baseAllocation = totalStock * demandRatio;
      const minStock = location.minStock || 0;

      return {
        ...location,
        allocatedStock: this.roundToDecimal(Math.max(baseAllocation, minStock)),
      };
    });
  }

  // ===== UTILITY METHODS =====

  roundToDecimal(value, precision = this.decimalPrecision) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  }

  getZScore(serviceLevel) {
    const zScores = {
      0.5: 0.0,
      0.55: 0.13,
      0.6: 0.25,
      0.65: 0.39,
      0.7: 0.52,
      0.75: 0.67,
      0.8: 0.84,
      0.85: 1.04,
      0.9: 1.28,
      0.95: 1.65,
      0.97: 1.88,
      0.98: 2.05,
      0.99: 2.33,
      0.995: 2.58,
      0.999: 3.09,
    };
    return zScores[serviceLevel] || 1.65; // Default to 95%
  }

  // Mock methods for data retrieval (to be replaced with actual API calls)
  getAverageDailyUsage(productId, days = 30) {
    // This would fetch from backend API
    return 10; // Mock value
  }

  getDemandStandardDeviation(productId, days = 30) {
    // This would calculate from historical data
    return 3; // Mock value
  }

  getAnnualDemand(productId) {
    // This would fetch from backend API
    return 3650; // Mock value (10 per day × 365 days)
  }

  getCOGS(productId, period = 365) {
    // This would fetch from backend API
    return 36500; // Mock value
  }

  getAverageInventoryValue(productId, period = 365) {
    // This would fetch from backend API
    return 5000; // Mock value
  }

  // ===== AUDIT TRAIL =====

  addAuditEntry(entry) {
    const auditEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.auditTrail.push(auditEntry);

    // Keep only last 1000 entries
    if (this.auditTrail.length > 1000) {
      this.auditTrail = this.auditTrail.slice(-1000);
    }

    return auditEntry;
  }

  getAuditTrail(filters = {}) {
    let filtered = [...this.auditTrail];

    if (filters.productId) {
      filtered = filtered.filter(entry => entry.productId === filters.productId);
    }

    if (filters.type) {
      filtered = filtered.filter(entry => entry.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(entry => new Date(entry.timestamp) <= new Date(filters.endDate));
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // ===== BACKGROUND CALCULATIONS =====

  startBackgroundCalculations() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('/workers/stock-calculator.js');
      worker.postMessage({ type: 'START_CALCULATIONS' });
      worker.onmessage = e => {
        this.handleWorkerMessage(e.data);
      };
      this.workers.set('calculator', worker);
    }
  }

  handleWorkerMessage(data) {
    switch (data.type) {
      case 'CALCULATION_COMPLETE':
        this.calculations.set(data.productId, data.results);
        this.notifyListeners('calculationUpdate', data);
        break;
      case 'ERROR':
        console.error('Worker error:', data.error);
        break;
    }
  }

  // ===== EVENT SYSTEM =====

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach(callback => {
      try {
        callback({ type, data });
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  // ===== BATCH OPERATIONS =====

  async batchCalculateReorderPoints(products) {
    const results = new Map();

    for (const product of products) {
      try {
        const reorderPoint = this.calculateReorderPoint(product);
        const safetyStock = this.calculateSafetyStock(product);
        const eoq = this.calculateEOQ(product);

        results.set(product.id, {
          reorderPoint,
          safetyStock,
          eoq,
          calculatedAt: new Date().toISOString(),
        });

        this.addAuditEntry({
          type: 'CALCULATION',
          productId: product.id,
          action: 'REORDER_POINT_CALCULATED',
          data: { reorderPoint, safetyStock, eoq },
        });
      } catch (error) {
        console.error(`Error calculating for product ${product.id}:`, error);
        results.set(product.id, { error: error.message });
      }
    }

    return results;
  }
}

export default StockEngine;
