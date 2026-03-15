export const stakeholderMethods = {
  registerStakeholder: {
    name: "registerStakeholder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "role", type: "string" },
      { name: "location", type: "string" },
      { name: "detailsIPFSURL", type: "string" },
      { name: "license", type: "string" }
    ],
    outputs: []
  } as const,

  updateRegistration: {
    name: "updateRegistration",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "location", type: "string" },
      { name: "role", type: "string"},
      { name: "detailsIPFSURL", type: "string" },
      { name: "license", type: "string" }
    ],
    outputs: []
  } as const,

  getStakeholder: {
    name: "getStakeholder",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        components: [
          { name: "user", type: "address" },
          { name: "name", type: "string" },
          { name: "role", type: "bytes32" },
          { name: "location", type: "string" },
          { name: "detailsIPFSURL", type: "string" },
          { name: "license", type: "string" },
          { name: "approved", type: "bool" },
          { name: "exists", type: "bool" }
        ],
        name: "",
        type: "tuple"
      }
    ]
  } as const,

  approveStakeholder: {
    name: "approveStakeholder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "user", type: "address" }],
    outputs: []
  } as const,

  rejectStakeholder: {
    name: "rejectStakeholder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "user", type: "address" }],
    outputs: []
  } as const,

  getRegistrationQueue: {
    name: "getRegistrationQueue",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }]
  } as const,

  stakeholders: {
    name: "stakeholders",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "user", type: "address" },
      { name: "name", type: "string" },
      { name: "role", type: "bytes32" },
      { name: "location", type: "string" },
      { name: "detailsIPFSURL", type: "string" },
      { name: "license", type: "string" },
      { name: "approved", type: "bool" },
      { name: "exists", type: "bool" }
    ]
  } as const,

  /* -------- AUTO GENERATED GETTERS -------- */

  registrationQueue: {
    name: "registrationQueue",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ name: "", type: "address" }]
  } as const,

  registrationQueueIndex: {
    name: "registrationQueueIndex",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  } as const,

  isInRegistrationQueue: {
    name: "isInRegistrationQueue",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  } as const,

  stakeholdersByRole: {
    name: "stakeholdersByRole",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "role", type: "bytes32" },
      { name: "index", type: "uint256" }
    ],
    outputs: [{ name: "", type: "address" }]
  } as const,

  hasRole: {
    name: "hasRole",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "role", type: "bytes32" }, { name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  } as const,

  revokeRole: {
    name: "revokeRole",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "role", type: "bytes32" }, { name: "user", type: "address" }],
    outputs: []
  } as const,

  getAllStakeholders: {
    name: "getAllStakeholders",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "user", type: "address" },
          { name: "name", type: "string" },
          { name: "role", type: "bytes32" },
          { name: "location", type: "string" },
          { name: "detailsIPFSURL", type: "string" },
          { name: "license", type: "string" },
          { name: "approved", type: "bool" },
          { name: "exists", type: "bool" }
        ]
      }
    ]
  } as const,
};