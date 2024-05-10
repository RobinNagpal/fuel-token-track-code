import { useEffect, useState } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { Address, BN } from "fuels";
import { TokenTrackAbi__factory } from "./sway-contracts-api";
import type { TokenTrackAbi } from "./sway-contracts-api";

const CONTRACT_ID =
  "0x450f6e34ba7872d716133327848693872afad44479ea116418ab8714d6ba7082";

export default function Home() {
  const [contract, setContract] = useState<TokenTrackAbi>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [mintType, setMintType] = useState("Address");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferType, setTransferType] = useState("Address");
  const [burnAmount, setBurnAmount] = useState("");
  const [data, setData] = useState<
    { address: string | undefined; identity: string; balance: BN }[]
  >([]);

  useEffect(() => {
    async function connectContract() {
      if (isConnected && wallet) {
        const TokenContract = TokenTrackAbi__factory.connect(
          CONTRACT_ID,
          wallet
        );
        setContract(TokenContract);
      }
    }

    async function getBalance() {
      if (!contract) {
        return;
      }
      try {
        const addressInput = { value: wallet?.address.toB256()! };
        const addressIdentityInput = { Address: addressInput };
        const balance = await contract.functions
          .get_balance(addressIdentityInput)
          .txParams({
            gasPrice: 1,
            gasLimit: 1_000_000,
          })
          .dryRun();
        setData([
          {
            address: wallet?.address.toString(),
            identity: "Address",
            balance: (balance as any).value.words[0],
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    }

    connectContract();
    getBalance();
  }, [isConnected, wallet]);

  const handleMintToAddress = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(mintTo);
      const addressInput = { value: address.toB256() };
      await contract.functions
        .mint_to_address(addressInput, Number(mintAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setMintTo("");
    setMintAmount("");
  };

  const handleMintToContract = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(mintTo);
      const addressInput = { value: address.toB256()! };
      await contract.functions
        .mint_to_contract(addressInput, Number(mintAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setMintTo("");
    setMintAmount("");
  };

  async function getBalance() {
    if (!contract) {
      return;
    }
    try {
      const addressInput = { value: wallet?.address.toB256()! };
      const addressIdentityInput = { Address: addressInput };
      const balance = await contract.functions
        .get_balance(addressIdentityInput)
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .dryRun();
      setData([
        {
          address: wallet?.address.toString(),
          identity: "Address",
          balance: (balance as any).value.words[0],
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleTransferToAddress = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(transferTo);
      const addressInput = { value: address.toB256() };
      const from = { value: wallet?.address.toB256()! };
      await contract.functions
        .transfer_coins_to_address(Number(transferAmount), from, addressInput)
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setTransferAmount("");
    setTransferTo("");
  };

  const handleTransferToContract = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(transferTo);
      const addressInput = { value: address.toB256() };
      const from = { value: wallet?.address.toB256()! };
      await contract.functions
        .transfer_coins_to_contract(Number(transferAmount), from, addressInput)
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setTransferAmount("");
    setTransferTo("");
  };

  const handleBurn = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      await contract.functions
        .burn_token(Number(burnAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setBurnAmount("");
  };

  return (
    <>
      {isConnected ? (
        <div className="token-form">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1>Token Track</h1>
          </div>
          <div className="form-field">
            <input
              type="text"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              placeholder="Address to mint"
            />
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="Amount to mint"
            />
            <select
              value={mintType}
              onChange={(e) => setMintType(e.target.value)}
              style={{ marginRight: "10px" }}
            >
              <option value="Address">Address</option>
              <option value="Contract">Contract</option>
            </select>
            <button
              onClick={
                mintType === "Address"
                  ? handleMintToAddress
                  : handleMintToContract
              }
            >
              Mint New Tokens
            </button>
          </div>

          <div className="form-field">
            <input
              type="text"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              placeholder="Address to transfer to"
            />
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Amount to transfer"
            />
            <select
              value={mintType}
              onChange={(e) => setTransferType(e.target.value)}
              style={{ marginRight: "10px" }}
            >
              <option value="Address">Address</option>
              <option value="Contract">Contract</option>
            </select>
            <button
              onClick={
                transferType === "Address"
                  ? handleTransferToAddress
                  : handleTransferToContract
              }
            >
              Transfer Tokens
            </button>
          </div>

          <div className="form-field">
            <input
              type="number"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder="Amount to burn"
            />
            <button onClick={handleBurn}>Burn Tokens</button>
          </div>

          <h2>Address Table</h2>
          <button onClick={getBalance}>Show Balance</button>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Address
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Identity
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, index: any) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {row.address}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {row.identity}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {row.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <button
          onClick={() => {
            connect();
          }}
          style={styles.button}
        >
          {isConnecting ? "Connecting" : "Connect"}
        </button>
      )}
    </>
  );
}

const styles = {
  button: {
    borderRadius: "8px",
    marginTop: "24px",
    backgroundColor: "#707070",
    fontSize: "16px",
    color: "#ffffffec",
    border: "none",
    outline: "none",
    height: "60px",
    padding: "0 1rem",
    cursor: "pointer",
  },
};
