#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "Adafruit_HTU21DF.h"

// 🌐 WiFi Credentials
const char *ssid = "";     //! your wifi SSID
const char *password = ""; //! your wifi password

// 🌍 API Endpoint
const char *serverUrl = ""; //! your server URL with endpoint

// 🧠 Sensor setup
Adafruit_HTU21DF htu = Adafruit_HTU21DF();
#define SOIL_PIN 34
#define SENSOR_ID "SENSOR_001"

unsigned long lastCheck = 0;
const unsigned long wifiCheckInterval = 10000; // check WiFi every 10 sec

// 🔗 Connect to WiFi
void connectWiFi()
{
  if (WiFi.status() == WL_CONNECTED)
    return;

  Serial.print("📶 Connecting to WiFi");
  WiFi.begin(ssid, password);

  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 20)
  {
    delay(1000);
    Serial.print(".");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("📡 IP: ");
    Serial.println(WiFi.localIP());
  }
  else
  {
    Serial.println("\n❌ Failed to connect to WiFi!");
  }
}

void setup()
{
  Serial.begin(115200);
  delay(1000);

  // Initialize I2C
  Wire.begin(21, 22);
  Serial.println("🌱 Initializing Sensors...");

  if (!htu.begin())
  {
    Serial.println("❌ HTU21D/SHT21 not found! Check wiring.");
    while (1)
      ;
  }

  Serial.println("✅ HTU21D/SHT21 sensor detected!");
  pinMode(SOIL_PIN, INPUT);

  connectWiFi();
}

void loop()
{
  // 🔄 Check WiFi connection
  if (millis() - lastCheck > wifiCheckInterval)
  {
    if (WiFi.status() != WL_CONNECTED)
    {
      Serial.println("⚠️ WiFi disconnected, trying to reconnect...");
      connectWiFi();
    }
    lastCheck = millis();
  }

  // --- Read sensors ---
  float temperature = htu.readTemperature();
  float humidity = htu.readHumidity();
  int soilValue = analogRead(SOIL_PIN);
  float soilPercent = map(soilValue, 4095, 0, 0, 100);

  // 🧾 Prepare JSON data
  String jsonData = String("{\"sensorId\":\"") + SENSOR_ID +
                    "\",\"temperature\":" + String(temperature, 2) +
                    ",\"humidity\":" + String(humidity, 2) +
                    ",\"soilMoisture\":" + String(soilPercent, 2) + "}";

  Serial.println("------------------------------");
  Serial.println(jsonData);

  // 🌍 Send to server
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    int code = http.POST(jsonData);

    if (code == 200 || code == 201)
    {
      Serial.println("✅ Data sent successfully!");
    }
    else
    {
      Serial.printf("❌ Server error (%d)\n", code);
    }

    http.end();
  }
  else
  {
    Serial.println("⚠️ WiFi not connected, skipping send.");
  }

  delay(5000); // Every 5 sec
}
