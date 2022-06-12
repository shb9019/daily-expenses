import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import expensesStylesUrl from "~/styles/expenses.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: expensesStylesUrl,
    },
  ];
};

export default function ExpensesRoute() {
  return (
    <div className="wrapper">
      <aside>
        <ul className="navbar-list">
          <li>
            <h2>Daily Expenses</h2>
          </li>
          <li>
            <Link to="transactions">Transactions</Link>
          </li>
          <li>
            <Link to="sources">Sources</Link>
          </li>
        </ul>
      </aside>
      <main>
        <div className="wrapper-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
