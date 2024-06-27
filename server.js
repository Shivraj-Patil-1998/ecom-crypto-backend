global.__basedir = __dirname;
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const models = require('./models/index');
const { WalletName, sequelize } = models;

async function fetchAllowedOrigins() {
  try {
    const wallets = await WalletName.findAll();
    const domains = wallets.map(wallet => wallet.domains);
    console.log(domains)
    return domains;
  } catch (error) {
    console.error('Error fetching allowed origins:', error);
    return []; 
  }
}

fetchAllowedOrigins().then(allowedOrigins => {
  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };

  app.use(cors(corsOptions));

  app.use(express.json());

  const port = process.env.PORT || 8000;

  const balanceRouter = require('./routes/balance');
  const walletRouter = require('./routes/walletCreation');
  const withdrawRouter = require('./routes/withdraw');
  const bitcoinRouter = require('./routes/bitcoinWallet');
  const mnemonicRouter = require('./routes/btcmnemonic');
  const btcbalRouter = require('./routes/btcBalance');
  const loginRoute = require('./routes/login');
  const walletsRoute = require('./routes/walletCreation');
  const subWalletsRoute = require('./routes/subWalletCreation');
  const webhookRoute = require('./routes/webhook');
  const transactions = require('./routes/transactions');
  const balances = require('./routes/balance');
  const adminwallets = require('./routes/adminWallets');
  const customerRoute = require('./routes/customerRoute');
  const ethwebhookRoute = require('./routes/ethwebhook');


// async function createWalletTable() {
//   try {
//     await Transactions.sync({ force: true }); // Use { force: true } to drop existing table and recreate
//     console.log('Transactions table created successfully');
//   } catch (error) {
//     console.error('Error creating Transactions table:', error);
//   } finally {
//     await sequelize.close(); // Close the Sequelize connection when done
//   }
// }
// createWalletTable();

// app.get("/balance", (req, res) => {
//   res.send("Hello, World!");
// });

  // Use your routes
  app.use('/balance', balanceRouter);
  app.use('/createWallet', walletRouter);
  app.use('/withdraw', withdrawRouter);
  app.use('/bitcoin', bitcoinRouter);
  app.use('/mnemonic', mnemonicRouter);
  app.use('/btc-balance', btcbalRouter);
  app.use('/login', loginRoute);
  app.use('/wallets', walletsRoute);
  app.use('/subwallets', subWalletsRoute);
  app.use('/webhooks', webhookRoute);
  app.use('/transactions', transactions);
  app.use('/balance', balances);
  app.use('/adminwallets', adminwallets);
  app.use('/customer', customerRoute);
  app.use('/webhook', ethwebhookRoute);

  // Start server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}).catch(err => {
  console.error('Error fetching allowed origins:', err);
  process.exit(1);
});
