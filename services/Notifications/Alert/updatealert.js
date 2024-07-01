const { quicknode_api } = require("../../../utils/constant");
const { Buffer } = require("buffer");

async function ethupdateAlert(notificationId, notificationExpression) {
  const myHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": `${quicknode_api}`,
  };

  try {
    const getNotification = await fetch(
      `https://api.quicknode.com/quickalerts/rest/v1/notifications/${notificationId}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    );
    const getResults = await getNotification.json();

    // new encode code
    const newCondition = notificationExpression;

    // merge Encode
    const mergeEncode = Buffer.from(
      getResults?.expression + newCondition
    ).toString("base64");

    console.log("mergeEncode", mergeEncode)

    const response = await fetch(
      `https://api.quicknode.com/quickalerts/rest/v1/notifications/${notificationId}`,
      {
        method: "PATCH",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify({
          expression: mergeEncode,
        }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error); 
    throw new Error("An error occurred while updating the alert."); 
  }
}

async function ethusdcupdateAlert(usdc_alert_id, usdcethalertexpression) {
  const myHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": `${quicknode_api}`,
  };

  try {
    const getNotification = await fetch(
      `https://api.quicknode.com/quickalerts/rest/v1/notifications/${usdc_alert_id}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    );
    const getResults = await getNotification.json();

    // new encode code
    const newCondition = usdcethalertexpression;

    // merge Encode
    const mergeEncode = Buffer.from(
      getResults?.expression + newCondition
    ).toString("base64");

    console.log("mergeEncode", mergeEncode)

    const response = await fetch(
      `https://api.quicknode.com/quickalerts/rest/v1/notifications/${usdc_alert_id}`,
      {
        method: "PATCH",
        headers: myHeaders,
        redirect: "follow",
        body: JSON.stringify({
          expression: mergeEncode,
        }),
      }
    );

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error); 
    throw new Error("An error occurred while updating the alert."); 
  }
}

module.exports = {
  ethupdateAlert,
  ethusdcupdateAlert
};
