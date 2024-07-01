const { baseurl, quicknode_api } = require("../../../utils/constant");

async function deleteDestination(req, res) {
  const id = req.body.id;
  const myHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": `${quicknode_api}`,
  };

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
  };

  try {
    const response = await fetch(
      `https://api.quicknode.com/quickalerts/rest/v1/destinations/${id}`,
      requestOptions
    );

    // Check if the response status indicates an error
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }

    // Check if there is content to parse
    const responseText = await response.text();
    const result = responseText ? JSON.parse(responseText) : {};

    res.status(200).send({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  deleteDestination,
};
