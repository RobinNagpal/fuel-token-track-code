import { useEffect, useState } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { Address } from "fuels";
// Import the contract factory -- you can find the name in src/contracts/contracts/index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { TokenTrackAbi__factory } from "./sway-api";
import type { TokenTrackAbi } from "./sway-api";

const CONTRACT_ID =
  "0x24aec7f107ddbdf215364a574cf4b8bbc48e30872b0372e03b4bf59143c6f7f5";

export default function Home() {
  const [contract, setContract] = useState<TokenTrackAbi>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferAmountToAddress, setTransferAmountToAddress] = useState("");
  const [burnAddress, setBurnAddress] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [transferAmountToContract, setTransferAmountToContract] = useState("");
  const [transferToContract, setTransferToContract] = useState("");

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

  const handleMint = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(mintTo);
      const addressInput = { value: address.toB256() };
      const addressIdentityInput = { Address: addressInput };
      // const resp = await contract.functions
      //   .read_addr_balance(addressInput)
      //   .txParams({
      //     gasPrice: 1,
      //     gasLimit: 1_000_000,
      //   })
      //   .call();
      // console.log("response: ", resp);
      await contract.functions
        .mint(addressIdentityInput, Number(mintAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransferToAddress = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(transferToAddress);
      const addressInput = { value: address.toB256() };
      const from = { value: wallet?.address.toB256()! };
      await contract.functions
        .transfer_coins_to_address(
          Number(transferAmountToAddress),
          from,
          addressInput
        )
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBurn = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(burnAddress);
      const addressInput = { value: address.toB256() };
      const addressIdentityInput = { Address: addressInput };
      await contract.functions
        .burn(addressIdentityInput, Number(burnAmount))
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransferToContract = async () => {
    if (!contract) {
      return alert("Contract not loaded");
    }
    try {
      const address = Address.fromString(transferToContract);
      const addressInput = { value: address.toB256() };
      const from = { value: wallet?.address.toB256()! };
      await contract.functions
        .transfer_coins_to_contract(
          Number(transferAmountToContract),
          from,
          addressInput
        )
        .txParams({
          gasPrice: 1,
          gasLimit: 1_000_000,
        })
        .call();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isConnected ? (
        <div className="token-form">
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
            <button onClick={handleMint}>Mint New Tokens</button>
          </div>

          <div className="form-field">
            <input
              type="text"
              value={transferToAddress}
              onChange={(e) => setTransferToAddress(e.target.value)}
              placeholder="Address to transfer to"
            />
            <input
              type="number"
              value={transferAmountToAddress}
              onChange={(e) => setTransferAmountToAddress(e.target.value)}
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
            <button onClick={handleBurn}>Burn Tokens</button>
          </div>

          <div className="form-field">
            <input
              type="text"
              value={transferToContract}
              onChange={(e) => setTransferToContract(e.target.value)}
              placeholder="Contract ID to transfer"
            />
            <input
              type="number"
              value={transferAmountToContract}
              onChange={(e) => setTransferAmountToContract(e.target.value)}
              placeholder="Amount to transfer"
            />
            <button onClick={handleTransferToContract}>
              Transfer Tokens to Contract
            </button>
          </div>
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
