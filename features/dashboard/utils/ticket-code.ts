/** "#TK-۲۰۰۱"-style display code from a ticket's auto-increment number, no thousands grouping. */
export function formatTicketCode(ticketNumber: number): string {
  const n = (2000 + ticketNumber).toLocaleString("fa-IR", { useGrouping: false });
  return `#TK-${n}`;
}
