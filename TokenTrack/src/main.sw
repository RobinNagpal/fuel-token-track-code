// Define the contract 
contract;

// Import the `Hash` trait from the standard library, which is required for using `Identity` as a key in the storage map
use std::{hash::Hash,};

// Define storage variables for the contract
storage {
    // `balances` is a StorageMap that maps identities to their u64 balances
    contract_balances: StorageMap<ContractId, u64> = StorageMap::<ContractId, u64> {},
    address_balances: StorageMap<Address, u64> = StorageMap::<Address, u64> {},
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

    // Function to retrieve the storage key for the balances map
    #[storage(read)]
    fn get_address_balances() -> StorageKey<StorageMap<Address, u64>>;
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
            Identity::ContractId(id) => transfer_to_contract(id, amount),
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
        // Access the sender's balance (or initialize it to 0 if it doesn't exist)
        let mut from_balance = storage.address_balances.get(from).try_read().unwrap_or(0);

        // Ensure sufficient balance before transferring
        assert(from_balance >= coins);

        // Update the sender's balance after transferring
        from_balance -= coins;

        // Access the recipient's balance (or initialize it to 0 if it doesn't exist)
        let mut target_balance = storage.address_balances.get(target).try_read().unwrap_or(0);

        // Update the recipient's balance with the transferred amount
        target_balance += coins;

        // Store the updated balances back in the storage map
        storage.address_balances.insert(from, from_balance);
        storage.address_balances.insert(target, target_balance);
    }

    // Placeholder function for transferring tokens to a contract (not implemented yet)
    #[storage(read, write)]
    fn transfer_coins_to_contract(coins: u64, from: ContractId, target: ContractId) {
        // Access the sender's balance (or initialize it to 0 if it doesn't exist)
        let mut from_balance = storage.contract_balances.get(from).try_read().unwrap_or(0);

        // Ensure sufficient balance before transferring
        assert(from_balance >= coins);

        // Update the sender's balance after transferring
        from_balance -= coins;

        // Access the recipient's balance (or initialize it to 0 if it doesn't exist)
        let mut target_balance = storage.contract_balances.get(target).try_read().unwrap_or(0);

        // Update the recipient's balance with the transferred amount
        target_balance += coins;

        // Store the updated balances back in the storage map
        storage.contract_balances.insert(from, from_balance);
        storage.contract_balances.insert(target, target_balance);
    }

    // Function to retrieve the storage key for the balances map
    #[storage(read)]
    fn get_address_balances() -> StorageKey<StorageMap<Address, u64>> {
        // Return the storage key for the balances map
        return storage.address_balances;
    }
}

#[storage(read, write)]
fn transfer_to_address(addr: Address, amount: u64) {
    let mut balance = storage.address_balances.get(addr).try_read().unwrap_or(0);
    balance += amount;
    storage.address_balances.insert(addr, balance);
}

#[storage(read, write)]
fn transfer_to_contract(addr: ContractId, amount: u64) {
    let mut balance = storage.contract_balances.get(addr).try_read().unwrap_or(0);
    balance += amount;
    storage.contract_balances.insert(addr, balance);
}

#[storage(read, write)]
fn burn_from_address(addr: Address, amount: u64) {
    // Access the target's balance (or initialize it to 0 if it doesn't exist)
    let mut target_balance = storage.address_balances.get(addr).try_read().unwrap_or(0);

    // Ensure sufficient balance before burning
    assert(target_balance >= amount);

    // Update the target's balance after burning
    target_balance -= amount;

    // Store the updated balance back in the storage map
    storage.address_balances.insert(addr, target_balance);
}

#[storage(read, write)]
fn burn_from_contract(addr: ContractId, amount: u64) {
    // Access the target's balance (or initialize it to 0 if it doesn't exist)
    let mut target_balance = storage.contract_balances.get(addr).try_read().unwrap_or(0);

    // Ensure sufficient balance before burning
    assert(target_balance >= amount);

    // Update the target's balance after burning
    target_balance -= amount;

    // Store the updated balance back in the storage map
    storage.contract_balances.insert(addr, target_balance);
}
