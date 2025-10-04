// Currency conversion utility
// In a real application, this would use a live exchange rate API

const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  INR: 83.0,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  MXN: 20.0,
  BRL: 5.2,
  RUB: 75.0,
  KRW: 1200.0,
  SGD: 1.35,
  HKD: 7.8,
  NZD: 1.45,
  NOK: 8.5,
  SEK: 8.8,
  DKK: 6.3,
  PLN: 4.0,
  CZK: 22.0,
  HUF: 300.0,
  RON: 4.2,
  BGN: 1.66,
  HRK: 6.4,
  RSD: 100.0,
  UAH: 27.0,
  TRY: 8.5,
  ILS: 3.2,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.30,
  BHD: 0.38,
  OMR: 0.38,
  JOD: 0.71,
  LBP: 1500.0,
  EGP: 15.7,
  ZAR: 15.0,
  NGN: 410.0,
  KES: 110.0,
  GHS: 6.0,
  UGX: 3500.0,
  TZS: 2300.0,
  ETB: 45.0,
  MAD: 9.0,
  TND: 2.8,
  DZD: 140.0,
  LYD: 4.5,
  SDG: 55.0,
  AOA: 650.0,
  MZN: 64.0,
  BWP: 13.5,
  SZL: 15.0,
  LSL: 15.0,
  NAD: 15.0,
  ZMW: 18.0,
  BIF: 2000.0,
  RWF: 1000.0,
  CDF: 2000.0,
  XAF: 550.0,
  XOF: 550.0,
  KMF: 450.0,
  DJF: 180.0,
  ERN: 15.0,
  SLL: 10000.0,
  GMD: 50.0,
  GNF: 9000.0,
  LRD: 200.0,
  MRO: 36.0,
  MUR: 40.0,
  SCR: 13.5,
  SOS: 580.0,
  STN: 22.0,
  SZL: 15.0,
  TZS: 2300.0,
  UGX: 3500.0,
  ZMW: 18.0,
  ZWL: 100.0
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];

  if (!fromRate || !toRate) {
    console.warn(`Exchange rate not found for ${fromCurrency} or ${toCurrency}`);
    return amount;
  }

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;

  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Exchange rate
 */
export const getExchangeRate = (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];

  if (!fromRate || !toRate) {
    return 1;
  }

  return toRate / fromRate;
};

/**
 * Format currency amount with symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    MXN: '$',
    BRL: 'R$',
    RUB: '₽',
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
    NOK: 'kr',
    SEK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    RSD: 'дин',
    UAH: '₴',
    TRY: '₺',
    ILS: '₪',
    AED: 'د.إ',
    SAR: 'ر.س',
    QAR: 'ر.ق',
    KWD: 'د.ك',
    BHD: 'د.ب',
    OMR: 'ر.ع.',
    JOD: 'د.ا',
    LBP: 'ل.ل',
    EGP: '£',
    ZAR: 'R',
    NGN: '₦',
    KES: 'KSh',
    GHS: '₵',
    UGX: 'USh',
    TZS: 'TSh',
    ETB: 'Br',
    MAD: 'د.م.',
    TND: 'د.ت',
    DZD: 'د.ج',
    LYD: 'ل.د',
    SDG: 'ج.س.',
    AOA: 'Kz',
    MZN: 'MT',
    BWP: 'P',
    SZL: 'L',
    LSL: 'L',
    NAD: 'N$',
    ZMW: 'ZK',
    BIF: 'FBu',
    RWF: 'RF',
    CDF: 'FC',
    XAF: 'FCFA',
    XOF: 'CFA',
    KMF: 'CF',
    DJF: 'Fdj',
    ERN: 'Nfk',
    SLL: 'Le',
    GMD: 'D',
    GNF: 'FG',
    LRD: 'L$',
    MRO: 'UM',
    MUR: '₨',
    SCR: '₨',
    SOS: 'S',
    STN: 'Db',
    ZWL: 'Z$'
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Get list of supported currencies
 * @returns {Array} Array of currency objects
 */
export const getSupportedCurrencies = () => {
  return Object.keys(EXCHANGE_RATES).map(code => ({
    code,
    name: getCurrencyName(code),
    symbol: getCurrencySymbol(code)
  }));
};

/**
 * Get currency name
 * @param {string} code - Currency code
 * @returns {string} Currency name
 */
const getCurrencyName = (code) => {
  const names = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound Sterling',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    MXN: 'Mexican Peso',
    BRL: 'Brazilian Real',
    RUB: 'Russian Ruble',
    KRW: 'South Korean Won',
    SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar',
    NZD: 'New Zealand Dollar',
    NOK: 'Norwegian Krone',
    SEK: 'Swedish Krona',
    DKK: 'Danish Krone',
    PLN: 'Polish Złoty',
    CZK: 'Czech Koruna',
    HUF: 'Hungarian Forint',
    RON: 'Romanian Leu',
    BGN: 'Bulgarian Lev',
    HRK: 'Croatian Kuna',
    RSD: 'Serbian Dinar',
    UAH: 'Ukrainian Hryvnia',
    TRY: 'Turkish Lira',
    ILS: 'Israeli Shekel',
    AED: 'UAE Dirham',
    SAR: 'Saudi Riyal',
    QAR: 'Qatari Riyal',
    KWD: 'Kuwaiti Dinar',
    BHD: 'Bahraini Dinar',
    OMR: 'Omani Rial',
    JOD: 'Jordanian Dinar',
    LBP: 'Lebanese Pound',
    EGP: 'Egyptian Pound',
    ZAR: 'South African Rand',
    NGN: 'Nigerian Naira',
    KES: 'Kenyan Shilling',
    GHS: 'Ghanaian Cedi',
    UGX: 'Ugandan Shilling',
    TZS: 'Tanzanian Shilling',
    ETB: 'Ethiopian Birr',
    MAD: 'Moroccan Dirham',
    TND: 'Tunisian Dinar',
    DZD: 'Algerian Dinar',
    LYD: 'Libyan Dinar',
    SDG: 'Sudanese Pound',
    AOA: 'Angolan Kwanza',
    MZN: 'Mozambican Metical',
    BWP: 'Botswana Pula',
    SZL: 'Swazi Lilangeni',
    LSL: 'Lesotho Loti',
    NAD: 'Namibian Dollar',
    ZMW: 'Zambian Kwacha',
    BIF: 'Burundian Franc',
    RWF: 'Rwandan Franc',
    CDF: 'Congolese Franc',
    XAF: 'Central African CFA Franc',
    XOF: 'West African CFA Franc',
    KMF: 'Comorian Franc',
    DJF: 'Djiboutian Franc',
    ERN: 'Eritrean Nakfa',
    SLL: 'Sierra Leonean Leone',
    GMD: 'Gambian Dalasi',
    GNF: 'Guinean Franc',
    LRD: 'Liberian Dollar',
    MRO: 'Mauritanian Ouguiya',
    MUR: 'Mauritian Rupee',
    SCR: 'Seychellois Rupee',
    SOS: 'Somali Shilling',
    STN: 'São Tomé and Príncipe Dobra',
    ZWL: 'Zimbabwean Dollar'
  };

  return names[code] || code;
};

/**
 * Get currency symbol
 * @param {string} code - Currency code
 * @returns {string} Currency symbol
 */
const getCurrencySymbol = (code) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    MXN: '$',
    BRL: 'R$',
    RUB: '₽',
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
    NOK: 'kr',
    SEK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    RSD: 'дин',
    UAH: '₴',
    TRY: '₺',
    ILS: '₪',
    AED: 'د.إ',
    SAR: 'ر.س',
    QAR: 'ر.ق',
    KWD: 'د.ك',
    BHD: 'د.ب',
    OMR: 'ر.ع.',
    JOD: 'د.ا',
    LBP: 'ل.ل',
    EGP: '£',
    ZAR: 'R',
    NGN: '₦',
    KES: 'KSh',
    GHS: '₵',
    UGX: 'USh',
    TZS: 'TSh',
    ETB: 'Br',
    MAD: 'د.م.',
    TND: 'د.ت',
    DZD: 'د.ج',
    LYD: 'ل.د',
    SDG: 'ج.س.',
    AOA: 'Kz',
    MZN: 'MT',
    BWP: 'P',
    SZL: 'L',
    LSL: 'L',
    NAD: 'N$',
    ZMW: 'ZK',
    BIF: 'FBu',
    RWF: 'RF',
    CDF: 'FC',
    XAF: 'FCFA',
    XOF: 'CFA',
    KMF: 'CF',
    DJF: 'Fdj',
    ERN: 'Nfk',
    SLL: 'Le',
    GMD: 'D',
    GNF: 'FG',
    LRD: 'L$',
    MRO: 'UM',
    MUR: '₨',
    SCR: '₨',
    SOS: 'S',
    STN: 'Db',
    ZWL: 'Z$'
  };

  return symbols[code] || code;
};

/**
 * Simulate real-time exchange rate updates
 * In a real application, this would fetch from an API
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {Promise<number>} Exchange rate
 */
export const getLiveExchangeRate = async (fromCurrency, toCurrency) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Add some random variation to simulate live rates
  const baseRate = getExchangeRate(fromCurrency, toCurrency);
  const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
  return baseRate * (1 + variation);
};
