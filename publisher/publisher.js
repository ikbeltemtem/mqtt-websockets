// MQTT client, publishing status flag, and interval ID variables
let mqttClient;
let isPublishing = false; // Flag to track publishing status
let publishIntervalId; // Interval ID for publishing

// Event listener for when the window is fully loaded
window.addEventListener("load", (event) => {
  // Establish MQTT connection when the window is loaded
  connectToBroker();

  // Event listener for the "Start" button
  const startBtn = document.querySelector(".start");
  startBtn.addEventListener("click", function () {
    startPublishing();
  });

  // Event listener for the "Stop" button
  const stopBtn = document.querySelector(".stop");
  stopBtn.addEventListener("click", function () {
    stopPublishing();
  });
});

// Function to connect to the MQTT broker
function connectToBroker() {
  // Generate a random client ID
  const clientId = "client" + Math.random().toString(36).substring(7);

  // MQTT broker connection parameters
  const host = "ws://127.0.0.1:9001/mqtt";
  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  // Connect to the MQTT broker
  mqttClient = mqtt.connect(host, options);

  // Event handlers for MQTT client
  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
  });

  // Event handler for received MQTT messages
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
    // Display the received temperature in the UI
    displayTemperature(message.toString());
  });
}

// Function to start publishing random temperatures
function startPublishing() {
  if (!isPublishing) {
    // Set publishing flag to true
    isPublishing = true;
    // Publish temperature immediately
    publishTemperature();
    // Publish a random temperature every 5 seconds
    publishIntervalId = setInterval(publishTemperature, 5000);
  }
}

// Function to stop publishing temperatures
function stopPublishing() {
  if (isPublishing) {
    // Set publishing flag to false
    isPublishing = false;
    // Clear the publishing interval
    clearInterval(publishIntervalId);
  }
}

// Function to publish a random temperature to the MQTT broker
function publishTemperature() {
  // MQTT topic for temperature
  const topic = "Temp";

  // Function to generate a random temperature between 20 and 30 degrees Celsius
  function generateRandomTemperature() {
    return (Math.random() * 10 + 20).toFixed(2);
  }

  // Publish the generated temperature to the specified topic
  const temperature = generateRandomTemperature();
  console.log(`Sending Topic: ${topic}, Temperature: ${temperature}`);

  mqttClient.publish(topic, temperature, {
    qos: 0,
    retain: false,
  });
}

// Function to display the received temperature in the UI
function displayTemperature(temperature) {
  // Find the HTML element with the ID "temperature-display"
  const temperatureDisplay = document.querySelector("#temperature-display");
  // Update the content of the element to display the received temperature
  temperatureDisplay.textContent = `Received Temperature: ${temperature} °C`;
}
