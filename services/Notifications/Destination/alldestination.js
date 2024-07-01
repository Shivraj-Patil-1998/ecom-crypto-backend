const { baseurl, quicknode_api } = require("../../../utils/constant");
const models = require("../../../models/index");
const { NotificationDestination, sequelize } = models;

async function ethDestination(req, res) {
  const myHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": `${quicknode_api}`,
  };

  const urls = [
    `${baseurl}/webhook/eth`,
    `${baseurl}/webhook/usdc`,
    `${baseurl}/webhook/usdt`,
    `${baseurl}/webhook/usdcbsc`,
    `${baseurl}/webhook/usdtbsc`,
    `${baseurl}/webhook/usdcpolygon`,
    `${baseurl}/webhook/usdtpolygon`,
    `${baseurl}/webhook/usdctron`,
    `${baseurl}/webhook/usdttron`,
  ];

  const names = [
    "ETH",
    "ERC 20 USDC",
    "ERC 20 USDT",
    "BSC USDC",
    "BSC USDT",
    "POLYGON USDC",
    "POLYGON USDT",
    "TRON USDC",
    "TRON USDT",
  ];

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const name = names[i];

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        name: name,
        to_url: url,
        webhook_type: "POST",
        service: "webhook",
        payload_type: 1,
      }),
    };

    try {
      const response = await fetch(
        "https://api.quicknode.com/quickalerts/rest/v1/destinations",
        requestOptions
      );
      const result = await response.json();
      results.push({ url, name, result });
    } catch (error) {
      console.error("Error:", error);
      results.push({ url, name, error: "An error occurred" });
    }
  }

  res.status(200).send({ results });

  if (results.length > 0) {
    const createPromises = results.map(({ result }) => {
      return NotificationDestination.create({
        destinationId: result.id,
        name: result.name,
        to: result.to,
        webhook_type: result.webhook_type,
        service: result.service,
        token: result.token,
        payload_type: result.payload_type,
      });
    });

    try {
      await Promise.all(createPromises);
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  }
}

module.exports = {
  ethDestination,
};
