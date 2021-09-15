import BigNumber from "bignumber.js/bignumber";

export const SUBTRACT_GAS_LIMIT = 100000;

const ONE_MINUTE_IN_SECONDS = new BigNumber(60);
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60);
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24);
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365);

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber("4294967295"), // 2**32-1
  ONES_127: new BigNumber("340282366920938463463374607431768211455"), // 2**128-1
  ONES_255: new BigNumber("115792089237316195423570985008687907853269984665640564039457584007913129639935"), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber("1e18"),
};

export const addressMap = {
  uniswapFactory: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
  uniswapFactoryV2: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  YFI: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  YCRV: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
  UNIAmpl: "0xc5be99a02c6857f9eac67bbce58df5572498f40c",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  UNIRouter: "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  MKR: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  SNX: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
  COMP: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
  LEND: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03",
  TACOYCRV: "0x2C7a51A357d5739C5C74Bf3C96816849d2c9F726",
};

export const contractAddresses = {
  etaco: {
    // 3: '0x253E8Aa11D65f91af5b47e87efDAf369E1C1C413',
    1: "0xC97b96098bd6DE2B1F5aC954F9E94Ef0BAA2Ed05",
  },
  taco: {
    // 1: '0x41C028a4C1F461eBFC3af91619b240004ebAD216',
    3: "0x253E8Aa11D65f91af5b47e87efDAf369E1C1C413",
    1: "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690",
  },
  masterChef: {
    // 1: '0x7F7710e0c7C5C0FF043963dd22C3988e8bDb7AcC',
    3: "0xc9B52a983A2115C961700c1cB4fec4F0c43f37F9",
    1: "0x502C28F523636251BEEFf8bCd5023eCd1bBb8B3A",
  },
  weth: {
    // 1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    3: "0xc778417e063141139fce010982780140aa0cd5ab",
    1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  migrator: {
    1: "0x218b46dbd9aeBf08c8940307CD9d01395730080d",
  },
};

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      1: "0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC",
      3: "0xB16789a451F97C1A37EE5c7bfbA86B0ae1cff0e7",
    },
    tokenAddresses: {
      1: "0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC",
      3: "0xB16789a451F97C1A37EE5c7bfbA86B0ae1cff0e7",
    },
    name: "CRD Hodlers",
    symbol: "CRD",
    tokenSymbol: "CRD",
    price: 0.0000537472,
    icon: "🥇",
    active: true,
    external: false,
  },
  {
    pid: 1,
    lpAddresses: {
      1: "0x526914CE1611849b9e1133Ff8F8b03A8fAa295Cb",
      3: "0xd35d3560b51273361a5feb0183619a4b53cb683b",
    },
    tokenAddresses: {
      1: "0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC",
      3: "0x253e8aa11d65f91af5b47e87efdaf369e1c1c413",
    },
    name: "CRD-ETH Uniswap",
    symbol: "CRD-ETH UNI-V2 LP",
    tokenSymbol: "CRD",
    icon: "💧",
    active: true,
    external: true,
  },
  {
    pid: 18,
    lpAddresses: {
      1: "0x6919934c61bee0e0e019a0ebdafe6764a9550bb0",
    },
    tokenAddresses: {
      1: "0xC97b96098bd6DE2B1F5aC954F9E94Ef0BAA2Ed05",
    },
    name: "eTACO(v2)-ETH",
    symbol: "eTACO(v2)-ETH TLP",
    tokenSymbol: "eTACO(v2)",
    icon: "🌶️",
    active: true,
    external: false,
  },
  {
    pid: 8,
    lpAddresses: {
      1: "0xD3f85d18206829f917929BbBF738C1e0CE9AF7fC",
    },
    tokenAddresses: {
      1: "0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC",
    },
    name: "CRD-ETH Sushiswap",
    symbol: "ETH-CRD SLP",
    tokenSymbol: "CRD",
    icon: "🔐",
    active: true,
    external: true,
  },

  {
    pid: 10,
    lpAddresses: {
      1: "0xb2d9338C6cfB60e15929251De60a75fF7037203a",
    },
    tokenAddresses: {
      1: "0xcf3c8be2e2c42331da80ef210e9b1b307c03d36a",
    },
    name: "BEPRO-ETH",
    symbol: "BEPRO-ETH TLP",
    tokenSymbol: "BEPRO",
    icon: "⚽",
    active: true,
    external: false,
  },
  {
    pid: 13,
    lpAddresses: {
      1: "0x3cB581Cde877c4024BC1A87E9c90baD8b52c70cc",
    },
    tokenAddresses: {
      1: "0x69A95185ee2a045CDC4bCd1b1Df10710395e4e23",
    },
    name: "ETH-POOLZ",
    symbol: "ETH-POOLZ TLP",
    tokenSymbol: "POOLZ",
    icon: "🕸️",
    active: true,
    external: false,
  },

  {
    pid: 12,
    lpAddresses: {
      1: "0xc20192d7750dd905C2ffb452B381ba6c94eB7617",
    },
    tokenAddresses: {
      1: "0xee573a945B01B788B9287CE062A0CFC15bE9fd86",
    },
    name: "ETH-XED",
    symbol: "ETH-XED TLP",
    tokenSymbol: "XED",
    icon: "🎮",
    active: true,
    external: false,
  },
  {
    pid: 14,
    lpAddresses: {
      1: "0xD6d30D5236494414dbD2aA89F827267eB5A4c9FD",
    },
    tokenAddresses: {
      1: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    name: "LINK-ETH",
    symbol: "LINK-ETH TLP",
    tokenSymbol: "LINK",
    icon: "🔗",
    active: true,
    external: false,
  },
  {
    pid: 15,
    lpAddresses: {
      1: "0xCe19Bd9bADaFdC5474942d3270d6a7198419144d",
    },
    tokenAddresses: {
      1: "0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a",
    },
    name: "ROOK-ETH",
    symbol: "ROOK-ETH TLP",
    tokenSymbol: "ROOK",
    icon: "♜",
    active: true,
    external: false,
  },
  {
    pid: 16,
    lpAddresses: {
      1: "0x76ca25C0b25d5728bedD4bd369430434Ffe945E1",
    },
    tokenAddresses: {
      1: "0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206",
    },
    name: "NEXO-ETH",
    symbol: "NEXO-ETH TLP",
    tokenSymbol: "NEXO",
    icon: "📘",
    active: true,
    external: false,
  },
  {
    pid: 3,
    lpAddresses: {
      1: "0x322925Eee832e47e757a28B9712d5E5C647F7C3B",
    },
    tokenAddresses: {
      1: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    name: "DAI-ETH",
    symbol: "DAI-ETH TLP",
    tokenSymbol: "DAI",
    icon: "🦆",
    active: true,
    external: false,
  },
  {
    pid: 4,
    lpAddresses: {
      1: "0xa8F994bce589058893eb2568E43814f34Cd677f6",
    },
    tokenAddresses: {
      1: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
    },
    name: "SUSHI-ETH",
    symbol: "SUSHI-ETH TLP",
    tokenSymbol: "SUSHI",
    icon: "🍣",
    active: true,
    external: false,
  },
  {
    pid: 5,
    lpAddresses: {
      1: "0x75a8a82570F1379aC83E75C90838e7045e447C55",
    },
    tokenAddresses: {
      1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    name: "USDT-ETH",
    symbol: "USDT-ETH TLP",
    tokenSymbol: "USDT",
    icon: "🦑",
    active: true,
    external: false,
  },
];
