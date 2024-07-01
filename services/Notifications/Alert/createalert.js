const { quicknode_api } = require("../../../utils/constant");

async function ethcreateAlert(req, res) {
  const {name, expression, destinationIds, network} = req.body;
  const myHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": `${quicknode_api}`,
  };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: 'follow',
      body: JSON.stringify({
        name: name,
        expression: expression,
        network: network,
        destinationIds: destinationIds,
      }),
    };
    try {
      const response = await fetch(
        "https://api.quicknode.com/quickalerts/rest/v1/notifications",
        requestOptions
      );
      const result = await response.json();
      console.log(result)
      res.status(200).send({ result });
    } catch (error) {
      console.error("Error:", error);
    }
}

module.exports = {
  ethcreateAlert,
};
