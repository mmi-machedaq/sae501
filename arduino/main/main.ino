#include "WiFiS3.h"
#include "Arduino_JSON.h"
#include "secrets.h" // Include the secrets file with Wi-Fi credentials

// Wi-Fi credentials
char ssid[] = SECRET_SSID;   // your network SSID
char pass[] = SECRET_PASS;   // your network password
int status = WL_IDLE_STATUS; // Wi-Fi status

WiFiServer server(3000);

const int pump1Pin = 7;
const int pump2Pin = 8;
const int pump3Pin = 9;
const float flowRatePerMin = 80.0;                     // ml/min
const float flowRatePerSecond = flowRatePerMin / 60.0; // ml/sec

void setup()
{
    // Initialize serial and wait for port to open
    Serial.begin(115200);
    while (!Serial)
    {
        ; // wait for serial port to connect
    }

    setUpWifiConnection(); // Connect to the Wi-Fi network

    // Start the server
    server.begin();
    Serial.println("🖥️ Server started on port 3000");

    // Set the pump pins as OUTPUT
    pinMode(pump1Pin, OUTPUT);
    pinMode(pump2Pin, OUTPUT);
    pinMode(pump3Pin, OUTPUT);

    // Initially turn off all pumps
    digitalWrite(pump1Pin, LOW);
    digitalWrite(pump2Pin, LOW);
    digitalWrite(pump3Pin, LOW);
}

void loop()
{
    WiFiClient client = server.available(); // Check if a client has connected

    if (client)
    {
        Serial.println("\n🤠 Client connected");
        String request = "";
        String jsonPayload = "";
        bool isBody = false;

        while (client.connected())
        {
            if (client.available())
            {
                char c = client.read();
                request += c;

                // Detect the end of the HTTP headers (empty line)
                if (request.endsWith("\r\n\r\n"))
                {
                    isBody = true;
                    break;
                }
            }
        }

        // Read the JSON payload from the body
        while (client.available())
        {
            char c = client.read();
            jsonPayload += c;
        }

        Serial.println("JSON Payload:");
        Serial.println(jsonPayload);

        // Validate and parse the JSON payload
        if (jsonPayload.length() > 0)
        {
            JSONVar parsed = JSON.parse(jsonPayload);

            if (JSON.typeof(parsed) == "undefined")
            {
                Serial.println("\n❌ Failed to parse JSON");
                client.println("HTTP/1.1 400 Bad Request");
                client.println("Content-Type: application/json");
                client.println();
                client.println("{\"error\":\"Invalid JSON\"}");
            }
            else if (parsed.hasOwnProperty("test") && (bool)parsed["test"] == true)
            {
                Serial.println("🧪 Test flag detected, returning true");

                client.println("HTTP/1.1 200 OK");
                client.println("Content-Type: application/json");
                client.println();
                client.println("{\"status\":true}");
            }
            else if (parsed.hasOwnProperty("test"))
            {
                Serial.println("🧪 Test flag detected, but false");

                client.println("HTTP/1.1 200 OK");
                client.println("Content-Type: application/json");
                client.println();
                client.println("{\"status\":false}");
            }
            else
            {
                // Access values from the "cocktail" object
                int pump1Milliliters = (int)parsed["cocktail"]["1"];
                int pump2Milliliters = (int)parsed["cocktail"]["2"];
                int pump3Milliliters = (int)parsed["cocktail"]["3"];

                int pump1Duration = calculatePumpDuration(pump1Milliliters);
                int pump2Duration = calculatePumpDuration(pump2Milliliters);
                int pump3Duration = calculatePumpDuration(pump3Milliliters);

                // Log received data
                Serial.println("\n✅ Données reçues:");
                Serial.print("- Pompe 1 : ");
                Serial.println(pump1Duration);
                Serial.print("- Pompe 2 : ");
                Serial.println(pump2Duration);
                Serial.print("- Pompe 3 : ");
                Serial.println(pump3Duration);

                // Control the pumps
                Serial.println("\n");
                controlPump(pump1Pin, pump1Duration);
                controlPump(pump2Pin, pump2Duration);
                controlPump(pump3Pin, pump3Duration);

                // Respond to client
                client.println("HTTP/1.1 200 OK");
                client.println("Content-Type: application/json");
                client.println();
                client.println("{\"status\":\"success\",\"message\":\"Data received successfully\"}");
            }
        }
        else
        {
            // Handle missing JSON payload
            Serial.println("\n❌ No JSON found in request");
            client.println("HTTP/1.1 400 Bad Request");
            client.println("Content-Type: application/json");
            client.println();
            client.println("{\"error\":\"No JSON payload found\"}");
        }

        // Close the connection
        client.stop();
        Serial.println("\n➡️ Client disconnected");
    }
}

// Function to print Wi-Fi status
void printWifiStatus()
{
    Serial.print("🛜 SSID: ");
    Serial.println(WiFi.SSID()); // Print the SSID of the network

    IPAddress ip = WiFi.localIP(); // Get the board's IP address
    Serial.print("IP Address: ");
    Serial.println(ip);

    long rssi = WiFi.RSSI(); // Get the signal strength (RSSI)
    Serial.print("Signal strength (RSSI): ");
    Serial.print(rssi);
    Serial.println(" dBm");
}

// Function to connect to the Wi-Fi network
void setUpWifiConnection()
{
    // Check for Wi-Fi module
    if (WiFi.status() == WL_NO_MODULE)
    {
        Serial.println("Communication with Wi-Fi module failed!");
        while (true)
            ;
    }

    // Attempt to connect to Wi-Fi network
    while (status != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to SSID: ");
        Serial.println(ssid);
        status = WiFi.begin(ssid, pass); // Connect to the Wi-Fi
        delay(10000);                    // Wait 10 seconds before retrying
    }

    // Once connected, print the Wi-Fi details
    printWifiStatus();
}

// Function to control the pumps
void controlPump(int pumpPin, int pumpingDuration)
{
    if (pumpingDuration > 0)
    {
        // Turn the pump ON (example: set pin HIGH)
        digitalWrite(pumpPin, HIGH);
        Serial.print("🫗 Boisson n°");
        Serial.print(pumpPin);
        Serial.println(" est en distribution.");

        delay(pumpingDuration);

        // Turn the pump OFF (example: set pin LOW)
        digitalWrite(pumpPin, LOW);
        Serial.print("🛑 Boisson n°");
        Serial.print(pumpPin);
        Serial.println(" a fini de distribuer.");
    }
}

// Function to convert mL to milliseconds
int calculatePumpDuration(int volumeInML)
{
    // Calculate the duration in milliseconds
    float durationInMilliseconds = (volumeInML / flowRatePerSecond) * 1000.0;

    return (int)durationInMilliseconds;
}