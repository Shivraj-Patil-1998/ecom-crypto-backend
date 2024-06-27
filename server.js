global.__basedir = __dirname;
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

const allowedOrigins = ['https://simplileapdigital.com'];

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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());


const port = 8000;
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
const models = require('./models/');

// const { Transactions, sequelize } = models;

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
