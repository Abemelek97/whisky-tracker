export const INITIAL_SHIPMENTS = [
  {
    id: "TRK-9021",
    brand: "Johnnie Walker Black Label (1L)",
    quantity: 6,
    sender: "Dubai Duty Free Logistics Hub",
    senderCity: "Dubai, UAE",
    receiver: "Bole Distribution Depot",
    receiverCity: "Addis Ababa, ET",
    travelerName: "Yonas Mengistu",
    travelerPhone: "+971 50 123 4567",
    departureDate: "2026-09-09",
    status: "In Transit",
    receivedQuantity: null,
    notes: "Packed in fragile thermal sleeve.",
    createdAt: "2026-09-08"
  },
  {
    id: "TRK-9018",
    brand: "Macallan 12 Double Cask",
    quantity: 4,
    sender: "Al Maktoum Terminal Dispatch",
    senderCity: "Dubai, UAE",
    receiver: "Bole Distribution Depot",
    receiverCity: "Addis Ababa, ET",
    travelerName: "Sara Tefera",
    travelerPhone: "+251 91 234 5678",
    departureDate: "2026-09-06",
    status: "Received",
    receivedQuantity: 4,
    notes: "Verified intact by Addis Hub.",
    createdAt: "2026-09-05"
  },
  {
    id: "TRK-9014",
    brand: "Chivas Regal 18yo",
    quantity: 3,
    sender: "Dubai Central Vault",
    senderCity: "Dubai, UAE",
    receiver: "Kazanchis Vault",
    receiverCity: "Addis Ababa, ET",
    travelerName: "Dawit Bekele",
    travelerPhone: "+971 55 987 6543",
    departureDate: "2026-09-04",
    status: "Discrepancy",
    receivedQuantity: 2,
    notes: "1 bottle cracked during transit. Photo submitted.",
    createdAt: "2026-09-03"
  }
];

export const ONBOARDING_STEPS = [
  {
    title: "The Dubai-to-Addis Corridor",
    desc: "AmberVault tracks fine whiskey transit handled by individual travelers flying from Dubai (DXB) directly to depots in Addis Ababa (ADD).",
    iconKey: "wine"
  },
  {
    title: "Direct Traveler Accountability",
    desc: "Every batch is sealed and tied directly to the traveler's phone contact. Senders dispatch, transit begins, and phone lines remain open.",
    iconKey: "phone"
  },
  {
    title: "Reconciliation & Vault Audits",
    desc: "Addis Ababa receivers inspect packaging integrity upon arrival. Log exact received bottle counts and flag discrepancies instantly.",
    iconKey: "check"
  }
];