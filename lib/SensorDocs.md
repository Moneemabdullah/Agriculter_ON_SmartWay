# ESP32 Sensor Hub Documentation

## Overview

This ESP32-based sensor hub collects environmental data (temperature, humidity, and soil moisture) and sends it to a remote server in batches. The system features local display via LCD, visual indicators via LED, and efficient data transmission over WiFi.

## Table of Contents

-   [Features](#features)
-   [Hardware Requirements](#hardware-requirements)
-   [Software Requirements](#software-requirements)
-   [Pin Configuration](#pin-configuration)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [System Architecture](#system-architecture)
-   [Data Flow](#data-flow)
-   [API Integration](#api-integration)
-   [Troubleshooting](#troubleshooting)
-   [License](#license)

## Features

### Core Functionality

-   **Batch Data Collection**: Collects sensor readings every 30 seconds
-   **Efficient Transmission**: Sends data in arrays every 5 minutes to reduce network overhead
-   **Local Display**: Real-time sensor data display on 16x2 LCD
-   **Visual Indicators**: LED blink status for system health monitoring
-   **Auto-Reconnect**: Automatic WiFi reconnection on connection loss
-   **Error Handling**: Robust error detection and recovery mechanisms

### Monitoring Capabilities

-   Temperature monitoring (HTU21D/SHT21 sensor)
-   Humidity monitoring (HTU21D/SHT21 sensor)
-   Soil moisture monitoring (capacitive/resistive sensor)
-   WiFi connection status
-   Data buffer status (readings collected vs. capacity)

## Hardware Requirements

### Components

| Component                   | Model/Type              | Quantity  | Notes                       |
| --------------------------- | ----------------------- | --------- | --------------------------- |
| Microcontroller             | ESP32 Development Board | 1         | Any ESP32 variant with WiFi |
| Temperature/Humidity Sensor | HTU21D or SHT21         | 1         | I2C interface               |
| Soil Moisture Sensor        | Capacitive or Resistive | 1         | Analog output               |
| LCD Display                 | 16x2 I2C LCD (0x27)     | 1         | With I2C backpack           |
| LED                         | Red LED (or any color)  | 1         | 5mm standard LED            |
| Resistor                    | 220Ω - 330Ω             | 1         | For LED current limiting    |
| Jumper Wires                | Male-to-Male/Female     | As needed | For connections             |
| Breadboard                  | Standard size           | 1         | Optional, for prototyping   |
| Power Supply                | 5V USB or external      | 1         | Min 500mA recommended       |

### Circuit Diagram

```
ESP32 Connections:
├── I2C Bus (SDA: GPIO 21, SCL: GPIO 22)
│   ├── HTU21D Sensor
│   └── LCD Display (0x27)
├── Analog Input
│   └── GPIO 34 → Soil Moisture Sensor
└── Digital Output
    └── GPIO 13 → LED (+) → 220Ω Resistor → GND
```

## Software Requirements

### Required Libraries

Install these libraries via Arduino Library Manager:

1. **WiFi** (Built-in with ESP32 board support)
2. **HTTPClient** (Built-in with ESP32 board support)
3. **Wire** (Built-in)
4. **ArduinoJson** (v6.x) - For JSON serialization
5. **Adafruit HTU21DF Library** - For temperature/humidity sensor
6. **LiquidCrystal I2C** - For LCD display

### Installation Command (PlatformIO)

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps =
    bblanchon/ArduinoJson@^6.21.3
    adafruit/Adafruit HTU21DF Library@^1.1.0
    marcoschwartz/LiquidCrystal_I2C@^1.1.4
```

### Arduino IDE Installation

1. Go to **Sketch** → **Include Library** → **Manage Libraries**
2. Search and install:
    - "ArduinoJson" by Benoit Blanchon
    - "Adafruit HTU21DF Library" by Adafruit
    - "LiquidCrystal I2C" by Frank de Brabander

## Pin Configuration

### Default Pin Assignments

```cpp
// I2C Pins
#define SDA_PIN 21
#define SCL_PIN 22

// Analog Input
#define SOIL_PIN 34

// Digital Output
#define LED_PIN 13

// I2C Addresses
#define LCD_ADDRESS 0x27
#define HTU21D_ADDRESS 0x40 // Default, auto-detected
```

### Customization

You can modify pin assignments in the code:

```cpp
// Change soil sensor pin
#define SOIL_PIN 35  // Use GPIO 35 instead

// Change LED pin
#define LED_PIN 2    // Use built-in LED on GPIO 2

// Change I2C pins
Wire.begin(19, 23);  // SDA=19, SCL=23
```

## Installation

### Step 1: Hardware Assembly

1. Connect HTU21D sensor to ESP32 I2C bus (SDA=21, SCL=22)
2. Connect LCD to the same I2C bus
3. Connect soil moisture sensor signal to GPIO 34
4. Connect LED with resistor to GPIO 13
5. Ensure common ground for all components
6. Power ESP32 via USB or external 5V supply

### Step 2: Software Setup

1. Install Arduino IDE or PlatformIO
2. Install ESP32 board support:
    - Arduino IDE: **File** → **Preferences** → **Additional Board Manager URLs**
    - Add: `https://dl.espressif.com/dl/package_esp32_index.json`
3. Install required libraries (see Software Requirements)
4. Download the code
5. Open in your IDE

### Step 3: Configuration

Edit these lines in the code:

```cpp
// WiFi Credentials
const char *ssid = "YourWiFiName";
const char *password = "YourWiFiPassword";

// API Endpoint (optional - default is provided)
const char *serverUrl = "https://your-server.com/api/v1/telemetry/ingest";

// Sensor ID (optional - default is "01")
#define SENSOR_ID "01"
```

### Step 4: Upload

1. Select your ESP32 board: **Tools** → **Board** → **ESP32 Dev Module**
2. Select COM port: **Tools** → **Port** → (your ESP32 port)
3. Click **Upload**
4. Open Serial Monitor (115200 baud) to view status

## Configuration

### Timing Configuration

Adjust these values to change system behavior:

```cpp
// Sensor reading interval (milliseconds)
const unsigned long READING_INTERVAL = 30000;  // 30 seconds

// Data transmission interval (milliseconds)
const unsigned long SEND_INTERVAL = 300000;    // 5 minutes

// WiFi check interval (milliseconds)
const unsigned long WIFI_CHECK_INTERVAL = 10000; // 10 seconds

// LCD update interval (milliseconds)
const unsigned long LCD_UPDATE_INTERVAL = 3000;  // 3 seconds

// LED blink interval (milliseconds)
const unsigned long BLINK_INTERVAL = 500;        // 0.5 seconds
```

### Buffer Configuration

```cpp
// Maximum readings to store before sending
const int MAX_READINGS = 10;
```

**Note:** If you change `READING_INTERVAL` or `SEND_INTERVAL`, adjust `MAX_READINGS` accordingly:

```
MAX_READINGS = SEND_INTERVAL / READING_INTERVAL
```

### Soil Moisture Calibration

Calibrate the soil sensor for accurate readings:

```cpp
// Current mapping (adjust based on your sensor)
float soilPercent = map(soilValue, 4095, 0, 0, 100);

// Calibrated mapping (measure your sensor in air and water)
int dryValue = 3900;  // Sensor reading in dry air
int wetValue = 1200;  // Sensor reading in water
float soilPercent = map(soilValue, dryValue, wetValue, 0, 100);
```

## System Architecture

### Component Interaction

```
┌─────────────┐
│   HTU21D    │──┐
│   Sensor    │  │
└─────────────┘  │
                 │     ┌──────────────┐
┌─────────────┐  ├────▶│    ESP32     │
│    Soil     │  │     │ Microcontrol │
│   Sensor    │──┘     └──────┬───────┘
                              │
┌─────────────┐               │
│  LCD 16x2   │◀──────────────┤
└─────────────┘               │
                              │
┌─────────────┐               │
│     LED     │◀──────────────┤
└─────────────┘               │
                              │
                              ▼
                       ┌─────────────┐
                       │    WiFi     │
                       │   Router    │
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   Internet  │
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   Server    │
                       │     API     │
                       └─────────────┘
```

### State Machine

```
[STARTUP] → [INITIALIZE] → [CONNECT_WIFI] → [RUNNING]
                                                  ↓
                                            [READ_SENSORS]
                                                  ↓
                                            [STORE_DATA]
                                                  ↓
                                            [UPDATE_LCD]
                                                  ↓
                                            [CHECK_BUFFER]
                                                  ↓
                                            [SEND_DATA] → [RUNNING]
```

## Data Flow

### 1. Sensor Reading Phase (Every 30 seconds)

```cpp
[HTU21D Sensor] → Temperature (°C)
                → Humidity (%)
[Soil Sensor]   → Moisture (%)
        ↓
[Validation & Storage]
        ↓
[Memory Buffer] (Max 10 readings)
```

### 2. Display Update Phase (Every 3 seconds)

```cpp
[Current Sensor Values]
        ↓
[LCD Display]
Line 1: T:25.5C H:65%
Line 2: Soil:78% W 5/10
```

### 3. Data Transmission Phase (Every 5 minutes)

```cpp
[Memory Buffer]
        ↓
[JSON Array Construction]
        ↓
[HTTP POST Request]
        ↓
[Server Response]
        ↓
[Clear Buffer on Success]
```

### Data Format

#### Single Reading Structure

```cpp
struct SensorReading {
  float temperature;   // Celsius
  float humidity;      // Percentage (0-100)
  float soilMoisture;  // Percentage (0-100)
};
```

#### JSON Payload Example

```json
[
    {
        "sensorId": "01",
        "temperature": 25.5,
        "humidity": 65.0,
        "soilMoisture": 78.0
    },
    {
        "sensorId": "01",
        "temperature": 25.48,
        "humidity": 65.2,
        "soilMoisture": 77.5
    }
]
```

## API Integration

### Server Endpoint

**URL:** `https://agriculter-smartway.vercel.app/api/v1/telemetry/ingest`

**Method:** `POST`

**Headers:**

```
Content-Type: application/json
```

### Request Format

```json
[
  {
    "sensorId": "string",
    "temperature": number,
    "humidity": number,
    "soilMoisture": number
  }
]
```

### Response Format

#### Success (200/201)

```json
{
    "success": true,
    "data": [
        {
            "_id": "60a7b8c9d1234567890abcde",
            "sensorId": "01",
            "temperature": 25.5,
            "humidity": 65.0,
            "soilMoisture": 78.0,
            "createdAt": "2025-01-11T10:30:00.000Z"
        }
    ]
}
```

#### Error (4xx/5xx)

```json
{
    "success": false,
    "error": "Error message"
}
```

### HTTP Status Codes

| Code    | Meaning      | Action                                |
| ------- | ------------ | ------------------------------------- |
| 200     | OK           | Data received and processed           |
| 201     | Created      | New records created successfully      |
| 400     | Bad Request  | Check JSON format and required fields |
| 500     | Server Error | Server-side issue, retry later        |
| Timeout | No response  | Check internet connection             |

## Troubleshooting

### WiFi Issues

**Problem:** WiFi won't connect

**Solutions:**

-   Check SSID and password in code
-   Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
-   Move ESP32 closer to router
-   Check router security settings (WPA2 recommended)
-   Monitor Serial output for connection attempts

**Problem:** Frequent disconnections

**Solutions:**

-   Increase `WIFI_CHECK_INTERVAL`
-   Check power supply (weak power = unstable WiFi)
-   Reduce distance to router
-   Check for WiFi interference

### Sensor Issues

**Problem:** HTU21D not detected

**Solutions:**

-   Check I2C wiring (SDA=21, SCL=22)
-   Verify sensor address with I2C scanner
-   Check power supply to sensor (3.3V)
-   Add pull-up resistors (4.7kΩ) to SDA and SCL if needed

**Problem:** Soil sensor readings incorrect

**Solutions:**

-   Calibrate sensor (see Configuration section)
-   Check analog pin connection (GPIO 34)
-   Clean sensor contacts
-   Adjust mapping values in code

### LCD Issues

**Problem:** LCD not displaying

**Solutions:**

-   Check I2C address (try 0x3F if 0x27 doesn't work)
-   Verify I2C connections
-   Adjust LCD contrast (potentiometer on I2C backpack)
-   Run I2C scanner to detect address

**Problem:** Garbled text

**Solutions:**

-   Check baud rate (should be 115200)
-   Verify power supply stability
-   Reset ESP32
-   Reinitialize LCD in setup

### Data Transmission Issues

**Problem:** Data not reaching server

**Solutions:**

-   Check server URL is correct
-   Verify internet connection
-   Monitor Serial output for HTTP response codes
-   Check firewall settings
-   Test API endpoint with Postman/curl

**Problem:** HTTP timeout errors

**Solutions:**

-   Increase timeout: `http.setTimeout(20000);`
-   Check internet speed
-   Verify server is running
-   Reduce payload size if needed

### LED Issues

**Problem:** LED not blinking

**Solutions:**

-   Check LED polarity (long leg = positive)
-   Verify resistor value (220-330Ω)
-   Test LED with different pin
-   Check GPIO 13 availability

### Memory Issues

**Problem:** ESP32 crashes or reboots

**Solutions:**

-   Reduce `MAX_READINGS` to save memory
-   Check for memory leaks in loop
-   Monitor free heap: `Serial.println(ESP.getFreeHeap());`
-   Reduce JSON document size in `DynamicJsonDocument`

### Serial Monitor Debugging

Add debug output:

```cpp
// In loop(), add:
Serial.print("Free Heap: ");
Serial.println(ESP.getFreeHeap());

Serial.print("WiFi RSSI: ");
Serial.println(WiFi.RSSI());

Serial.print("Buffer count: ");
Serial.println(readingCount);
```

## Advanced Features

### Enable Deep Sleep (Power Saving)

Add between sensor readings:

```cpp
// Sleep for 30 seconds
esp_sleep_enable_timer_wakeup(30 * 1000000); // microseconds
esp_light_sleep_start();
```

### Add Multiple Sensors

```cpp
#define SENSOR_COUNT 3
const char* sensorIds[] = {"01", "02", "03"};

// In JSON creation:
obj["sensorId"] = sensorIds[currentSensor];
```

### Add Data Validation

```cpp
bool validateReading(SensorReading &reading) {
  if (reading.temperature < -40 || reading.temperature > 80) return false;
  if (reading.humidity < 0 || reading.humidity > 100) return false;
  if (reading.soilMoisture < 0 || reading.soilMoisture > 100) return false;
  return true;
}
```

### Add Timestamp to Data

```cpp
#include <time.h>

// In setup():
configTime(0, 0, "pool.ntp.org");

// In JSON creation:
time_t now;
time(&now);
obj["timestamp"] = now;
```

## Performance Metrics

### Typical Values

-   **Boot time:** 2-3 seconds
-   **Sensor read time:** 100-200ms
-   **WiFi connect time:** 3-5 seconds
-   **HTTP POST time:** 1-3 seconds (depends on network)
-   **Power consumption:** 80-160mA active, 10mA deep sleep
-   **Memory usage:** ~40KB used, ~280KB free

### Optimization Tips

1. Use deep sleep between readings
2. Batch data to reduce HTTP requests
3. Optimize JSON document size
4. Disable Serial output in production
5. Use static IP to reduce DHCP time

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions:

-   GitHub Issues: [Your Repository]
-   Email: moneem.all.abdullah@gmail.com
-   Documentation: [Your Docs URL]

## Changelog

### Version 1.0.0 (Current)

-   Initial release
-   Batch data collection and transmission
-   LCD display integration
-   LED status indicator
-   Auto WiFi reconnection
-   Error handling and recovery

---

**Last Updated:** January 11, 2026  
**Author:** Abdullah al moneem
**Version:** 1.0.0
