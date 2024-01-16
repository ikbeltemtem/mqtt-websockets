// MQTT client variable
let mqttClient;

// Temperature threshold to trigger the alert
const seuilTemperature = 25;

// Event listener for when the window is fully loaded
window.addEventListener("load", (event) => {
  // Establish MQTT connection when the window is loaded
  connectToBroker();

  // Event listener for the "Subscribe" button
  const subscribeBtn = document.querySelector("#subscribe");
  subscribeBtn.addEventListener("click", function () {
    subscribeToTopic();
  });

  // Event listener for the "Unsubscribe" button
  const unsubscribeBtn = document.querySelector("#unsubscribe");
  unsubscribeBtn.addEventListener("click", function () {
    unsubscribeToTopic();
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
    // Display the received temperature in the UI and check for the threshold
    displayTemperature(message.toString());
  });
}

// Function to subscribe to an MQTT topic
function subscribeToTopic() {
  const status = document.querySelector("#status");
  // MQTT topic to subscribe to
  const topic = "Temp";
  console.log(`Subscribing to Topic: ${topic}`);

  // Subscribe to the specified topic 
  mqttClient.subscribe(topic, { qos: 0 });
  // Update status display to show subscription status
  status.style.color = "green";
  status.textContent = `SUBSCRIBED to ${topic}`;
}

// Function to unsubscribe from an MQTT topic
function unsubscribeToTopic() {
  const status = document.querySelector("#status");
  // MQTT topic to unsubscribe from
  const topic = "Temp";
  console.log(`Unsubscribing from Topic: ${topic}`);

  // Unsubscribe from the specified topic
  mqttClient.unsubscribe(topic, { qos: 0 });
  // Update status display to show unsubscription status
  status.style.color = "red";
  status.textContent = `UNSUBSCRIBED from ${topic}`;
}

// Function to display the received temperature in the UI
function displayTemperature(temperature) {
  const temperatureDisplay = document.querySelector("#temperature-display");
  // Update the content of the element to display the received temperature
  temperatureDisplay.textContent = `Received Temperature: ${temperature} °C`;

  // Check if the temperature exceeds the threshold
  if (parseFloat(temperature) > seuilTemperature) {
    // Display an alert if the temperature surpasses the threshold
    alert("Alert: Temperature has exceeded the threshold!");
  }
}
