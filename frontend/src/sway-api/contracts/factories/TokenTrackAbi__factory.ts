/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.82.0
  Forc version: 0.49.3
  Fuel-Core version: 0.22.1
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot } from "fuels";
import type { TokenTrackAbi, TokenTrackAbiInterface } from "../TokenTrackAbi";

const _abi = {
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "enum Identity",
      "components": [
        {
          "name": "Address",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "ContractId",
          "type": 7,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "generic K",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "generic V",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "struct Address",
      "components": [
        {
          "name": "value",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "struct StorageKey",
      "components": [
        {
          "name": "slot",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "offset",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "field_id",
          "type": 1,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        4
      ]
    },
    {
      "typeId": 9,
      "type": "struct StorageMap",
      "components": [],
      "typeParameters": [
        3,
        5
      ]
    },
    {
      "typeId": 10,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "target",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "amount",
          "type": 10,
          "typeArguments": null
        }
      ],
      "name": "burn",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_address_balances",
      "output": {
        "name": "",
        "type": 8,
        "typeArguments": [
          {
            "name": "",
            "type": 9,
            "typeArguments": [
              {
                "name": "",
                "type": 6,
                "typeArguments": null
              },
              {
                "name": "",
                "type": 10,
                "typeArguments": null
              }
            ]
          }
        ]
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "recipient",
          "type": 2,
          "typeArguments": null
        },
        {
          "name": "amount",
          "type": 10,
          "typeArguments": null
        }
      ],
      "name": "mint",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "addr",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "read_addr_balance",
      "output": {
        "name": "",
        "type": 10,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "addr",
          "type": 7,
          "typeArguments": null
        }
      ],
      "name": "read_contract_balance",
      "output": {
        "name": "",
        "type": 10,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "coins",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "from",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "target",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "transfer_coins_to_address",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "coins",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "from",
          "type": 7,
          "typeArguments": null
        },
        {
          "name": "target",
          "type": 7,
          "typeArguments": null
        }
      ],
      "name": "transfer_coins_to_contract",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [],
  "messagesTypes": [],
  "configurables": []
};

const _storageSlots: StorageSlot[] = [
  {
    "key": "b48b753af346966d0d169c0b2e3234611f65d5cfdb57c7b6e7cd6ca93707bee0",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export class TokenTrackAbi__factory {
  static readonly abi = _abi;

  static readonly storageSlots = _storageSlots;

  static createInterface(): TokenTrackAbiInterface {
    return new Interface(_abi) as unknown as TokenTrackAbiInterface
  }

  static connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): TokenTrackAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as TokenTrackAbi
  }

  static async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<TokenTrackAbi> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    const { storageSlots } = TokenTrackAbi__factory;

    const contract = await factory.deployContract({
      storageSlots,
      ...options,
    });

    return contract as unknown as TokenTrackAbi;
  }
}