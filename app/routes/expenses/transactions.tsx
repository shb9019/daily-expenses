import { ActionFunction, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import TransactionComponent from "~/components/transaction"

import { db } from "~/utils/db.server";
import transactionsStylesUrl from "~/styles/transactions.css";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { badRequest } from "~/utils";

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
  const transactions = await db.transaction.findMany({
    orderBy: [{expenseDate: 'asc'}, {createdAt: 'asc'}]
  });
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

export const action: ActionFunction = async ({
  request,
}) => {
  const form = await request.formData();
  const action = form.get("action");
  const transactionId = form.get("transaction-id");

  if (
    typeof action !== "string" ||
    typeof transactionId !== "string"
  ) {
    return badRequest({
      formError: "Form not submitted correctly.",
    });
  }

  const transaction = await db.transaction.findFirst({where: {id: transactionId}});
  if (!transaction) {
    return badRequest({
      formError: "Transaction does not exist",
    });
  }

  switch (action) {
    case "delete": {
      await db.transaction.delete({where: {id: transactionId}});
      return redirect("/expenses/transactions")
    }
    default:
      return badRequest({
        formError: "Action type invalid",
      });
  }
};

export default function TransactionsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="transactions-wrapper">
      <div className="transactions-list">
        {data.transactions.map((transaction) =>
            <TransactionComponent
              key={transaction.id}
              id={transaction.id}
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
