/* ============================================================
   RENO DTF — SITE CONFIG
   Edit these values in ONE place; every page reads from here.
   ============================================================ */
window.RENO_DTF = {
  // TODO: replace with the client's real order email before going live.
  email: "your-email@renodtfprinting.com",

  instagram: "https://www.instagram.com/renodtf/",
  instagramHandle: "@renodtf",

  address: {
    line1: "2536 Sutro St Unit 7",
    line2: "Reno, NV 89512",
    country: "United States",
    maps: "https://maps.google.com/?q=2536+Sutro+St+Unit+7,+Reno,+NV+89512",
  },

  // Daily order cutoff in Pacific Time (24h clock).
  cutoffHour: 9,

  // Shopify links. If the new site takes over www.renodtfprinting.com,
  // move the Shopify store to a subdomain (e.g. shop.renodtfprinting.com)
  // and update the base below.
  shopify: {
    base: "https://www.renodtfprinting.com",
    builder: "/products/gang-sheet-builder",
    account: "/account",
    login: "/customer_authentication/redirect?locale=en&region_country=US",
    cart: "/cart",
  },
};
