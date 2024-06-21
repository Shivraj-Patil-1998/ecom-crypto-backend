const TronWeb = require('tronweb');

// Configuration for Shasta Testnet

async function sendUsdt() {
  const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io/',
    privateKey:
      'CD00E4F78694B33B9F1204AEBAA82171A13A1EF9AB259AA1EB87657659A8E57D',
  });
  const fromAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';
  const contractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';
  const toAddress = 'TKG4HA1ggsZNtyG4tCkJ53xxN3djVd2YcS';
  const amount = 1000000; // 1 USDT
  try {
    const contract = await tronWeb.contract().at(contractAddress);
    const transaction = await contract.methods
      .transfer(toAddress, amount)
      .send({
        from: fromAddress,
      });
    console.log('Transaction:', transaction);
  } catch (error) {
    console.error('Error sending USDT:', error);
  }
}

sendUsdt();
