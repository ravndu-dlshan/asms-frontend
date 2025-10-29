# Customer Appointments Page

This module handles customer vehicle management and appointment booking functionality.

## Components

### 1. **CarDetailsForm.tsx**

- Allows customers to add vehicle details
- Validates input data (brand, model, year, license plate, color)
- Checks for duplicate license plates
- Displays list of registered vehicles
- Features: form validation, error handling, localStorage persistence

### 2. **AppointmentForm.tsx**

- Booking interface for scheduling appointments
- Vehicle selection from registered cars
- Service type selection with pricing
- Date and time slot selection
- Additional notes field
- Estimated cost calculator
- Features: 6 pre-defined service options, time slot management

### 3. **AppointmentList.tsx**

- Displays all customer appointments
- Status filtering (pending, confirmed, in-progress, completed, cancelled)
- Appointment management (cancel functionality)
- Responsive design with mobile support
- Visual status indicators

### 4. **types.ts**

TypeScript interfaces for:

- `CarDetails`: Vehicle information structure
- `Appointment`: Appointment data structure
- `ServiceOption`: Service type definitions

### 5. **page.tsx**

Main container component that:

- Manages state for cars and appointments
- Handles localStorage persistence
- Integrates navbar, footer, and chatbot
- Coordinates between child components

## Features

### Vehicle Management

- Add multiple vehicles
- Required fields: Brand, Model, Year, License Plate, Color
- Optional fields: Mileage, VIN Number
- Duplicate license plate detection
- Persistent storage in browser localStorage

### Appointment Booking

- 6 service types with pricing:
  - Maintenance Service ($150)
  - Repair Service ($300)
  - Diagnostic Check ($80)
  - Tire Service ($100)
  - Brake Service ($200)
  - Battery Service ($120)
- Date selection (tomorrow to 2 months ahead)
- Time slots: 9:00 AM to 5:00 PM
- Estimated cost calculation
- Priority assignment based on service cost

### Appointment Management

- View all appointments with filtering
- Status-based filtering
- Cancel appointments (for pending/confirmed only)
- Visual status indicators with icons
- Detailed appointment information display

## Best Practices Implemented

1. **Component Separation**: Each major feature is in its own component
2. **TypeScript**: Strong typing throughout with interfaces
3. **Responsive Design**: Mobile-friendly layouts
4. **Error Handling**: Form validation with user-friendly error messages
5. **UI/UX**: Consistent with project design (dark theme, orange accents)
6. **State Management**: Centralized state in parent component
7. **Persistence**: localStorage for data persistence across sessions
8. **Accessibility**: Proper labels, semantic HTML
9. **Code Organization**: Separate files for types, components, and pages

## Usage

Navigate to `/customer/Customer_Appoinments` to access the page.

The page flow:

1. Add vehicle(s) using the "My Vehicles" section
2. Book an appointment by selecting a vehicle and service
3. View and manage appointments in the "My Appointments" section

## Data Storage

All data is stored in browser localStorage:

- `customerCars`: Array of car details
- `customerAppointments`: Array of appointments

## Styling

Uses Tailwind CSS with:

- Dark theme (gray-900/gray-800 backgrounds)
- Orange accent color (orange-500/orange-600)
- Consistent with rest of application
- Modern gradient buttons and cards
- Hover effects and transitions
