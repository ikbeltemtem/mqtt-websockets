let mqttClient;
let isPublishing = false; // Flag to track publishing status
let publishIntervalId; // Interval ID for publishing

window.addEventListener("load", (event) => {
  connectToBroker();

  const startBtn = document.querySelector(".start");
  startBtn.addEventListener("click", function () {
    startPublishing();
  });

  const stopBtn = document.querySelector(".stop");
  stopBtn.addEventListener("click", function () {
    stopPublishing();
  });
});

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);

  // Change this to point to your MQTT broker
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

  mqttClient = mqtt.connect(host, options);

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

  // Received
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
    displayTemperature(message.toString());
  });
}

function startPublishing() {
  if (!isPublishing) {
    isPublishing = true;
    publishTemperature(); // Publish immediately
    // Publish a random temperature every 5 seconds
    publishIntervalId = setInterval(publishTemperature, 5000);
  }
}

function stopPublishing() {
  if (isPublishing) {
    isPublishing = false;
    clearInterval(publishIntervalId);
  }
}

function publishTemperature() {
  const topic = "Temp";

  // Function to generate a random temperature between 20 and 30 degrees Celsius
  function generateRandomTemperature() {
    return (Math.random() * 10 + 20).toFixed(2);
  }

  // Publish the generated temperature value to the specified topic
  const temperature = generateRandomTemperature();
  console.log(`Sending Topic: ${topic}, Temperature: ${temperature}`);

  mqttClient.publish(topic, temperature, {
    qos: 0,
    retain: false,
  });
}

function displayTemperature(temperature) {
  const temperatureDisplay = document.querySelector("#temperature-display");
  temperatureDisplay.textContent = `Received Temperature: ${temperature} °C`;
}
