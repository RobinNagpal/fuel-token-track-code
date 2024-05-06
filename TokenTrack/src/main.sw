// Define the contract 
contract;

// Import the `Hash` trait from the standard library, which is required for using `Identity` as a key in the storage map
use std::{hash::Hash,};

// Define storage variables for the contract
storage {
    // `balances` is a StorageMap that maps identities to their u64 balances
    balances: StorageMap<Identity, u64> = StorageMap::<Identity, u64> {},
    // `total_supply` stores the total number of tokens in circulation
    total_supply: u64 = 0,
}

// Define the contract's ABI (Application Binary Interface)
abi MyContract {
    // Function to mint new tokens for a specific recipient with an amount
    #[storage(read, write)]
    fn mint(recipient: Identity, amount: u64);

    // Function to burn tokens from a specific identity's balance
    #[storage(read, write)]
    fn burn(target: Identity, amount: u64);

    // Function to transfer tokens between two identities
    #[storage(read, write)]
    fn transfer_coins_to_address(coins: u64, from: Address, target: Address);

    // Function to transfer tokens to a contract (not implemented yet)
    #[storage(read, write)]
    fn transfer_coins_to_contract(coins: u64, from: ContractId, target: ContractId);

    #[storage(read)]
    fn read_addr_balance(addr: Address) -> u64;

    #[storage(read)]
    fn read_contract_balance(addr: ContractId) -> u64;
}

// Implement the `MyContract` trait for this contract
impl MyContract for Contract {
    // Implementation of the `mint` function
    #[storage(read, write)]
    fn mint(recipient: Identity, amount: u64) {
        // Read the current total supply from storage
        storage
            .total_supply
            .write(amount + storage.total_supply.read());

        match recipient {
            Identity::Address(addr) => transfer_to_address(addr, amount),
            Identity::ContractId(addr) => transfer_to_contract(addr, amount),
        };
    }

    // Implementation of the `burn` function
    #[storage(read, write)]
    fn burn(target: Identity, amount: u64) {
        // Read the current total supply from storage
        storage
            .total_supply
            .write(storage.total_supply.read() - amount);

        match target {
            Identity::Address(addr) => burn_from_address(addr, amount),
            Identity::ContractId(id) => burn_from_contract(id, amount),
        };
    }

    // Implementation of the `transfer_coins_to_address` function
    #[storage(read, write)]
    fn transfer_coins_to_address(coins: u64, from: Address, target: Address) {
        let b256_addr_from = from.into();
        // Access the sender's balance (or initialize it to 0 if it doesn't exist)
        let identity_from: Identity = Identity::Address(Address::from(b256_addr_from)); // Casting Address to Identity
        let mut from_balance = storage.balances.get(identity_from).try_read().unwrap_or(0);

        // Ensure sufficient balance before transferring
        require(from_balance >= coins, "Not enough tokens");

        // Update the sender's balance after transferring
        from_balance -= coins;

        let b256_addr_to = target.into();
        // Access the recipient's balance (or initialize it to 0 if it doesn't exist)
        let identity_to: Identity = Identity::Address(Address::from(b256_addr_to)); // Casting Address to Identity
        let mut target_balance = storage.balances.get(identity_to).try_read().unwrap_or(0);

        // Update the recipient's balance with the transferred amount
        target_balance += coins;

        // Store the updated balances back in the storage map
        storage.balances.insert(identity_from, from_balance);
        storage.balances.insert(identity_to, target_balance);
    }

    // Placeholder function for transferring tokens to a contract (not implemented yet)
    #[storage(read, write)]
    fn transfer_coins_to_contract(coins: u64, from: ContractId, target: ContractId) {
        let b256_addr_from = from.into();
        // Access the sender's balance (or initialize it to 0 if it doesn't exist)
        let identity_from: Identity = Identity::ContractId(ContractId::from(b256_addr_from)); // Casting ContractId to Identity
        let mut from_balance = storage.balances.get(identity_from).try_read().unwrap_or(0);

        // Ensure sufficient balance before transferring
        assert(from_balance >= coins);

        // Update the sender's balance after transferring
        from_balance -= coins;

        let b256_addr_to = target.into();
        // Access the recipient's balance (or initialize it to 0 if it doesn't exist)
        let identity_to: Identity = Identity::ContractId(ContractId::from(b256_addr_to)); // Casting ContractId to Identity
        let mut target_balance = storage.balances.get(identity_to).try_read().unwrap_or(0);

        // Update the recipient's balance with the transferred amount
        target_balance += coins;

        // Store the updated balances back in the storage map
        storage.balances.insert(identity_from, from_balance);
        storage.balances.insert(identity_to, target_balance);
    }

    #[storage(read)]
    fn read_addr_balance(addr: Address) -> u64 {
        let b256_addr = addr.into();
        let identity: Identity = Identity::Address(Address::from(b256_addr)); // Casting Address to Identity
        return storage.balances.get(identity).try_read().unwrap_or(0);
    }

    #[storage(read)]
    fn read_contract_balance(addr: ContractId) -> u64 {
        let b256_addr = addr.into();
        let identity: Identity = Identity::ContractId(ContractId::from(b256_addr)); // Casting Address to Identity
        return storage.balances.get(identity).try_read().unwrap_or(0);
    }
}

#[storage(read, write)]
fn transfer_to_address(addr: Address, amount: u64) {
    let b256_addr = addr.into();
    // Access the sender's balance (or initialize it to 0 if it doesn't exist)
    let identity: Identity = Identity::Address(Address::from(b256_addr)); // Casting Address to Identity
    let mut balance = storage.balances.get(identity).try_read().unwrap_or(0);
    balance += amount;
    storage.balances.insert(identity, balance);
}

#[storage(read, write)]
fn transfer_to_contract(addr: ContractId, amount: u64) {
    let b256_addr = addr.into();
    let identity: Identity = Identity::ContractId(ContractId::from(b256_addr)); // Casting Address to Identity
    let mut balance = storage.balances.get(identity).try_read().unwrap_or(0);
    balance += amount;
    storage.balances.insert(identity, balance);
}

#[storage(read, write)]
fn burn_from_address(addr: Address, amount: u64) {
    let b256_addr = addr.into();
    let identity: Identity = Identity::Address(Address::from(b256_addr)); // Casting Address to Identity
    // Access the target's balance (or initialize it to 0 if it doesn't exist)
    let mut target_balance = storage.balances.get(identity).try_read().unwrap_or(0);

    // Ensure sufficient balance before burning
    assert(target_balance >= amount);

    // Update the target's balance after burning
    target_balance -= amount;

    // Store the updated balance back in the storage map
    storage.balances.insert(identity, target_balance);
}

#[storage(read, write)]
fn burn_from_contract(addr: ContractId, amount: u64) {
    let b256_addr = addr.into();
    let identity: Identity = Identity::ContractId(ContractId::from(b256_addr)); // Casting Address to Identity
    // Access the target's balance (or initialize it to 0 if it doesn't exist)
    let mut target_balance = storage.balances.get(identity).try_read().unwrap_or(0);

    // Ensure sufficient balance before burning
    assert(target_balance >= amount);

    // Update the target's balance after burning
    target_balance -= amount;

    // Store the updated balance back in the storage map
    storage.balances.insert(identity, target_balance);
}
