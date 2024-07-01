const { baseurl, quicknode_api } = require("../../../utils/constant");

async function getIdDestination(req, res) {
    const id = req.body.id;
  const myHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": `${quicknode_api}`,
  };

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(
      `https://api.quicknode.com/quickalerts/rest/v1/destinations/${id}`,
      requestOptions
    );
    const result = await response.json();
    res.status(200).send({ result });
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = {
    getIdDestination,
};
