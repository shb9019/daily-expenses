import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import TransactionComponent from "~/components/transaction"

import { db } from "~/utils/db.server";
import transactionsStylesUrl from "~/styles/transactions.css";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

type LoaderData = { transactions: Array<{id: string, title: string, expenseDate: string, amount: string}> }

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: transactionsStylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async () => {
  const transactions = await db.transaction.findMany();
  const data: LoaderData = {
    transactions: transactions.map((item) => ({
      id: item.id,
      title: item.title,
      expenseDate: item.expenseDate.toLocaleString(),
      amount: Number(item.amount).toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    })),
  };

  return json(data);
};

export default function TransactionsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="transactions-wrapper">
      <div className="transactions-list">
        {data.transactions.map((transaction) =>
            <TransactionComponent
              key={transaction.id}
              title={transaction.title}
              date={transaction.expenseDate}
              amount={transaction.amount}
            />
        )}
        <Link to="new">
          <button type="button">Add Transaction</button>
        </Link>
      </div>
      <Outlet/>
    </div>
  );
}
