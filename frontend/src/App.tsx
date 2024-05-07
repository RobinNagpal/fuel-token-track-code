import { useEffect, useState } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { Address, BN } from "fuels";
import { TokenTrackAbi__factory } from "./sway-api";
import type { TokenTrackAbi } from "./sway-api";

const CONTRACT_ID =
  "0x07127c7516ac184724e0a549fa7b3bc0305e4526815821730b882c6ef8eda901";

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
  const [burnAddress, setBurnAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [burnType, setBurnType] = useState("Address");
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

    connectContract();
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
        .call();
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

  const handleBurnFromAddress = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(burnAddress);
      const addressInput = { value: address.toB256() };
      await contract.functions
        .burn_from_address(addressInput, Number(burnAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setBurnAddress("");
    setBurnAmount("");
  };

  const handleBurnFromContract = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(burnAddress);
      const addressInput = { value: address.toB256() };
      await contract.functions
        .burn_from_contract(addressInput, Number(burnAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
    setBurnAddress("");
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
            <button onClick={handleTransferToAddress}>Transfer Tokens</button>
          </div>

          <div className="form-field">
            <input
              type="text"
              value={burnAddress}
              onChange={(e) => setBurnAddress(e.target.value)}
              placeholder="Address to burn"
            />
            <input
              type="number"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder="Amount to burn"
            />
            <select
              value={burnType}
              onChange={(e) => setBurnType(e.target.value)}
              style={{ marginRight: "10px" }}
            >
              <option value="Address">Address</option>
              <option value="Contract">Contract</option>
            </select>
            <button
              onClick={
                burnType == "Address"
                  ? handleBurnFromAddress
                  : handleBurnFromContract
              }
            >
              Burn Tokens
            </button>
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
