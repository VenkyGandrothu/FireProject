# 🚀 Frontend API Update Guide

## ✅ What's Already Done:
- ✅ Created centralized API configuration (`src/config/api.js`)
- ✅ Updated `CustomerBuildingForm.jsx`
- ✅ Updated `VirtualSensorRegistrationForm.jsx` (partially)

## 🔄 Forms That Need Updating:

### 1. QRCodeRegistrationForm.jsx
**Replace:**
```javascript
const res = await fetch("http://localhost:5000/api/buildings");
const data = await res.json();
```
**With:**
```javascript
import { API_ENDPOINTS, apiCall } from "../../config/api";
const data = await apiCall(API_ENDPOINTS.BUILDINGS);
```

### 2. PhysicalSensorRegistrationForm.jsx
**Replace:**
```javascript
const res = await fetch("http://localhost:5000/api/buildings");
const data = await res.json();
```
**With:**
```javascript
import { API_ENDPOINTS, apiCall } from "../../config/api";
const data = await apiCall(API_ENDPOINTS.BUILDINGS);
```

### 3. FloorRegistrationForm.jsx
**Replace:**
```javascript
const res = await fetch("http://localhost:5000/api/buildings");
const data = await res.json();
```
**With:**
```javascript
import { API_ENDPOINTS, apiCall } from "../../config/api";
const data = await apiCall(API_ENDPOINTS.BUILDINGS);
```

### 4. LinkQrToPathsForm.jsx
**Replace all fetch calls with apiCall equivalents**

### 5. ExitPathRegistrationForm.jsx
**Replace all fetch calls with apiCall equivalents**

## 🎯 Quick Update Pattern:

### Step 1: Add Import
```javascript
import { API_ENDPOINTS, apiCall } from "../../config/api";
```

### Step 2: Replace Fetch Calls
**Old:**
```javascript
const res = await fetch("http://localhost:5000/api/endpoint");
const data = await res.json();
```

**New:**
```javascript
const data = await apiCall(API_ENDPOINTS.ENDPOINT_NAME);
```

### Step 3: Replace POST Requests
**Old:**
```javascript
const res = await fetch("http://localhost:5000/api/endpoint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const result = await res.json();
```

**New:**
```javascript
const result = await apiCall(API_ENDPOINTS.ENDPOINT_NAME, {
  method: "POST",
  body: JSON.stringify(data),
});
```

## 🔧 API Endpoints Available:

- `API_ENDPOINTS.CUSTOMERS` - Get all customers
- `API_ENDPOINTS.BUILDINGS` - Get all buildings
- `API_ENDPOINTS.FLOORS` - Get all floors
- `API_ENDPOINTS.FLOORS_BY_BUILDING(buildingId)` - Get floors by building
- `API_ENDPOINTS.PHYSICAL_SENSORS` - Get all physical sensors
- `API_ENDPOINTS.PHYSICAL_SENSORS_BY_FLOOR(floorId)` - Get sensors by floor
- `API_ENDPOINTS.VIRTUAL_SENSORS` - Get all virtual sensors
- `API_ENDPOINTS.VIRTUAL_SENSORS_BY_FLOOR(floorId)` - Get virtual sensors by floor
- `API_ENDPOINTS.QR_CODES` - Get all QR codes
- `API_ENDPOINTS.QR_CODES_BY_FLOOR(floorId)` - Get QR codes by floor
- `API_ENDPOINTS.EXIT_PATHS` - Get all exit paths
- `API_ENDPOINTS.EXIT_PATHS_BY_FLOOR(floorId)` - Get exit paths by floor
- `API_ENDPOINTS.LINK_QR_TO_PATHS` - Link QR codes to paths
- `API_ENDPOINTS.PATHS_FOR_QR(qrCodeId)` - Get paths for QR code

## 🚀 Benefits:
- ✅ Automatic environment detection (localhost vs production)
- ✅ Centralized configuration
- ✅ Error handling built-in
- ✅ Consistent API calls across all forms
- ✅ Easy to maintain and update

## 🎯 Next Steps:
1. Update remaining forms using the pattern above
2. Test all forms with production backend
3. Deploy frontend to production
