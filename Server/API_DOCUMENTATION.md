# Agriculter ON SmartWay - API Documentation

## Overview

This document provides complete documentation for the Agriculter ON SmartWay server API. All endpoints are prefixed with `/api/v1`.

**Base URL:** `http://localhost:PORT/api/v1`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Auth Endpoints](#auth-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Firm Management](#firm-management)
5. [Sensor Management](#sensor-management)
6. [Crop Management](#crop-management)
7. [Telemetry](#telemetry)
8. [Blog Management](#blog-management)
9. [Response Format](#response-format)
10. [Error Handling](#error-handling)

---

## Authentication

### Token-Based Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require an `Authorization` header with a Bearer token.

**Header Format:**

```
Authorization: Bearer <token>
```

### Role-Based Access Control

The API implements role-based access control with the following roles:

-   `farmer` - Farm users
-   `admin` - Administrator users

---

## Auth Endpoints

### 1. Sign Up

**POST** `/auth/signup`

Creates a new user account.

**Headers:**

```
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```json
{
    "email": "user@example.com",
    "password": "securePassword123",
    "phone": "+1234567890",
    "name": "John Doe",
    "image": "<file>" // Optional - user profile image
}
```

**Response:** `201 Created`

```json
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "_id": "user_id",
        "email": "user@example.com",
        "phone": "+1234567890",
        "name": "John Doe",
        "token": "jwt_token"
    }
}
```

---

### 2. Sign In

**POST** `/auth/signin`

Authenticates a user and returns a JWT token.

**Request Body (JSON):**

```json
{
    "identifier": "user@example.com or +1234567890",
    "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "User signed in successfully",
    "data": {
        "_id": "user_id",
        "email": "user@example.com",
        "phone": "+1234567890",
        "name": "John Doe",
        "token": "jwt_token"
    }
}
```

---

### 3. Get Current User

**GET** `/auth/me`

Retrieves the authenticated user's profile information.

**Authentication:** Required ✓

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "_id": "user_id",
        "email": "user@example.com",
        "phone": "+1234567890",
        "name": "John Doe",
        "image": "image_url"
    }
}
```

---

## User Endpoints

### 1. Get All Users

**GET** `/users`

Retrieves a list of all users.

**Response:** `200 OK`

```json
{
    "users": [
        {
            "_id": "user_id",
            "email": "user@example.com",
            "phone": "+1234567890",
            "name": "John Doe"
        }
    ]
}
```

---

### 2. Get User by ID

**GET** `/users/:id`

Retrieves a specific user's information.

**URL Parameters:**

-   `id` - User ID

**Response:** `200 OK`

```json
{
    "_id": "user_id",
    "email": "user@example.com",
    "phone": "+1234567890",
    "name": "John Doe",
    "image": "image_url"
}
```

---

### 3. Update User Profile

**PUT** `/users/id`

Updates the authenticated user's profile information.

**Authentication:** Required (farmer) ✓

**Headers:**

```
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```json
{
    "name": "John Smith",
    "phone": "+9876543210",
    "email": "newemail@example.com",
    "image": "<file>" // Optional
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "_id": "user_id",
        "email": "newemail@example.com",
        "phone": "+9876543210",
        "name": "John Smith"
    }
}
```

---

### 4. Delete User

**DELETE** `/users/:id`

Deletes a user account.

**Authentication:** Required (farmer or admin) ✓

**URL Parameters:**

-   `id` - User ID to delete

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

---

## Firm Management

### 1. Create Firm

**POST** `/firms`

Creates a new farm/firm.

**Authentication:** Required (farmer) ✓

**Request Body (JSON):**

```json
{
    "name": "Green Valley Farm",
    "location": "123 Farm Road, Springfield",
    "area": 150,
    "areaUnit": "hectares",
    "crops": ["wheat", "corn"],
    "description": "A modern agricultural farm"
}
```

**Response:** `201 Created`

```json
{
    "success": true,
    "message": "Firm created successfully",
    "data": {
        "_id": "firm_id",
        "name": "Green Valley Farm",
        "location": "123 Farm Road, Springfield",
        "area": 150,
        "areaUnit": "hectares",
        "ownerId": "user_id"
    }
}
```

---

### 2. Get All Firms

**GET** `/firms`

Retrieves all firms for the authenticated user.

**Authentication:** Required ✓

**Query Parameters:**

-   `page` - Page number (optional)
-   `limit` - Items per page (optional)

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        {
            "_id": "firm_id",
            "name": "Green Valley Farm",
            "location": "123 Farm Road, Springfield",
            "area": 150
        }
    ]
}
```

---

### 3. Get Firm by ID

**GET** `/firms/:id`

Retrieves details of a specific firm.

**Authentication:** Required ✓

**URL Parameters:**

-   `id` - Firm ID

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "_id": "firm_id",
        "name": "Green Valley Farm",
        "location": "123 Farm Road, Springfield",
        "area": 150,
        "crops": ["wheat", "corn"],
        "ownerId": "user_id"
    }
}
```

---

### 4. Update Firm

**PATCH** `/firms/:id`

Updates firm information.

**Authentication:** Required ✓

**URL Parameters:**

-   `id` - Firm ID

**Request Body (JSON):**

```json
{
    "name": "Green Valley Farm Updated",
    "location": "456 New Farm Road",
    "area": 200,
    "crops": ["wheat", "corn", "rice"]
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Firm updated successfully",
    "data": {
        /* updated firm data */
    }
}
```

---

### 5. Delete Firm

**DELETE** `/firms/:id`

Deletes a firm.

**Authentication:** Required ✓

**URL Parameters:**

-   `id` - Firm ID

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Firm deleted successfully"
}
```

---

## Sensor Management

### 1. Add Sensor

**POST** `/sensors`

Registers a new sensor for the authenticated user.

**Authentication:** Required (farmer) ✓

**Request Body (JSON):**

```json
{
    "sensorId": "SENSOR001",
    "sensorName": "Moisture Sensor 1",
    "sensorType": "moisture",
    "location": "Field A",
    "firmId": "firm_id"
}
```

**Response:** `201 Created`

```json
{
    "success": true,
    "message": "Sensor created successfully",
    "data": {
        "_id": "sensor_db_id",
        "sensorId": "SENSOR001",
        "sensorName": "Moisture Sensor 1",
        "sensorType": "moisture",
        "ownerId": "user_id"
    }
}
```

---

### 2. Get User's Sensors

**GET** `/sensors`

Retrieves all sensors for the authenticated user.

**Authentication:** Required ✓

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        {
            "_id": "sensor_db_id",
            "sensorId": "SENSOR001",
            "sensorName": "Moisture Sensor 1",
            "sensorType": "moisture",
            "ownerId": "user_id"
        }
    ]
}
```

---

### 3. Get Sensor by ID

**GET** `/sensors/id/:sensorId`

Retrieves a specific sensor's details.

**Authentication:** Required ✓

**URL Parameters:**

-   `sensorId` - Sensor ID

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "_id": "sensor_db_id",
        "sensorId": "SENSOR001",
        "sensorName": "Moisture Sensor 1",
        "sensorType": "moisture",
        "location": "Field A",
        "ownerId": "user_id"
    }
}
```

---

### 4. Get Sensors by Owner

**GET** `/sensors/owner/:ownerId`

Retrieves all sensors for a specific owner (admin or same user).

**Authentication:** Required ✓

**URL Parameters:**

-   `ownerId` - User ID of sensor owner

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        /* array of sensors */
    ]
}
```

---

### 5. Delete Sensor

**DELETE** `/sensors/id/:sensorId`

Deletes a sensor.

**Authentication:** Required (farmer) ✓

**URL Parameters:**

-   `sensorId` - Sensor ID

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Sensor deleted successfully"
}
```

---

## Crop Management

### 1. Add Crop

**POST** `/crops`

Adds a new crop to the system.

**Request Body (JSON):**

```json
{
    "name": "Wheat",
    "season": "winter",
    "variety": "HD 2967",
    "plantingDate": "2024-10-15",
    "estimatedHarvestDate": "2025-03-15",
    "area": 50,
    "firmId": "firm_id",
    "userId": "user_id"
}
```

**Response:** `201 Created`

```json
{
    "success": true,
    "message": "Crop added successfully",
    "data": {
        "_id": "crop_id",
        "name": "Wheat",
        "season": "winter",
        "variety": "HD 2967"
    }
}
```

---

### 2. Get All Crops

**GET** `/crops`

Retrieves all crops in the system.

**Query Parameters:**

-   `season` - Filter by season (optional)
-   `page` - Page number (optional)
-   `limit` - Items per page (optional)

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        {
            "_id": "crop_id",
            "name": "Wheat",
            "season": "winter",
            "variety": "HD 2967"
        }
    ]
}
```

---

### 3. Get Crop by Name

**GET** `/crops/:name`

Retrieves a specific crop by name.

**URL Parameters:**

-   `name` - Crop name

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "_id": "crop_id",
        "name": "Wheat",
        "season": "winter",
        "variety": "HD 2967",
        "description": "Winter wheat variety"
    }
}
```

---

### 4. Update Crop

**PUT** `/crops/:id`

Updates crop information.

**Authentication:** Required (farmer or admin) ✓

**URL Parameters:**

-   `id` - Crop ID

**Request Body (JSON):**

```json
{
    "name": "Wheat Updated",
    "season": "winter",
    "area": 60,
    "status": "growing"
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Crop updated successfully",
    "data": {
        /* updated crop data */
    }
}
```

---

### 5. Delete Crop

**DELETE** `/crops/:id`

Deletes a crop.

**Authentication:** Required (admin) ✓

**URL Parameters:**

-   `id` - Crop ID

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Crop deleted successfully"
}
```

---

## Telemetry

### 1. Ingest Telemetry Data

**POST** `/telemetry/ingest`

Submits sensor telemetry data to the system.

**Request Body (JSON):**

```json
{
    "sensorId": "SENSOR001",
    "timestamp": "2024-12-15T10:30:00Z",
    "data": {
        "temperature": 28.5,
        "humidity": 65,
        "moisture": 45.2,
        "ph": 6.8,
        "nitrogen": 120,
        "phosphorus": 80,
        "potassium": 150
    }
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Telemetry data ingested successfully",
    "data": {
        "_id": "telemetry_id",
        "sensorId": "SENSOR001",
        "timestamp": "2024-12-15T10:30:00Z",
        "data": {
            /* sensor data */
        }
    }
}
```

---

## Blog Management

### 1. Create Blog Post

**POST** `/blogs`

Creates a new blog post.

**Request Body (JSON):**

```json
{
    "title": "Best Farming Practices",
    "content": "This is the blog content...",
    "userId": "user_id",
    "tags": ["farming", "agriculture"],
    "category": "tips"
}
```

**Response:** `201 Created`

```json
{
    "success": true,
    "message": "Blog created successfully",
    "data": {
        "_id": "blog_id",
        "title": "Best Farming Practices",
        "content": "This is the blog content...",
        "userId": "user_id"
    }
}
```

---

### 2. Get All Blogs

**GET** `/blogs`

Retrieves all blog posts.

**Query Parameters:**

-   `page` - Page number (optional)
-   `limit` - Items per page (optional)
-   `category` - Filter by category (optional)

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        {
            "_id": "blog_id",
            "title": "Best Farming Practices",
            "userId": "user_id",
            "likes": 15,
            "createdAt": "2024-12-15T10:30:00Z"
        }
    ]
}
```

---

### 3. Get Blogs by Owner

**GET** `/blogs/owner/:userId`

Retrieves all blog posts by a specific user.

**URL Parameters:**

-   `userId` - User ID

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        /* user's blog posts */
    ]
}
```

---

### 4. Update Blog Post

**PUT** `/blogs/:blogId`

Updates a blog post.

**URL Parameters:**

-   `blogId` - Blog ID

**Request Body (JSON):**

```json
{
    "title": "Updated Blog Title",
    "content": "Updated content...",
    "tags": ["updated", "tags"]
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Blog updated successfully",
    "data": {
        /* updated blog data */
    }
}
```

---

### 5. Delete Blog Post

**DELETE** `/blogs/:blogId`

Deletes a blog post.

**URL Parameters:**

-   `blogId` - Blog ID

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Blog deleted successfully"
}
```

---

### 6. Like Blog Post

**POST** `/blogs/:blogId/like`

Adds a like to a blog post.

**URL Parameters:**

-   `blogId` - Blog ID

**Request Body (JSON):**

```json
{
    "userId": "user_id"
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "message": "Blog liked successfully",
    "data": {
        "_id": "blog_id",
        "likes": 16
    }
}
```

---

## Response Format

### Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {
        /* response data */
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Error message describing what went wrong",
    "error": "Error details"
}
```

---

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Meaning                                 |
| ----------- | --------------------------------------- |
| 200         | OK - Request successful                 |
| 201         | Created - Resource created successfully |
| 400         | Bad Request - Invalid request data      |
| 401         | Unauthorized - Authentication required  |
| 403         | Forbidden - Access denied               |
| 404         | Not Found - Resource not found          |
| 500         | Internal Server Error - Server error    |

### Common Error Messages

**Authentication Errors:**

-   `"User not found"` - The user account doesn't exist
-   `"Invalid credentials"` - Wrong password or email/phone
-   `"Token expired"` - JWT token has expired
-   `"Unauthorized"` - Missing or invalid authentication token

**Validation Errors:**

-   `"Invalid email format"`
-   `"Password must be at least 6 characters"`
-   `"Phone number is required"`

**Resource Errors:**

-   `"Resource not found"`
-   `"You don't have permission to access this resource"`

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in the server root with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agriculter
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Rate Limiting

Currently, the API does not implement rate limiting. This is recommended to be added in production.

---

## CORS

CORS is enabled for all origins. For production, configure specific allowed origins in the CORS middleware.

---

## Support

For issues or questions regarding the API, please refer to the project documentation or contact the development team.

---

**Last Updated:** January 2025
**API Version:** 1.0
