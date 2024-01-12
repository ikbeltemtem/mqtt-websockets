let mqttClient;

// Seuil de température pour déclencher l'alerte
const seuilTemperature = 25;

window.addEventListener("load", (event) => {
  connectToBroker();

  const subscribeBtn = document.querySelector("#subscribe");
  subscribeBtn.addEventListener("click", function () {
    subscribeToTopic();
  });

  const unsubscribeBtn = document.querySelector("#unsubscribe");
  unsubscribeBtn.addEventListener("click", function () {
    unsubscribeToTopic();
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

function subscribeToTopic() {
  const status = document.querySelector("#status");
  const topic = "Temp";
  console.log(`Subscribing to Topic: ${topic}`);

  mqttClient.subscribe(topic, { qos: 0 });
  status.style.color = "green";
  status.textContent = `SUBSCRIBED to ${topic}`;
}

function unsubscribeToTopic() {
  const status = document.querySelector("#status");
  const topic = "Temp";
  console.log(`Unsubscribing from Topic: ${topic}`);

  mqttClient.unsubscribe(topic, { qos: 0 });
  status.style.color = "red";
  status.textContent = `UNSUBSCRIBED from ${topic}`;
}

function displayTemperature(temperature) {
  const temperatureDisplay = document.querySelector("#temperature-display");
  temperatureDisplay.textContent = `Received Temperature: ${temperature} °C`;

  // Vérifier si la température dépasse le seuil
  if (parseFloat(temperature) > seuilTemperature) {
    alert("Alerte : La température a dépassé le seuil !");
  }
}
