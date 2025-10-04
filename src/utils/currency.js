// Currency conversion utility using real-time exchange rates
import axios from 'axios';

// Cache for exchange rates to avoid excessive API calls
const rateCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch exchange rates from the API
 * @param {string} baseCurrency - Base currency code
 * @returns {Promise<Object>} Exchange rates object
 */
const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    throw new Error('Unable to fetch current exchange rates');
  }
};

/**
 * Get cached exchange rates or fetch new ones
 * @param {string} baseCurrency - Base currency code
 * @returns {Promise<Object>} Exchange rates object
 */
const getExchangeRates = async (baseCurrency = 'USD') => {
  const cacheKey = baseCurrency;
  const cached = rateCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rates;
  }
  
  const rates = await fetchExchangeRates(baseCurrency);
  rateCache.set(cacheKey, {
    rates,
    timestamp: Date.now()
  });
  
  return rates;
};

/**
 * Convert amount from one currency to another using real-time rates
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<number>} Converted amount
 */
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    const rates = await getExchangeRates(fromCurrency);
    
    if (!rates.rates[toCurrency]) {
      console.warn(`Exchange rate not found for ${toCurrency}`);
      return amount;
    }

    const convertedAmount = amount * rates.rates[toCurrency];
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Currency conversion failed:', error);
    return amount; // Return original amount if conversion fails
  }
};

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<number>} Exchange rate
 */
export const getExchangeRate = async (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  try {
    const rates = await getExchangeRates(fromCurrency);
    
    if (!rates.rates[toCurrency]) {
      console.warn(`Exchange rate not found for ${toCurrency}`);
      return 1;
    }

    return rates.rates[toCurrency];
  } catch (error) {
    console.error('Failed to get exchange rate:', error);
    return 1;
  }
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
 * @returns {Promise<Array>} Array of currency objects
 */
export const getSupportedCurrencies = async () => {
  try {
    const rates = await getExchangeRates('USD');
    return Object.keys(rates.rates).map(code => ({
      code,
      name: getCurrencyName(code),
      symbol: getCurrencySymbol(code)
    }));
  } catch (error) {
    console.error('Failed to get supported currencies:', error);
    // Return a basic list if API fails
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
    ];
  }
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
 * Get live exchange rate with real-time data
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {Promise<number>} Exchange rate
 */
export const getLiveExchangeRate = async (fromCurrency, toCurrency) => {
  return await getExchangeRate(fromCurrency, toCurrency);
};

/**
 * Get countries and their currencies
 * @returns {Promise<Array>} Array of country objects with currency info
 */
export const getCountriesWithCurrencies = async () => {
  const countries = [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'DE', name: 'Germany', currency: 'EUR' },
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'IT', name: 'Italy', currency: 'EUR' },
    { code: 'ES', name: 'Spain', currency: 'EUR' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR' },
    { code: 'BE', name: 'Belgium', currency: 'EUR' },
    { code: 'AT', name: 'Austria', currency: 'EUR' },
    { code: 'IE', name: 'Ireland', currency: 'EUR' },
    { code: 'PT', name: 'Portugal', currency: 'EUR' },
    { code: 'FI', name: 'Finland', currency: 'EUR' },
    { code: 'GR', name: 'Greece', currency: 'EUR' },
    { code: 'LU', name: 'Luxembourg', currency: 'EUR' },
    { code: 'MT', name: 'Malta', currency: 'EUR' },
    { code: 'CY', name: 'Cyprus', currency: 'EUR' },
    { code: 'SI', name: 'Slovenia', currency: 'EUR' },
    { code: 'SK', name: 'Slovakia', currency: 'EUR' },
    { code: 'EE', name: 'Estonia', currency: 'EUR' },
    { code: 'LV', name: 'Latvia', currency: 'EUR' },
    { code: 'LT', name: 'Lithuania', currency: 'EUR' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'AU', name: 'Australia', currency: 'AUD' },
    { code: 'CH', name: 'Switzerland', currency: 'CHF' },
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'MX', name: 'Mexico', currency: 'MXN' },
    { code: 'BR', name: 'Brazil', currency: 'BRL' },
    { code: 'RU', name: 'Russia', currency: 'RUB' },
    { code: 'KR', name: 'South Korea', currency: 'KRW' },
    { code: 'SG', name: 'Singapore', currency: 'SGD' },
    { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
    { code: 'NO', name: 'Norway', currency: 'NOK' },
    { code: 'SE', name: 'Sweden', currency: 'SEK' },
    { code: 'DK', name: 'Denmark', currency: 'DKK' },
    { code: 'PL', name: 'Poland', currency: 'PLN' },
    { code: 'CZ', name: 'Czech Republic', currency: 'CZK' },
    { code: 'HU', name: 'Hungary', currency: 'HUF' },
    { code: 'RO', name: 'Romania', currency: 'RON' },
    { code: 'BG', name: 'Bulgaria', currency: 'BGN' },
    { code: 'HR', name: 'Croatia', currency: 'HRK' },
    { code: 'RS', name: 'Serbia', currency: 'RSD' },
    { code: 'UA', name: 'Ukraine', currency: 'UAH' },
    { code: 'TR', name: 'Turkey', currency: 'TRY' },
    { code: 'IL', name: 'Israel', currency: 'ILS' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
    { code: 'QA', name: 'Qatar', currency: 'QAR' },
    { code: 'KW', name: 'Kuwait', currency: 'KWD' },
    { code: 'BH', name: 'Bahrain', currency: 'BHD' },
    { code: 'OM', name: 'Oman', currency: 'OMR' },
    { code: 'JO', name: 'Jordan', currency: 'JOD' },
    { code: 'LB', name: 'Lebanon', currency: 'LBP' },
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'UG', name: 'Uganda', currency: 'UGX' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
    { code: 'MA', name: 'Morocco', currency: 'MAD' },
    { code: 'TN', name: 'Tunisia', currency: 'TND' },
    { code: 'DZ', name: 'Algeria', currency: 'DZD' },
    { code: 'LY', name: 'Libya', currency: 'LYD' },
    { code: 'SD', name: 'Sudan', currency: 'SDG' },
    { code: 'AO', name: 'Angola', currency: 'AOA' },
    { code: 'MZ', name: 'Mozambique', currency: 'MZN' },
    { code: 'BW', name: 'Botswana', currency: 'BWP' },
    { code: 'SZ', name: 'Eswatini', currency: 'SZL' },
    { code: 'LS', name: 'Lesotho', currency: 'LSL' },
    { code: 'NA', name: 'Namibia', currency: 'NAD' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW' },
    { code: 'BI', name: 'Burundi', currency: 'BIF' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF' },
    { code: 'CD', name: 'Democratic Republic of the Congo', currency: 'CDF' },
    { code: 'CM', name: 'Cameroon', currency: 'XAF' },
    { code: 'SN', name: 'Senegal', currency: 'XOF' },
    { code: 'KM', name: 'Comoros', currency: 'KMF' },
    { code: 'DJ', name: 'Djibouti', currency: 'DJF' },
    { code: 'ER', name: 'Eritrea', currency: 'ERN' },
    { code: 'SL', name: 'Sierra Leone', currency: 'SLL' },
    { code: 'GM', name: 'Gambia', currency: 'GMD' },
    { code: 'GN', name: 'Guinea', currency: 'GNF' },
    { code: 'LR', name: 'Liberia', currency: 'LRD' },
    { code: 'MR', name: 'Mauritania', currency: 'MRO' },
    { code: 'MU', name: 'Mauritius', currency: 'MUR' },
    { code: 'SC', name: 'Seychelles', currency: 'SCR' },
    { code: 'SO', name: 'Somalia', currency: 'SOS' },
    { code: 'ST', name: 'São Tomé and Príncipe', currency: 'STN' },
    { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL' }
  ];

  return countries;
};