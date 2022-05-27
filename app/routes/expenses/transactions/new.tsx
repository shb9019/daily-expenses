import type { LinksFunction } from "@remix-run/node";

import newTransactionStylesUrl from "~/styles/new-transaction.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: newTransactionStylesUrl,
    },
  ];
};

export default function NewTransactionRoute() {
  return (
    <div className="new-transaction-wrapper">
      <h2>Add Transaction</h2>
      <form method="post">
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" />
        </div>
        <div className="input-group">
          <label htmlFor="expense-date">Expense Date</label>
          <input type="datetime-local" name="expense-date" />
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input type="number" step="0.01" name="amount" />
        </div>
        <div className="submit">
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}