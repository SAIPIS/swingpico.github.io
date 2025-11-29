const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Server("https://api.testnet.minepi.com");
const NETWORK_PASSPHRASE = "Pi Testnet";

const ISSUER_SECRET = "SBBTPF26HY3CCJIAJWRL6WA52NWR2SVCIETQ77BNSJPEJSQMZTI34QY6";
const HOME_DOMAIN = "swingpico.github.io";

const issuerKeypair = StellarSdk.Keypair.fromSecret(ISSUER_SECRET);

(async () => {
  try {
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());

    const baseFee = parseInt((await server.feeStats()).fee_charged.max, 10) * 40;

    const setOptionsTransaction = new StellarSdk.TransactionBuilder(issuerAccount, {
      fee: baseFee.toString(),
      networkPassphrase: NETWORK_PASSPHRASE,
      timebounds: await server.fetchTimebounds(90),
    })
      .addOperation(StellarSdk.Operation.setOptions({ homeDomain: HOME_DOMAIN }))
      .build();

    setOptionsTransaction.sign(issuerKeypair);

    await server.submitTransaction(setOptionsTransaction);
    console.log("Home Domain is set successfully for SWINGPI.");
  } catch (err) {
    console.error("Failed to set home domain:", err);
  }
})();