// API Configuration
// Centralized configuration for all API calls

// Production API URL
const API_BASE_URL = 'https://fireproject-backend.onrender.com';

// Development API URL (for local development)
const DEV_API_BASE_URL = 'http://localhost:5000';

// Determine which URL to use based on environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_URL = isDevelopment ? DEV_API_BASE_URL : API_BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Customer endpoints
  CUSTOMERS: `${API_URL}/api/customers`,
  CUSTOMER_REGISTER: `${API_URL}/api/customers/register`,
  
  // Building endpoints
  BUILDINGS: `${API_URL}/api/buildings`,
  BUILDING_REGISTER: `${API_URL}/api/buildings/register`,
  
  // Floor endpoints
  FLOORS: `${API_URL}/api/floors`,
  FLOOR_REGISTER: `${API_URL}/api/floors/register`,
  FLOORS_BY_BUILDING: (buildingId) => `${API_URL}/api/floors/building/${buildingId}`,
  
  // Customer-Building relationship endpoints
  CUSTOMER_BUILDINGS: `${API_URL}/api/customer-building`,
  CUSTOMER_BUILDING_REGISTER: `${API_URL}/api/customer-building/register`,
  
  // Physical Sensor endpoints
  PHYSICAL_SENSORS: `${API_URL}/api/sensors`,
  PHYSICAL_SENSOR_REGISTER: `${API_URL}/api/sensors/register`,
  PHYSICAL_SENSORS_BULK: `${API_URL}/api/sensors/bulk`,
  PHYSICAL_SENSORS_BY_FLOOR: (floorId) => `${API_URL}/api/sensors/floor/${floorId}`,
  
  // Virtual Sensor endpoints
  VIRTUAL_SENSORS: `${API_URL}/api/virtual-sensors`,
  VIRTUAL_SENSOR_REGISTER: `${API_URL}/api/virtual-sensors/register`,
  VIRTUAL_SENSORS_BULK: `${API_URL}/api/virtual-sensors/bulk`,
  VIRTUAL_SENSORS_BY_FLOOR: (floorId) => `${API_URL}/api/virtual-sensors/floor/${floorId}`,
  
  // QR Code endpoints
  QR_CODES: `${API_URL}/api/qr-codes`,
  QR_CODE_REGISTER: `${API_URL}/api/qr-codes/register`,
  QR_CODES_BY_FLOOR: (floorId) => `${API_URL}/api/qr-codes/floor/${floorId}`,
  
  // Exit Path endpoints
  EXIT_PATHS: `${API_URL}/api/exit-paths`,
  EXIT_PATH_REGISTER: `${API_URL}/api/exit-paths/register`,
  EXIT_PATHS_BY_FLOOR: (floorId) => `${API_URL}/api/exit-paths/floor/${floorId}`,
  
  // Linked QR Path endpoints
  LINK_QR_TO_PATHS: `${API_URL}/api/linked-qr-path/link`,
  PATHS_FOR_QR: (qrCodeId) => `${API_URL}/api/linked-qr-path/qr/${qrCodeId}`,
};

// Helper function to make API calls
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_ENDPOINTS;
