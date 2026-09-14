export function exportMonthlyWhiskyToCSV(shipments, selectedMonth) {
  // selectedMonth format: "YYYY-MM" (e.g., "2026-09")
  const filtered = shipments.filter(item => {
    if (!item.departureDate) return false;
    return item.departureDate.startsWith(selectedMonth);
  });

  if (filtered.length === 0) {
    alert(`No outbound shipments recorded for ${selectedMonth}.`);
    return;
  }

  // Header columns
  const headers = [
    "Tracking ID",
    "Whiskey Brand",
    "Quantity Dispatched",
    "Quantity Received",
    "Status",
    "Sender Vault",
    "Destination Vault",
    "Traveler Name",
    "Traveler Phone",
    "Departure Date",
    "Last Called At",
    "Notes"
  ];

  const rows = filtered.map(item => [
    `"${item.id}"`,
    `"${item.brand.replace(/"/g, '""')}"`,
    item.quantity,
    item.receivedQuantity !== null ? item.receivedQuantity : "Pending",
    `"${item.status}"`,
    `"${item.sender}"`,
    `"${item.receiver}"`,
    `"${item.travelerName.replace(/"/g, '""')}"`,
    `"${item.travelerPhone}"`,
    `"${item.departureDate}"`,
    `"${item.lastCalledAt || 'Not Called'}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\r\n");

  // Trigger Excel/CSV Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Whisky_Corridor_Outgoing_${selectedMonth}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}