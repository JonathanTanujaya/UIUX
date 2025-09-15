import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Calculate,
  MonetizationOn,
  Assessment,
} from '@mui/icons-material';

const BusinessCalculator = ({
  type = 'pricing', // pricing, tax, profit, inventory, currency
  title,
  onCalculate,
  showHistory = true,
}) => {
  const [values, setValues] = useState({});
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const calculatorConfigs = {
    pricing: {
      title: 'Price Calculator',
      icon: <MonetizationOn />,
      fields: [
        { name: 'cost', label: 'Cost Price', type: 'number', required: true },
        { name: 'margin', label: 'Profit Margin (%)', type: 'number', required: true },
        { name: 'tax', label: 'Tax Rate (%)', type: 'number', defaultValue: 10 },
        { name: 'discount', label: 'Discount (%)', type: 'number', defaultValue: 0 },
      ],
      calculate: (values) => {
        const cost = parseFloat(values.cost) || 0;
        const margin = parseFloat(values.margin) || 0;
        const tax = parseFloat(values.tax) || 0;
        const discount = parseFloat(values.discount) || 0;

        const basePrice = cost * (1 + margin / 100);
        const priceWithTax = basePrice * (1 + tax / 100);
        const finalPrice = priceWithTax * (1 - discount / 100);
        const profit = finalPrice - cost - (finalPrice * tax / 100);
        const profitMargin = cost > 0 ? (profit / cost) * 100 : 0;

        return {
          basePrice: basePrice.toFixed(2),
          priceWithTax: priceWithTax.toFixed(2),
          finalPrice: finalPrice.toFixed(2),
          profit: profit.toFixed(2),
          profitMargin: profitMargin.toFixed(2),
          breakdown: [
            { label: 'Cost Price', value: cost.toFixed(2) },
            { label: 'Base Price (with margin)', value: basePrice.toFixed(2) },
            { label: 'Price with Tax', value: priceWithTax.toFixed(2) },
            { label: 'Final Price (after discount)', value: finalPrice.toFixed(2) },
            { label: 'Net Profit', value: profit.toFixed(2) },
            { label: 'Profit Margin', value: `${profitMargin.toFixed(2)}%` },
          ]
        };
      }
    },
    
    tax: {
      title: 'Tax Calculator',
      icon: <AccountBalance />,
      fields: [
        { name: 'amount', label: 'Base Amount', type: 'number', required: true },
        { name: 'taxRate', label: 'Tax Rate (%)', type: 'number', required: true },
        { name: 'includesTax', label: 'Amount includes tax', type: 'checkbox' },
      ],
      calculate: (values) => {
        const amount = parseFloat(values.amount) || 0;
        const taxRate = parseFloat(values.taxRate) || 0;
        const includesTax = values.includesTax;

        let baseAmount, taxAmount, totalAmount;

        if (includesTax) {
          totalAmount = amount;
          baseAmount = amount / (1 + taxRate / 100);
          taxAmount = totalAmount - baseAmount;
        } else {
          baseAmount = amount;
          taxAmount = amount * (taxRate / 100);
          totalAmount = baseAmount + taxAmount;
        }

        return {
          baseAmount: baseAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          effectiveRate: ((taxAmount / baseAmount) * 100).toFixed(2),
        };
      }
    },

    profit: {
      title: 'Profit Analysis',
      icon: <TrendingUp />,
      fields: [
        { name: 'revenue', label: 'Total Revenue', type: 'number', required: true },
        { name: 'cogs', label: 'Cost of Goods Sold', type: 'number', required: true },
        { name: 'expenses', label: 'Operating Expenses', type: 'number', required: true },
        { name: 'units', label: 'Units Sold', type: 'number', defaultValue: 1 },
      ],
      calculate: (values) => {
        const revenue = parseFloat(values.revenue) || 0;
        const cogs = parseFloat(values.cogs) || 0;
        const expenses = parseFloat(values.expenses) || 0;
        const units = parseFloat(values.units) || 1;

        const grossProfit = revenue - cogs;
        const netProfit = grossProfit - expenses;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
        const revenuePerUnit = units > 0 ? revenue / units : 0;
        const profitPerUnit = units > 0 ? netProfit / units : 0;

        return {
          grossProfit: grossProfit.toFixed(2),
          netProfit: netProfit.toFixed(2),
          grossMargin: grossMargin.toFixed(2),
          netMargin: netMargin.toFixed(2),
          revenuePerUnit: revenuePerUnit.toFixed(2),
          profitPerUnit: profitPerUnit.toFixed(2),
          breakEvenUnits: profitPerUnit > 0 ? Math.ceil(expenses / profitPerUnit) : 0,
        };
      }
    },

    inventory: {
      title: 'Inventory Valuation',
      icon: <Assessment />,
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'unitCost', label: 'Unit Cost', type: 'number', required: true },
        { name: 'method', label: 'Valuation Method', type: 'select', 
          options: [
            { value: 'fifo', label: 'FIFO (First In, First Out)' },
            { value: 'lifo', label: 'LIFO (Last In, First Out)' },
            { value: 'average', label: 'Weighted Average' },
          ]
        },
        { name: 'marketPrice', label: 'Current Market Price', type: 'number' },
      ],
      calculate: (values) => {
        const quantity = parseFloat(values.quantity) || 0;
        const unitCost = parseFloat(values.unitCost) || 0;
        const marketPrice = parseFloat(values.marketPrice) || unitCost;
        
        const totalCost = quantity * unitCost;
        const marketValue = quantity * marketPrice;
        const unrealizedGain = marketValue - totalCost;
        const costPercentage = totalCost > 0 ? (marketValue / totalCost) * 100 - 100 : 0;

        return {
          totalCost: totalCost.toFixed(2),
          marketValue: marketValue.toFixed(2),
          unrealizedGain: unrealizedGain.toFixed(2),
          costPercentage: costPercentage.toFixed(2),
          lowerOfCostOrMarket: Math.min(totalCost, marketValue).toFixed(2),
        };
      }
    },
  };

  const config = calculatorConfigs[type] || calculatorConfigs.pricing;

  const handleInputChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const results = config.calculate(values);
    setResults(results);
    
    if (showHistory) {
      const calculation = {
        timestamp: new Date(),
        type,
        inputs: { ...values },
        results,
      };
      setHistory(prev => [calculation, ...prev.slice(0, 4)]); // Keep last 5
    }
    
    onCalculate?.(results, values);
  }, [config, values, type, showHistory, onCalculate]);

  const isFormValid = useMemo(() => {
    return config.fields
      .filter(field => field.required)
      .every(field => values[field.name] && values[field.name] !== '');
  }, [config.fields, values]);

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={values[field.name] || field.defaultValue || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              label={field.label}
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(values[field.name])}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
      
      default:
        return (
          <TextField
            fullWidth
            label={field.label}
            type={field.type}
            value={values[field.name] || field.defaultValue || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            inputProps={{
              step: field.type === 'number' ? 0.01 : undefined,
              min: field.type === 'number' ? 0 : undefined,
            }}
          />
        );
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          avatar={config.icon}
          title={title || config.title}
          action={
            <Chip 
              label={type.toUpperCase()} 
              color="primary" 
              variant="outlined" 
            />
          }
        />
        
        <CardContent>
          <Grid container spacing={3}>
            {/* Input Fields */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Input Values
              </Typography>
              
              <Grid container spacing={2}>
                {config.fields.map((field) => (
                  <Grid item xs={12} key={field.name}>
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>

              <Box mt={3}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={!isFormValid}
                  startIcon={<Calculate />}
                  fullWidth
                >
                  Calculate
                </Button>
              </Box>
            </Grid>

            {/* Results */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              
              {results ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      {results.breakdown?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.label}</TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {row.value}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )) || Object.entries(results).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell sx={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {value}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Enter values and click Calculate to see results
                </Alert>
              )}
            </Grid>
          </Grid>

          {/* History */}
          {showHistory && history.length > 0 && (
            <Box mt={4}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Recent Calculations
              </Typography>
              
              <Grid container spacing={2}>
                {history.map((calc, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {calc.timestamp.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {JSON.stringify(calc.inputs, null, 1)}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessCalculator;
