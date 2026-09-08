import { BASE_API_URL } from '@shared/constants/env';

export const apiURLs = {
  auth: {
    login: `${BASE_API_URL}/auth/login` as const,
    register: '/auth/register' as const,
    forgotPassword: '/auth/forgot-password' as const,
    resetPassword: '/auth/reset-password' as const,
    verifyEmail: `${BASE_API_URL}/auth/verify-email` as const,
    resendVerification: `${BASE_API_URL}/auth/resend-verification` as const,
    registerOrgAdmin: `${BASE_API_URL}/auth/register/org-admin` as const,
    registerWorkspaceGuest: `${BASE_API_URL}/auth/register/workspace-guest` as const,
    registerBusiness: `${BASE_API_URL}/auth/register/business` as const,
  },
  security: {
    passkeys: {
      base: `${BASE_API_URL}/auth/passkeys` as const,
      registerOptions: `${BASE_API_URL}/auth/passkeys/register/options` as const,
      registerVerify: `${BASE_API_URL}/auth/passkeys/register/verify` as const,
      loginOptions: `${BASE_API_URL}/auth/passkeys/login/options` as const,
      loginVerify: `${BASE_API_URL}/auth/passkeys/login/verify` as const,
      byId: (id: string) => `${BASE_API_URL}/auth/passkeys/${id}` as const,
      rename: (id: string) => `${BASE_API_URL}/auth/passkeys/${id}/rename` as const,
    },
    mfa: {
      status: `${BASE_API_URL}/auth/mfa/status` as const,
      totpSetup: `${BASE_API_URL}/auth/mfa/totp/setup` as const,
      totpConfirm: `${BASE_API_URL}/auth/mfa/totp/confirm` as const,
      totpDisable: `${BASE_API_URL}/auth/mfa/totp` as const,
      stepUpChallenge: `${BASE_API_URL}/auth/mfa/step-up/challenge` as const,
      stepUp: `${BASE_API_URL}/auth/mfa/step-up` as const,
    },
    recoveryCodes: {
      regenerate: `${BASE_API_URL}/auth/recovery-codes/regenerate` as const,
    },
    organizationPolicy: (orgId: string) =>
      `${BASE_API_URL}/organizations/${orgId}/security-policy` as const,
  },
  users: {
    base: '/users' as const,
    roles: '/users/roles' as const,
    authors: '/users/authors' as const,
    userById: (id: string) => `/users/${id}` as const,
    byUsername: (username: string) => `/users/search/by-username/${username}` as const,
    usernameAvailable: (username: string) => `/users/username-available/${username}` as const,
    me: '/users/me' as const,
    deleteMe: (id: string) => `/users/me/${id}` as const,
    legalIdentity: '/users/me/legal-identity' as const,
  },
  follows: {
    byUserId: (userId: string) => `/users/${userId}/follow` as const,
    status: (userId: string) => `/users/${userId}/follow/status` as const,
  },
  tracks: {
    base: '/tracks' as const, // Used for POST and GET (all)
    myTracks: '/tracks/my-tracks' as const,
    byId: (id: string) => `/tracks/${id}` as const, // Used for GET, PUT, DELETE
    certificate: (id: string) => `/tracks/${id}/certificate` as const, // GET status
    certificateDownload: (id: string) => `/tracks/${id}/certificate/download` as const, // GET binary
    certificateRegenerate: (id: string) => `/tracks/${id}/certificate/regenerate` as const, // POST
    play: (id: string) => `/tracks/${id}/play` as const, // POST (registra reproducción)
  },
  authorDashboard: {
    overview: '/author-dashboard/overview' as const,
    songById: (id: string) => `/author-dashboard/tracks/${id}` as const,
    rightsIntelligence: '/author-dashboard/rights-intelligence' as const,
    rightsCompliance: '/author-dashboard/rights-compliance' as const,
    financial: '/author-dashboard/financial' as const,
  },
  // 📊 Dashboard de la publisher (catálogo del roster)
  publisherDashboard: {
    overview: (orgId: string) => `/organizations/${orgId}/publisher-dashboard/overview` as const,
    songById: (orgId: string, id: string) =>
      `/organizations/${orgId}/publisher-dashboard/tracks/${id}` as const,
    rightsIntelligence: (orgId: string) =>
      `/organizations/${orgId}/publisher-dashboard/rights-intelligence` as const,
    rightsCompliance: (orgId: string) =>
      `/organizations/${orgId}/publisher-dashboard/rights-compliance` as const,
    financial: (orgId: string) => `/organizations/${orgId}/publisher-dashboard/financial` as const,
  },
  // 📊 Dashboard de la organización compradora (roster que escucha y licencia)
  buyerDashboard: {
    overview: (orgId: string) => `/organizations/${orgId}/buyer-dashboard/overview` as const,
    licenses: (orgId: string, month?: string) =>
      month
        ? (`/organizations/${orgId}/buyer-dashboard/licenses?month=${month}` as const)
        : (`/organizations/${orgId}/buyer-dashboard/licenses` as const),
  },
  // 📜 Relación Editora-Autor (historial unificado, Flow 3)
  editorialRelationships: {
    mine: '/users/me/editorial-relationships' as const,
    forOrganization: (orgId: string) => `/organizations/${orgId}/editorial-relationships` as const,
  },
  // 🩺 Editorial Command Center (Health Score)
  editorialCommandCenter: {
    overview: '/editorial-command-center/overview' as const,
    trackById: (id: string) => `/editorial-command-center/tracks/${id}` as const,
    organizationOverview: (orgId: string) =>
      `/organizations/${orgId}/editorial-command-center/overview` as const,
    organizationTrackById: (orgId: string, id: string) =>
      `/organizations/${orgId}/editorial-command-center/tracks/${id}` as const,
  },
  storage: {   
    presignedUrls: '/storage/upload-url' as const,
    deleteBatch: '/storage/delete-batch' as const,
  },
  search: {
    base:'/search' as const,
  },
  genres: {
    base: '/musical-genre' as const,
    byId: (id: string) => `/musical-genre/${id}` as const,
  },
  moods: {
    base: '/moods' as const,
    byId: (id: string) => `/moods/${id}` as const,
  },
  themes: {
    base: '/themes' as const,
    byId: (id: string) => `/themes/${id}` as const,
  },
  playlists: {
    base: '/playlists' as const, // Used for POST and GET (all)
    byId: (id: string) => `/playlists/${id}` as const, // Used for GET, PUT, DELETE
  },
  requestedTracks: {
    base: '/requested-tracks' as const, // POST, GET
    byId: (id: string) => `/requested-tracks/${id}` as const, // GET, PUT, DELETE
    price: (id: string) => `/requested-tracks/${id}/price` as const,
  },
  musicalGenre: {
    base: '/musical-genre' as const, // POST, GET
    byId: (id: string) => `/musical-genre/${id}` as const, // GET, PUT, DELETE
  },
  intellectualProperty: {
    base: '/intellectual-property' as const, // POST, GET
    byId: (id: string) => `/intellectual-property/${id}` as const, // GET, PUT, DELETE
  },
  languages: {
    base: '/languages' as const,
  },
  guests: {
    base: '/guests' as const, // POST, GET
    byId: (id: string) => `/guests/${id}` as const, // GET, PUT, DELETE
  },
  invites: {
    base: '/invites' as const,
    byToken: (token: string) => `/invites/${token}` as const,
    admin: {
      base: '/invites/admin' as const, // GET (list)
      byId: (id: string) => `/invites/admin/${id}` as const, // DELETE
    },
  },
  app: {
    health: `${BASE_API_URL}` as const,
  },
  admin: {
    stats: '/users/admin/stats' as const,
    createAdmin: '/users/admin/create' as const,
    auditLog: '/users/admin/audit-log' as const,
  },
  payments: {
    checkout: `${BASE_API_URL}/payments/checkout` as const,
    licenseCheckout: `${BASE_API_URL}/payments/license-checkout` as const,
    licenseQuote: (requestedTrackId: string) =>
      `${BASE_API_URL}/payments/license-quote/${requestedTrackId}` as const,
    licenseStatus: (reference: string) => `${BASE_API_URL}/payments/license-status/${reference}` as const,
    paymentSources: `${BASE_API_URL}/payments/payment-sources` as const,
    paymentSourceMe: `${BASE_API_URL}/payments/payment-sources/me` as const,
    paymentSourceById: (id: string) => `${BASE_API_URL}/payments/payment-sources/${id}` as const,
    status: (reference: string) => `${BASE_API_URL}/payments/status/${reference}` as const,
    history: `${BASE_API_URL}/payments/history` as const,
    byId: (id: string) => `${BASE_API_URL}/payments/${id}` as const,
    receipt: (id: string) => `${BASE_API_URL}/payments/${id}/receipt` as const,
    pseBanks: `${BASE_API_URL}/payments/pse/banks` as const,
    psePay: `${BASE_API_URL}/payments/pse` as const,
    // 🏢 Registro Legal B2B — cobro inicial de la organización
    businessRegistrationCheckout: (orgId: string) =>
      `${BASE_API_URL}/payments/business-registration/${orgId}/checkout` as const,
    businessRegistrationPaymentSource: (orgId: string) =>
      `${BASE_API_URL}/payments/business-registration/${orgId}/payment-source` as const,
  },
  me: {
    profile: `${BASE_API_URL}/users/me` as const,
    email: `${BASE_API_URL}/users/me/email` as const,
    password: `${BASE_API_URL}/users/me/password` as const,
    avatar: `${BASE_API_URL}/users/me/avatar` as const,
    plan: `${BASE_API_URL}/users/me/plan` as const,
    billing: `${BASE_API_URL}/users/me/billing` as const,
    paymentHistory: `${BASE_API_URL}/users/me/payments` as const,
    bankAccount: '/users/me/bank-account' as const,
  },
  affiliates: {
    register: `${BASE_API_URL}/affiliates/register` as const,
    login: `${BASE_API_URL}/affiliates/login` as const,
    me: '/affiliates/me' as const,
    dashboard: '/affiliates/me/dashboard' as const,
    referrals: '/affiliates/me/referrals' as const,
    commissions: '/affiliates/me/commissions' as const,
    admin: {
      base: '/affiliates/admin' as const, // GET (list), POST (create)
      byId: (id: string) => `/affiliates/admin/${id}` as const, // GET, DELETE
      status: (id: string) => `/affiliates/admin/${id}/status` as const, // PATCH
      tier: (id: string) => `/affiliates/admin/${id}/tier` as const, // PATCH
      commissions: '/affiliates/admin/commissions' as const, // GET
      commissionPay: (id: string) => `/affiliates/admin/commissions/${id}/pay` as const, // PATCH
      commissionReject: (id: string) => `/affiliates/admin/commissions/${id}/reject` as const, // PATCH
    },
  },
  notifications: {
    admin: {
      base: '/notifications/admin' as const, // GET (list), POST (create)
      byId: (id: string) => `/notifications/admin/${id}` as const, // DELETE
    },
  },
  playlistCollaborators: {
    base: (playlistId: string) => `/playlists/${playlistId}/collaborators` as const, // GET, POST
    byId: (playlistId: string, collaboratorId: string) =>
      `/playlists/${playlistId}/collaborators/${collaboratorId}` as const, // DELETE
  },
  paymentsAdmin: {
    base: '/payments/admin' as const, // GET (list)
    byId: (id: string) => `/payments/admin/${id}` as const, // GET
    paymentSources: '/payments/admin/payment-sources' as const, // GET
    pendingRegistrations: '/payments/admin/pending-registrations' as const, // GET
  },
  chats: {
    base: '/chats' as const, // GET (lista unificada de conversaciones)
    direct: '/chats/direct' as const, // POST (iniciar/recuperar chat directo)
    messages: (id: string) => `/chats/${id}/messages` as const, // GET
    read: (id: string) => `/chats/${id}/read` as const, // PATCH
  },
  chatAdmin: {
    base: '/chats/admin' as const, // GET (list)
    messages: (id: string) => `/chats/admin/${id}/messages` as const, // GET
  },
  otp: {
    request: '/otp/request' as const,
    verify: '/otp/verify' as const,
  },
  splits: {
    byTrack: (trackId: string) => `/tracks/${trackId}/splits` as const, // POST, GET
    byId: (id: string) => `/splits/${id}` as const, // PUT
    approve: (id: string) => `/splits/${id}/approve` as const,
    reject: (id: string) => `/splits/${id}/reject` as const,
  },
  licenseContracts: {
    byRequestedTrack: (requestedTrackId: string) =>
      `/requested-tracks/${requestedTrackId}/license-contract` as const, // POST, GET
    byId: (id: string) => `/license-contracts/${id}` as const, // GET, DELETE
    generatePreview: (id: string) => `/license-contracts/${id}/generate-preview` as const,
    installments: (id: string) => `/license-contracts/${id}/installments` as const,
    sign: (id: string, signatoryId: string) =>
      `/license-contracts/${id}/signatories/${signatoryId}/sign` as const,
    reject: (id: string, signatoryId: string) =>
      `/license-contracts/${id}/signatories/${signatoryId}/reject` as const,
    confirmRecording: (id: string) => `/license-contracts/${id}/confirm-recording` as const,
  },
  licenseInstallmentCheckout: `${BASE_API_URL}/payments/license-installment-checkout` as const,
  sharing: {
    profile: '/sharing/profile' as const,
    byPlaylist: (playlistId: string) => `/sharing/playlists/${playlistId}` as const,
    byTrack: (trackId: string) => `/sharing/tracks/${trackId}` as const,
    mine: '/sharing/mine' as const,
    byId: (shareLinkId: string) => `/sharing/${shareLinkId}` as const,
    recipients: (shareLinkId: string) => `/sharing/${shareLinkId}/recipients` as const,
    recipientById: (shareLinkId: string, recipientId: string) =>
      `/sharing/${shareLinkId}/recipients/${recipientId}` as const,
    validateAccess: (token: string) => `/sharing/access/${token}` as const,
    accessLog: (shareLinkId: string) => `/sharing/${shareLinkId}/access-log` as const,
  },
  wallet: {
    balance: '/wallet/balance' as const,
    earnings: '/wallet/earnings' as const,
    withdrawals: '/wallet/withdrawals' as const,
    withdrawalById: (id: string) => `/wallet/withdrawals/${id}` as const,
    admin: {
      withdrawals: '/wallet/admin/withdrawals' as const,
      withdrawalById: (id: string) => `/wallet/admin/withdrawals/${id}` as const,
      process: (id: string) => `/wallet/admin/withdrawals/${id}/process` as const,
      pay: (id: string) => `/wallet/admin/withdrawals/${id}/pay` as const,
      payBatch: '/wallet/admin/withdrawals/pay-batch' as const,
      reject: (id: string) => `/wallet/admin/withdrawals/${id}/reject` as const,
    },
  },
  // 💰 Wallet a nivel organización (publisher)
  publisherWallet: {
    balance: (orgId: string) => `/organizations/${orgId}/wallet/balance` as const,
    earnings: (orgId: string) => `/organizations/${orgId}/wallet/earnings` as const,
    withdrawals: (orgId: string) => `/organizations/${orgId}/wallet/withdrawals` as const,
    withdrawalById: (orgId: string, id: string) =>
      `/organizations/${orgId}/wallet/withdrawals/${id}` as const,
    bankAccount: (orgId: string) => `/organizations/${orgId}/wallet/bank-account` as const,
  },
  // 💸 Comisión por anticipo de licencia (publisher)
  publisherCommission: {
    policy: (orgId: string) => `/organizations/${orgId}/commission-policy` as const,
    roster: (orgId: string) => `/organizations/${orgId}/commission-policy/roster` as const,
  },
  // 💰 Publisher's Share de la publisher sobre su roster (metadata informativa)
  publisherShare: {
    policy: (orgId: string) => `/organizations/${orgId}/publisher-shares` as const,
    roster: (orgId: string) => `/organizations/${orgId}/publisher-shares/roster` as const,
    mine: () => `/users/me/publisher-shares` as const,
  },
  // 📝 Notas sobre tracks (privadas o compartidas por playlist)
  trackNotes: {
    base: '/track-notes' as const,
    byId: (id: string) => `/track-notes/${id}` as const,
  },
  blog: {
    articles: {
      base: '/blog/articles' as const, // GET (list, público)
      bySlug: (slug: string) => `/blog/articles/${slug}` as const, // GET (detalle, público)
    },
    authors: {
      base: '/blog/authors' as const,
      bySlug: (slug: string) => `/blog/authors/${slug}` as const, // GET (perfil público)
      articlesBySlug: (slug: string) => `/blog/authors/${slug}/articles` as const, // GET (público)
    },
    admin: {
      articles: {
        base: '/blog/admin/articles' as const, // GET (list), POST
        byId: (id: string) => `/blog/admin/articles/${id}` as const, // GET, PUT, DELETE
        publish: (id: string) => `/blog/admin/articles/${id}/publish` as const, // PATCH
        unpublish: (id: string) => `/blog/admin/articles/${id}/unpublish` as const, // PATCH
      },
      authors: {
        base: '/blog/admin/authors' as const, // GET (list), POST
        byId: (id: string) => `/blog/admin/authors/${id}` as const, // GET, PUT, DELETE
      },
      tags: {
        base: '/blog/admin/tags' as const, // GET (list), POST
        byId: (id: string) => `/blog/admin/tags/${id}` as const, // GET, PUT, DELETE
      },
    },
  },
  publishingContracts: {
    base: '/publishing-contracts' as const, // POST
    mine: '/publishing-contracts/me' as const, // GET
    byId: (id: string) => `/publishing-contracts/${id}` as const, // GET, PATCH, DELETE
  },
  registrationFile: {
    list: '/registration-files' as const, // GET (listado paginado: search, status, ownerId, page, limit)
    summaryByTrackIds: (trackIds: string[]) =>
      `/tracks/registration-files/summary?trackIds=${trackIds.join(',')}` as const, // GET (batch)
    byTrack: (trackId: string) => `/tracks/${trackId}/registration-file` as const, // POST, GET
    byId: (id: string) => `/registration-file/${id}` as const, // GET
    generalInfo: (id: string) => `/registration-file/${id}/general-info` as const, // PATCH
    participants: (id: string) => `/registration-file/${id}/participants` as const, // PATCH
    participantsFromSplit: (id: string) => `/registration-file/${id}/participants/from-split` as const, // POST
    phonogram: (id: string) => `/registration-file/${id}/phonogram` as const, // PATCH
    publishing: (id: string) => `/registration-file/${id}/publishing` as const, // PATCH
    derivativeWork: (id: string) => `/registration-file/${id}/derivative-work` as const, // PATCH
    commissionedWork: (id: string) => `/registration-file/${id}/commissioned-work` as const, // PATCH
    aiUsage: (id: string) => `/registration-file/${id}/ai-usage` as const, // PATCH
    documents: (id: string) => `/registration-file/${id}/documents` as const, // POST
    documentById: (id: string, documentId: string) => `/registration-file/${id}/documents/${documentId}` as const, // DELETE
    completeness: (id: string) => `/registration-file/${id}/completeness` as const, // GET
    checklist: (id: string) => `/registration-file/${id}/checklist` as const, // GET
    readyForSubmission: (id: string) => `/registration-file/${id}/ready-for-submission` as const, // POST
    markProfileSubmitted: (id: string, profileKey: string) =>
      `/registration-file/${id}/profile-status/${profileKey}/mark-submitted` as const, // POST
    markProfileRegistered: (id: string, profileKey: string) =>
      `/registration-file/${id}/profile-status/${profileKey}/mark-registered` as const, // POST
    downloadPdf: (id: string) => `/registration-file/${id}/download/pdf` as const, // GET (binary)
    downloadZip: (id: string) => `/registration-file/${id}/download/zip` as const, // GET (binary)
  },
  authz: {
    myCapabilities: '/users/me/capabilities' as const, // GET (header x-organization-id opcional)
    myMemberships: '/users/me/memberships' as const, // GET
    myEntitlements: '/users/me/entitlements' as const, // GET
    myUsage: '/users/me/usage' as const, // GET
    permissionsCatalog: '/permissions/catalog' as const, // GET (MATRIZ DE CAPACIDADES)
    adminCapabilities: {
      base: '/admin/capabilities' as const, // GET
      byId: (id: string) => `/admin/capabilities/${id}` as const, // PATCH
    },
    adminExplain: '/admin/authorization/explain' as const, // GET ?userId&organizationId
    adminCheck: '/admin/authorization/check' as const, // POST
  },
  organizations: {
    adminBase: '/admin/organizations' as const, // GET, POST
    adminById: (id: string) => `/admin/organizations/${id}` as const, // GET, PATCH
    invitePublic: (token: string) => `${BASE_API_URL}/organization-invites/${token}` as const, // GET (público)
    workspaceInvitePublic: (token: string) =>
      `${BASE_API_URL}/workspace-invites/${token}` as const, // GET (público)
    inviteLink: (orgId: string) => `/organizations/${orgId}/invite-link` as const, // GET
    inviteLinkRegenerate: (orgId: string) =>
      `/organizations/${orgId}/invite-link/regenerate` as const, // POST
    inviteLinkRevoke: (orgId: string) => `/organizations/${orgId}/invite-link/revoke` as const, // POST
    accessRequests: (orgId: string) => `/organizations/${orgId}/access-requests` as const, // GET ?status=
    accessRequestApprove: (orgId: string, requestId: string) =>
      `/organizations/${orgId}/access-requests/${requestId}/approve` as const, // POST
    accessRequestReject: (orgId: string, requestId: string) =>
      `/organizations/${orgId}/access-requests/${requestId}/reject` as const, // POST
    roles: (orgId: string) => `/organizations/${orgId}/roles` as const, // GET, POST
    roleById: (orgId: string, roleId: string) => `/organizations/${orgId}/roles/${roleId}` as const, // GET, PATCH, DELETE
    roleCapabilities: (orgId: string, roleId: string) =>
      `/organizations/${orgId}/roles/${roleId}/capabilities` as const, // PUT
    roleCapabilityById: (orgId: string, roleId: string, capabilityId: string) =>
      `/organizations/${orgId}/roles/${roleId}/capabilities/${capabilityId}` as const, // POST, DELETE
    members: (orgId: string) => `/organizations/${orgId}/members` as const, // GET ?type=, POST (invite)
    memberStatus: (orgId: string, membershipId: string) =>
      `/organizations/${orgId}/members/${membershipId}/status` as const, // PATCH
    memberRoles: (orgId: string, membershipId: string) =>
      `/organizations/${orgId}/members/${membershipId}/roles` as const, // GET, PUT
    memberAccept: (orgId: string, membershipId: string) =>
      `/organizations/${orgId}/members/${membershipId}/accept` as const, // POST
    trackspaces: (orgId: string) => `/organizations/${orgId}/trackspaces` as const, // GET
    trackspaceById: (orgId: string, trackspaceId: string) =>
      `/organizations/${orgId}/trackspaces/${trackspaceId}` as const, // PATCH
    entitlements: (orgId: string) => `/organizations/${orgId}/entitlements` as const, // GET
    // 🏢 Registro Legal B2B — panel admin (aprobar/rechazar/crear)
    adminApprove: (id: string) => `/admin/organizations/${id}/approve` as const, // POST
    adminReject: (id: string) => `/admin/organizations/${id}/reject` as const, // POST
    adminMarkCreated: (id: string) => `/admin/organizations/${id}/mark-created` as const, // POST
    // 🏢 Registro Legal B2B — autoservicio de la organización
    mine: (orgId: string) => `/organizations/${orgId}` as const, // GET
    activateAdmin: (orgId: string) => `/organizations/${orgId}/activate-admin` as const, // POST
    checkVerification: (orgId: string) => `/organizations/${orgId}/check-verification` as const, // POST
  },
  plans: {
    // 🏢 Planes B2B activos disponibles para createBusinessForm (público)
    business: `${BASE_API_URL}/plans/business` as const,
  },
  plansAdmin: {
    base: '/admin/plans' as const, // GET
    byId: (id: string) => `/admin/plans/${id}` as const, // PATCH
    entitlement: (planId: string, entitlementId: string) =>
      `/admin/plans/${planId}/entitlements/${entitlementId}` as const, // PUT
    capabilities: (planId: string) => `/admin/plans/${planId}/capabilities` as const, // PUT
    entitlementsCatalog: '/admin/entitlements' as const, // GET
    transactionFees: '/admin/plans/transaction-fees' as const, // GET (matriz completa §6)
    transactionFee: (planId: string) => `/admin/plans/${planId}/transaction-fee` as const, // GET, PUT
    transactionFeeHistory: (planId: string) =>
      `/admin/plans/${planId}/transaction-fee/history` as const, // GET
    price: (planId: string) => `/admin/plans/${planId}/price` as const, // GET, PUT
    priceHistory: (planId: string) => `/admin/plans/${planId}/price/history` as const, // GET
  },
  subscriptionsAdmin: {
    base: '/admin/subscriptions' as const, // GET
    byId: (id: string) => `/admin/subscriptions/${id}` as const, // PATCH
  },
  staff: {
    permissions: '/staff/permissions' as const, // GET
    roles: {
      base: '/staff/roles' as const, // GET (list), POST
      byId: (id: string) => `/staff/roles/${id}` as const, // GET, PATCH, DELETE
    },
    members: {
      base: '/staff/members' as const, // GET (list)
      me: '/staff/members/me/permissions' as const, // GET
      invite: '/staff/members/invite' as const, // POST
      assignRole: (userId: string) => `/staff/members/${userId}/assign-role` as const, // POST
      revokeRole: (userId: string) => `/staff/members/${userId}/role` as const, // DELETE
    },
    auditLog: {
      base: '/staff/audit-log' as const, // GET (list)
      export: '/staff/audit-log/export' as const, // GET (binary)
    },
  },
  // 📢 Pautas publicitarias (publisher)
  promotions: {
    base: '/promotions' as const, // POST (crear)
    pricing: '/promotions/pricing' as const, // GET (precios vigentes)
    promotable: '/promotions/promotable' as const, // GET (recursos del roster)
    mine: '/promotions/mine' as const, // GET (mis pautas)
    checkout: (id: string) => `/promotions/${id}/checkout` as const, // POST
    withdraw: (id: string) => `/promotions/${id}/withdraw` as const, // POST
  },
  // 📢 Pautas (admin)
  promotionsAdmin: {
    base: '/admin/promotions' as const, // GET (listar con filtros)
    approve: (id: string) => `/admin/promotions/${id}/approve` as const, // POST
    reject: (id: string) => `/admin/promotions/${id}/reject` as const, // POST
    withdraw: (id: string) => `/admin/promotions/${id}/withdraw` as const, // POST
    pricing: '/admin/promotions/pricing' as const, // GET, PUT
    pricingHistory: '/admin/promotions/pricing/history' as const, // GET
  },
  // 📢 Destacados públicos
  featured: {
    tracks: '/featured/tracks' as const, // GET
    composers: '/featured/composers' as const, // GET
  },
  // 🎼 Catálogo maestro de Sociedades de Gestión Colectiva (CMO/PRO)
  referenceData: {
    collectiveManagementSocieties: {
      base: '/reference-data/collective-management-societies' as const, // GET (?country=, ?search=), POST
      byId: (id: string) => `/reference-data/collective-management-societies/${id}` as const, // GET, PUT, DELETE
    },
  },
  // 🎼 Afiliaciones del autor a Sociedades de Gestión Colectiva
  societyAffiliations: {
    base: (authorId: string) => `/authors/${authorId}/society-affiliations` as const, // GET, POST
    byId: (authorId: string, id: string) => `/authors/${authorId}/society-affiliations/${id}` as const, // PATCH
    end: (authorId: string, id: string) => `/authors/${authorId}/society-affiliations/${id}/end` as const, // POST
  },
  // 🏦 Información bancaria de cobro de anticipos de licencia
  bankInformation: {
    pending: '/bank-information/pending' as const, // GET
    transferOptions: '/bank-information/transfer-options' as const, // GET
    me: '/bank-information/me' as const, // GET
    colombia: '/bank-information/colombia' as const, // POST
    foreign: '/bank-information/foreign' as const, // POST
  },
} as const;

export type ApiURLs = typeof apiURLs;