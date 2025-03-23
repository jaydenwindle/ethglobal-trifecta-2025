//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AppAttestCertManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const appAttestCertManagerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'CERT_ALGO_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CERT_ALGO_OID_256',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EC_PUB_KEY_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_CA_CERT',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_CA_CERT_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SECP_256_R1_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SECP_384_R1_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'b', internalType: 'bytes', type: 'bytes' }],
    name: 'bytesToUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'certPubKey',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'finv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fmul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oinv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'omul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'verifiedBy',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'certificate', internalType: 'bytes', type: 'bytes' },
      { name: 'parentCertHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'verifyCert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'certificate', internalType: 'bytes', type: 'bytes' },
      { name: 'cabundle', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'verifyCertBundle',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'certHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'message', internalType: 'bytes', type: 'bytes' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'verifyP256SignedData',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'time', internalType: 'bytes', type: 'bytes' }],
    name: 'yymmddhhmmssTots',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'certHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'certificate',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'certPubKey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'parentCertHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'parentPubKey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'CertificateVerified',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'certHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'certPubKey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      { name: 'message', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'r', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 's', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'SignedDataVerified',
  },
  { type: 'error', inputs: [], name: 'SignedDataInvalid' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CertManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const certManagerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'CERT_ALGO_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EC_PUB_KEY_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_CA_CERT',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_CA_CERT_HASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SECP_384_R1_OID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'b', internalType: 'bytes', type: 'bytes' }],
    name: 'bytesToUint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'certPubKey',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'finv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fmul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oinv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'omul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'verifiedBy',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'certificate', internalType: 'bytes', type: 'bytes' },
      { name: 'parentCertHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'verifyCert',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'certificate', internalType: 'bytes', type: 'bytes' },
      { name: 'cabundle', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'verifyCertBundle',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'time', internalType: 'bytes', type: 'bytes' }],
    name: 'yymmddhhmmssTots',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'certHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'certificate',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'certPubKey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: 'parentCertHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'parentPubKey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'CertificateVerified',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Curve384
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const curve384Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'finv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fmul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oinv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'omul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FieldO384
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fieldO384Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'oinv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'omul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'osub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FieldP384
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fieldP384Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fadd',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'finv',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fmul',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsqr',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'ahi', internalType: 'uint256', type: 'uint256' },
      { name: 'alo', internalType: 'uint256', type: 'uint256' },
      { name: 'bhi', internalType: 'uint256', type: 'uint256' },
      { name: 'blo', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fsub',
    outputs: [
      { name: 'hi', internalType: 'uint256', type: 'uint256' },
      { name: 'lo', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// P256
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const p256Abi = [
  { type: 'error', inputs: [], name: 'P256VerificationFailed' },
] as const
