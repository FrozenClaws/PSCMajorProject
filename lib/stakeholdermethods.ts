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
  },

  updateRegistration: {
    name: "updateRegistration",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "location", type: "string" },
      { name: "detailsIPFSURL", type: "string" },
      { name: "license", type: "string" }
    ],
    outputs: []
  },

  getStakeholder: {
    name: "getStakeholder",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" }
    ],
    outputs: [
      {
        components: [
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
  },

  approveStakeholder: {
    name: "approveStakeholder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" }
    ],
    outputs: []
  },

  rejectStakeholder: {
    name: "rejectStakeholder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" }
    ],
    outputs: []
  },

  getRegistrationQueue: {
    name: "getRegistrationQueue",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "", type: "address[]" }
    ]
  },

  stakeholders: {
    name: "stakeholders",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" }
    ],
    outputs: [
      { name: "name", type: "string" },
      { name: "role", type: "bytes32" },
      { name: "location", type: "string" },
      { name: "detailsIPFSURL", type: "string" },
      { name: "license", type: "string" },
      { name: "approved", type: "bool" },
      { name: "exists", type: "bool" }
    ]
  }
};

export function getMethod(methodName: string) {
  return Object.values(stakeholderMethods).find(
    (method) => method.name === methodName
  );
}