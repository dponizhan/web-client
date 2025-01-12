const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',

  // key-value
  SET_KV_ENTRY_GENERAL_ROLE_ID: 'SET_KV_ENTRY_GENERAL_ROLE_ID',
  SET_KV_ENTRY_CORPORATE_ROLE_ID: 'SET_KV_ENTRY_CORPORATE_ROLE_ID',
  SET_KV_ENTRY_UNVERIFIED_ROLE_ID: 'SET_KV_ENTRY_UNVERIFIED_ROLE_ID',
  SET_KV_ENTRY_BLOCKED_ROLE_ID: 'SET_KV_ENTRY_BLOCKED_ROLE_ID',
  SET_KV_ENTRY_US_VERIFIED_ROLE_ID: 'SET_KV_ENTRY_US_VERIFIED_ROLE_ID',
  SET_KV_ENTRY_US_ACCREDITED_ROLE_ID: 'SET_KV_ENTRY_US_ACCREDITED_ROLE_ID',
  SET_KV_ASSET_TYPE_DEFAULT: 'SET_KV_ASSET_TYPE_DEFAULT',
  SET_KV_ASSET_TYPE_KYC_REQUIRED: 'SET_KV_ASSET_TYPE_KYC_REQUIRED',
  SET_KV_ASSET_TYPE_SECURITY: 'SET_KV_ASSET_TYPE_SECURITY',
  SET_KV_POLL_TYPE_RESTRICTED: 'SET_KV_POLL_TYPE_RESTRICTED',
  SET_KV_POLL_TYPE_UNRESTRICTED: 'SET_KV_POLL_TYPE_UNRESTRICTED',

  SET_DEFAULT_QUOTE_ASSET: 'SET_DEFAULT_QUOTE_ASSET',
  SET_KV_DEFAULT_SIGNER_ROLE_ID: 'SET_KV_DEFAULT_SIGNER_ROLE_ID',

  // account
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_ACCOUNT_BALANCES_DETAILS: 'SET_ACCOUNT_BALANCES_DETAILS',

  // wallet
  SET_WALLET: 'SET_WALLET',
  SET_ENCRYPTED_SECRET_SEED: 'SET_ENCRYPTED_SECRET_SEED',

  // factors
  SET_FACTORS: 'SET_FACTORS',

  // kyc
  SET_KYC_LATEST_REQUEST: 'SET_KYC_LATEST_REQUEST',
  SET_KYC_RELATED_REQUEST: 'SET_KYC_RELATED_REQUEST',
  SET_KYC_LATEST_DATA: 'SET_KYC_LATEST_DATA',
  SET_ACCOUNT_ROLE_RESETED: 'SET_ACCOUNT_ROLE_RESETED',
  SET_KYC_LATEST_REQUEST_DATA: 'SET_KYC_LATEST_REQUEST_DATA',

  // kyc recovery
  SET_KYC_RECOVERY_LATEST_REQUEST: 'SET_KYC_RECOVERY_LATEST_REQUEST',
  SET_KYC_RECOVERY_LATEST_REQUEST_BLOB: 'SET_KYC_RECOVERY_LATEST_REQUEST_BLOB',

  // assets
  SET_ASSETS: 'SET_ASSETS',
  UPDATE_ASSETS: 'UPDATE_ASSETS',

  // idle
  UPDATE_LOGOUT_AT: 'UPDATE_LOGOUT_AT',

  // identities
  SET_IDENTITIES: 'SET_IDENTITIES',
}

const actions = {
  // root
  LOG_OUT: 'LOG_OUT',
  LOG_IN: 'LOG_IN',
  RESTORE_SESSION: 'RESTORE_SESSION',

  // key-value
  LOAD_KV_ENTRIES: 'LOAD_KV_ENTRIES',
  LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS: 'LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS',

  // account
  LOAD_ACCOUNT: 'LOAD_ACCOUNT',
  LOAD_ACCOUNT_BALANCES_DETAILS: 'LOAD_ACCOUNT_BALANCES_DETAILS',

  // wallet
  LOAD_WALLET: 'LOAD_WALLET',
  STORE_WALLET: 'STORE_WALLET',
  DECRYPT_SECRET_SEED: 'DECRYPT_SECRET_SEED',
  GET_SESSION: 'GET_SESSION',
  PROLONGATE_SESSION: 'PROLONGATE_SESSION',

  // factors
  LOAD_FACTORS: 'LOAD_FACTORS',

  // kyc
  LOAD_KYC: 'LOAD_KYC',
  LOAD_KYC_LATEST_REQUEST: 'LOAD_KYC_LATEST_REQUEST',
  LOAD_KYC_LATEST_REQUEST_DATA: 'LOAD_KYC_LATEST_REQUEST_DATA',
  LOAD_KYC_RELATED_REQUEST: 'LOAD_KYC_RELATED_REQUEST',
  LOAD_KYC_LATEST_DATA: 'LOAD_KYC_LATEST_DATA',

  // kyc recovery
  LOAD_KYC_RECOVERY_LATEST_REQUEST: 'LOAD_KYC_RECOVERY_LATEST_REQUEST',
  LOAD_KYC_RECOVERY: 'LOAD_KYC_RECOVERY',
  LOAD_KYC_RECOVERY_LATEST_REQUEST_BLOB:
    'LOAD_KYC_RECOVERY_LATEST_REQUEST_BLOB',
  SEND_KYC_RECOVERY_REQUEST: 'SEND_KYC_RECOVERY_REQUEST',

  // assets
  LOAD_ASSETS: 'LOAD_ASSETS',

  // idle
  START_IDLE: 'START_IDLE',
  LOGOUT_IDLE: 'LOGOUT_IDLE',
  INIT_IDLE_TICKER: 'INIT_IDLE_TICKER',
  KEEP_SESSION: 'KEEP_SESSION',
  LOGOUT_SESSION: 'LOGOUT_SESSION',

  // identities
  LOAD_IDENTITIES_BY_ACCOUNT_ID: 'LOAD_IDENTITIES_BY_ACCOUNT_ID',
}

const getters = {
  // root
  isLoggedIn: 'isLoggedIn',

  // key-values
  kvEntryGeneralRoleId: 'kvEntryGeneralRoleId',
  kvEntryCorporateRoleId: 'kvEntryCorporateRoleId',
  kvEntryUnverifiedRoleId: 'kvEntryUnverifiedRoleId',
  kvEntryBlockedRoleId: 'kvEntryBlockedRoleId',
  kvEntryUsVerifiedRoleId: 'kvEntryUsVerifiedRoleId',
  kvEntryUsAccreditedRoleId: 'kvEntryUsAccreditedRoleId',
  kvAssetTypeDefault: 'kvAssetTypeDefault',
  kvAssetTypeKycRequired: 'kvAssetTypeKycRequired',
  kvAssetTypeSecurity: 'kvAssetTypeSecurity',
  kvPollTypeRestricted: 'kvPollTypeRestricted',
  kvPollTypeUnrestricted: 'kvPollTypeUnrestricted',
  defaultQuoteAsset: 'defaultQuoteAsset',
  kvDefaultSignerRoleId: 'kvDefaultSignerRoleId',

  // account
  account: 'account',
  accountId: 'accountId',
  accountBalances: 'accountBalances',
  accountOwnedAssetsBalances: 'accountOwnedAssetsBalances',
  accountBalanceByCode: 'accountBalanceByCode',
  accountRoleId: 'accountRoleId',
  accountDepositAddresses: 'accountDepositAddresses',
  accountKycRecoveryStatus: 'accountKycRecoveryStatus',

  isAccountGeneral: 'isAccountGeneral',
  isAccountCorporate: 'isAccountCorporate',
  isAccountUsAccredited: 'isAccountUsAccredited',
  isAccountUsVerified: 'isAccountUsVerified',
  isAccountUnverified: 'isAccountUnverified',
  isAccountBlocked: 'isAccountBlocked',

  // wallet
  walletId: 'walletId',
  walletAccountId: 'walletAccountId',
  walletEmail: 'walletEmail',
  sessionId: 'sessionId',
  encryptedSecretSeed: 'encryptedSecretSeed',
  walletPublicKey: 'walletPublicKey',

  // factors
  factors: 'factors',
  factorsTotp: 'factorsTotp',
  factorsPassword: 'factorsPassword',
  factorsEmail: 'factorsEmail',
  factorsTotpEnabled: 'factorsTotpEnabled',
  isTotpEnabled: 'isTotpEnabled',

  // kyc
  kycState: 'kycState',
  kycStateI: 'kycStateI',
  kycRequestId: 'kycRequestId',
  kycRequestRejectReason: 'kycRequestRejectReason',
  kycRequestResetReason: 'kycRequestResetReason',
  kycRequestExternalDetails: 'kycRequestExternalDetails',
  kycRequestBlockReason: 'kycRequestBlockReason',
  kycAccountRoleToSet: 'kycAccountRoleToSet',
  kycPreviousRequestAccountRoleToSet: 'kycPreviousRequestAccountRoleToSet',
  kycLatestData: 'kycLatestData',
  kycLatestRequestBlobId: 'kycLatestRequestBlobId',
  kycLatestRequestData: 'kycLatestRequestData',
  kycAvatarKey: 'kycAvatarKey',
  isAccountRoleReseted: 'isAccountRoleReseted',

  // kyc recovery
  kycRecoveryRequestId: 'kycRecoveryRequestId',
  kycRecoveryState: 'kycRecoveryState',
  kycRecoveryStateI: 'kycRecoveryStateI',
  kycRecoveryRequestBlob: 'kycRecoveryRequestBlob',
  kycRecoveryRejectReason: 'kycRecoveryRejectReason',
  kycRecoveryBlobId: 'kycRecoveryBlobId',
  isNoKycRecoveryInProgress: 'isNoKycRecoveryInProgress',
  isKycRecoveryInProgress: 'isKycRecoveryInProgress',
  isKycRecoveryInited: 'isKycRecoveryInited',
  isKycRecoveryApproved: 'isKycRecoveryApproved',
  isKycRecoveryPending: 'isKycRecoveryPending',
  isKycRecoveryRejected: 'isKycRecoveryRejected',
  isKycRecoveryPermanentlyRejected: 'isKycRecoveryPermanentlyRejected',

  // assets
  assets: 'assets',
  assetByCode: 'assetByCode',
  assetsByOwner: 'assetsByOwner',
  balancesAssets: 'balancesAssets',
  balancesAssetsByOwner: 'balancesAssetsByOwner',
  fiatAssets: 'fiatAssets',
  depositableAssets: 'depositableAssets',
  coinpaymentsAssets: 'coinpaymentsAssets',
  transferableBalancesAssets: 'transferableBalancesAssets',
  withdrawableBalancesAssets: 'withdrawableBalancesAssets',
  statsQuoteAsset: 'statsQuoteAsset',
  ownedAssets: 'ownedAssets',
  ownedBalancesAssets: 'ownedBalancesAssets',
  baseAtomicSwapBalancesAssets: 'baseAtomicSwapBalancesAssets',
  quoteAtomicSwapAssets: 'quoteAtomicSwapAssets',

  // idle-handler
  logoutAt: 'logoutAt',

  // identitys
  usersIdentities: 'usersIdentities',
  emailByAccountId: 'emailByAccountId',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
