import { Addresses } from './types'

export const addresses: Addresses = {
  bonders: ['0xad103c0928aCfde91Dfd4E9E21225bcf9c7cbE62'],
  bridges: {
    USDC: {
      ethereum: {
        l1CanonicalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        l1Bridge: '0x72209Fe68386b37A40d6bCA04f78356fd342491f',
        bridgeDeployedBlockNumber: 12820652
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0x5C32143C8B198F392d01f8446b754c181224ac26',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
        l2Bridge: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
        l2HopBridgeToken: '0x74fa978EaFFa312bC92e76dF40FcC1bFE7637Aeb',
        l2AmmWrapper: '0x7D269D3E0d61A05a0bA976b7DBF8805bF844AF3F',
        l2SaddleSwap: '0x022C5cE6F1Add7423268D41e08Df521D5527C2A0',
        l2SaddleLpToken: '0x3b507422EBe64440f03BCbE5EEe4bdF76517f320',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 17055334
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
        l2CanonicalBridge: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2CanonicalToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        l2Bridge: '0xe28EA9254a9A433EC4E92227c498A1CeAD8210C2',
        l2HopBridgeToken: '0xe7F40BF16AB09f4a6906Ac2CAA4094aD2dA48Cc2',
        l2AmmWrapper: '0xCb5DDFb8D0038247Dc0bEeeCAa7f3457bEFcb77c',
        l2SaddleSwap: '0x4AD8db323F6EBEC4DEb53140FfC7dDb22DE5f607',
        l2SaddleLpToken: '0xC37fA2448eb8ddd54e50D11D9fF4b82F1D01d7Dc',
        l1FxBaseRootTunnel: '0x3c0FFAca566fCcfD9Cc95139FEF6CBA143795963',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 16828103
      }
    },
    MATIC: {
      ethereum: {
        l1CanonicalToken: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        l1Bridge: '0x30E344C8F517becAEEd04245ceD2e7301f06f21b',
        bridgeDeployedBlockNumber: 12948234
      },
      xdai: {
        l1CanonicalBridge: '0x88ad09518695c6c3712AC10a214bE5109a655671',
        l1MessengerWrapper: '0xB143f7124d57987CD8A6Bd9dce36b00f56FE02B7',
        l2CanonicalBridge: '0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
        l2CanonicalToken: '0x7122d7661c4564b7C6Cd4878B06766489a6028A2',
        l2Bridge: '0x69a71b7F6Ff088a0310b4f911b4f9eA11e2E9740',
        l2HopBridgeToken: '0xC08055b634D43F2176d721E26A3428D3b7E7DdB5',
        l2AmmWrapper: '0x5030ba8A08bb5ac11567E4E8e129285abD298b4E',
        l2SaddleSwap: '0x262531C7CACe5a0095bf12c238cb805a147AC002',
        l2SaddleLpToken: '0x8577A442c2d8893Ca9f3633A9864D1c02e4c89E4',
        l1Amb: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
        l2Amb: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
        canonicalBridgeMaxPerTx: 1000000000,
        bridgeDeployedBlockNumber: 17387756
      },
      polygon: {
        l1CanonicalBridge: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1MessengerWrapper: '0xa08899fE012395864F0684b8ba8a0b1B3DE0FCB3',
        l2CanonicalBridge: '0x0000000000000000000000000000000000001010',
        l2CanonicalToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        l2Bridge: '0xF6f46250caF9A19799D3F425A9442118171CEe55',
        l2HopBridgeToken: '0xb07c6505e1E41112494123e40330c5Ac09817CFB',
        l2AmmWrapper: '0x767Ac80604C0bD51fD56bDA44d2fB7dD72633A14',
        l2SaddleSwap: '0x70aF36240eC5040f6f9501E8E2D9db8703ec3d45',
        l2SaddleLpToken: '0xaFF3e3c6ef00Ca81F3d3e4c404300C52C5eF78A3',
        l1FxBaseRootTunnel: '0xa08899fE012395864F0684b8ba8a0b1B3DE0FCB3',
        l1PosRootChainManager: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
        l1PosPredicate: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        bridgeDeployedBlockNumber: 17549453
      }
    }
  }
}