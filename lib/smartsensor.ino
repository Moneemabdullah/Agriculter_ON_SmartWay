#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include "Adafruit_HTU21DF.h"
#include <LiquidCrystal_I2C.h>

// 🌐 WiFi Credentials
const char *ssid = "MONEEM...";    // Your WiFi SSID
const char *password = "11223344"; // Your WiFi Password

// 🌍 API Endpoint
const char *serverUrl = "https://agriculter-smartway.vercel.app/api/v1/telemetry/ingest";

// 🧠 Sensor Setup
Adafruit_HTU21DF htu = Adafruit_HTU21DF();
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define SOIL_PIN 34
#define LED_PIN 13
#define SENSOR_ID "01"

// ⏱️ Timing Configuration
const unsigned long READING_INTERVAL = 30000;    // Read sensors every 30 seconds
const unsigned long SEND_INTERVAL = 300000;      // Send data every 5 minutes
const unsigned long WIFI_CHECK_INTERVAL = 10000; // Check WiFi every 10 seconds
const unsigned long LCD_UPDATE_INTERVAL = 3000;  // Update LCD every 3 seconds
const unsigned long BLINK_INTERVAL = 500;        // LED blink every 500ms

unsigned long lastReadingTime = 0;
unsigned long lastSendTime = 0;
unsigned long lastWiFiCheck = 0;
unsigned long lastLcdUpdate = 0;
unsigned long lastBlinkTime = 0;

bool ledState = false;

// 📦 Data Storage
const int MAX_READINGS = 10;
struct SensorReading
{
  float temperature;
  float humidity;
  float soilMoisture;
};
SensorReading readings[MAX_READINGS];
int readingCount = 0;

// Latest sensor values for LCD display
float currentTemp = 0;
float currentHumidity = 0;
float currentSoil = 0;

// 🔗 Connect to WiFi
void connectWiFi()
{
  if (WiFi.status() == WL_CONNECTED)
    return;

  Serial.println("📶 Connecting to WiFi...");
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 30)
  {
    delay(500);
    Serial.print(".");
    lcd.setCursor(attempt % 16, 1);
    lcd.print(".");
    attempt++;
  }

  lcd.clear();
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("📡 IP Address: ");
    Serial.println(WiFi.localIP());

    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
    delay(2000);
  }
  else
  {
    Serial.println("\n❌ WiFi Connection Failed!");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed!");
    delay(2000);
  }
  lcd.clear();
}

// 📊 Read Sensors
bool readSensors(SensorReading &reading)
{
  float temp = htu.readTemperature();
  float hum = htu.readHumidity();

  if (isnan(temp) || isnan(hum))
  {
    Serial.println("⚠️ Failed to read from HTU21D sensor!");
    return false;
  }

  int soilValue = analogRead(SOIL_PIN);
  float soilPercent = map(soilValue, 4095, 0, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);

  reading.temperature = temp;
  reading.humidity = hum;
  reading.soilMoisture = soilPercent;

  // Update current values for LCD
  currentTemp = temp;
  currentHumidity = hum;
  currentSoil = soilPercent;

  return true;
}

// 📟 Update LCD Display
void updateLCD()
{
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(currentTemp, 1);
  lcd.print("C H:");
  lcd.print(currentHumidity, 0);
  lcd.print("%  ");

  lcd.setCursor(0, 1);
  lcd.print("Soil:");
  lcd.print(currentSoil, 0);
  lcd.print("% ");

  // Show WiFi status indicator
  if (WiFi.status() == WL_CONNECTED)
  {
    lcd.print("W");
  }
  else
  {
    lcd.print("X");
  }

  // Show data count
  lcd.print(" ");
  lcd.print(readingCount);
  lcd.print("/");
  lcd.print(MAX_READINGS);
  lcd.print(" ");
}

// 📤 Send Data to Server
void sendDataToServer()
{
  if (readingCount == 0)
  {
    Serial.println("⚠️ No data to send");
    return;
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("⚠️ WiFi not connected, skipping send");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("No WiFi!");
    lcd.setCursor(0, 1);
    lcd.print("Skipping send");
    delay(2000);
    lcd.clear();
    return;
  }

  Serial.println("\n📤 Preparing to send data...");
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Sending data...");
  lcd.setCursor(0, 1);
  lcd.print(readingCount);
  lcd.print(" readings");

  // Create JSON array
  DynamicJsonDocument doc(2048);
  JsonArray array = doc.to<JsonArray>();

  for (int i = 0; i < readingCount; i++)
  {
    JsonObject obj = array.createNestedObject();
    obj["sensorId"] = SENSOR_ID;
    obj["temperature"] = round(readings[i].temperature * 100) / 100.0;
    obj["humidity"] = round(readings[i].humidity * 100) / 100.0;
    obj["soilMoisture"] = round(readings[i].soilMoisture * 100) / 100.0;
  }

  String jsonData;
  serializeJson(doc, jsonData);

  Serial.println("📦 JSON Payload:");
  Serial.println(jsonData);
  Serial.printf("📊 Sending %d readings\n", readingCount);

  // Send HTTP POST request
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(15000);

  int httpCode = http.POST(jsonData);

  if (httpCode > 0)
  {
    Serial.printf("📡 HTTP Response Code: %d\n", httpCode);

    if (httpCode == 200 || httpCode == 201)
    {
      Serial.println("✅ Data sent successfully!");
      String response = http.getString();
      Serial.println("📥 Server Response:");
      Serial.println(response);

      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Sent Success!");
      lcd.setCursor(0, 1);
      lcd.print("Code: ");
      lcd.print(httpCode);
      delay(2000);

      // Clear readings after successful send
      readingCount = 0;
    }
    else
    {
      Serial.printf("❌ Server Error: %d\n", httpCode);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Server Error!");
      lcd.setCursor(0, 1);
      lcd.print("Code: ");
      lcd.print(httpCode);
      delay(2000);
    }
  }
  else
  {
    Serial.printf("❌ HTTP Request Failed: %s\n", http.errorToString(httpCode).c_str());
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Send Failed!");
    delay(2000);
  }

  http.end();
  lcd.clear();
  Serial.println("------------------------------");
}

void setup()
{
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n🌱 ESP32 Sensor Hub Starting...");
  Serial.println("================================");

  // Initialize I2C
  Wire.begin(21, 22);

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Welcome!");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(2000);
  lcd.clear();

  // Initialize HTU21D sensor
  Serial.println("🔧 Initializing HTU21D/SHT21 Sensor...");
  if (!htu.begin())
  {
    Serial.println("❌ HTU21D/SHT21 Not Found! Check Wiring.");
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!");
    while (1)
      delay(1000);
  }
  Serial.println("✅ HTU21D/SHT21 Sensor Ready!");
  lcd.setCursor(0, 0);
  lcd.print("Sensor Ready!");
  delay(1500);
  lcd.clear();

  // Initialize pins
  pinMode(SOIL_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.println("✅ Soil Moisture & LED Ready!");

  // Connect to WiFi
  connectWiFi();

  Serial.println("================================");
  Serial.printf("⏱️  Reading Interval: %d seconds\n", READING_INTERVAL / 1000);
  Serial.printf("📤 Send Interval: %d minutes\n", SEND_INTERVAL / 60000);
  Serial.println("🚀 System Ready!\n");

  lcd.setCursor(0, 0);
  lcd.print("System Ready!");
  delay(1500);
  lcd.clear();
}

void loop()
{
  unsigned long currentTime = millis();

  // 🔴 LED Blink
  if (currentTime - lastBlinkTime >= BLINK_INTERVAL)
  {
    lastBlinkTime = currentTime;
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
  }

  // 🔄 Periodic WiFi Check
  if (currentTime - lastWiFiCheck >= WIFI_CHECK_INTERVAL)
  {
    if (WiFi.status() != WL_CONNECTED)
    {
      Serial.println("⚠️ WiFi Disconnected! Reconnecting...");
      connectWiFi();
    }
    lastWiFiCheck = currentTime;
  }

  // 📊 Read Sensors
  if (currentTime - lastReadingTime >= READING_INTERVAL)
  {
    if (readingCount < MAX_READINGS)
    {
      SensorReading reading;
      if (readSensors(reading))
      {
        readings[readingCount] = reading;
        readingCount++;

        Serial.println("------------------------------");
        Serial.printf("📈 Reading #%d collected\n", readingCount);
        Serial.printf("🌡️  Temperature: %.2f°C\n", reading.temperature);
        Serial.printf("💧 Humidity: %.2f%%\n", reading.humidity);
        Serial.printf("🌱 Soil Moisture: %.2f%%\n", reading.soilMoisture);
        Serial.println("------------------------------");
      }
      else
      {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Sensor Error!");
        delay(2000);
        lcd.clear();
      }
    }
    lastReadingTime = currentTime;
  }

  // 📟 Update LCD Display
  if (currentTime - lastLcdUpdate >= LCD_UPDATE_INTERVAL)
  {
    updateLCD();
    lastLcdUpdate = currentTime;
  }

  // 📤 Send Data to Server
  if (currentTime - lastSendTime >= SEND_INTERVAL)
  {
    sendDataToServer();
    lastSendTime = currentTime;
  }
}