import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import type { TransactionFormActionData } from "~/components/transaction-form";
import TransactionForm, {
  TransactionFormAction,
} from "~/components/transaction-form";

import newTransactionStylesUrl from "~/styles/new-transaction.css";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: newTransactionStylesUrl,
    },
  ];
};

export function validateTitle(title: string) {
  if (title.length == 0) {
    return "Title cannot be empty!";
  }
}

export function validateExpenseDate(expenseDate: string) {
  if (isNaN(Date.parse(expenseDate))) {
    return "Selected date is invalid!";
  }
}

export function validateAmount(amount: string) {
  if (isNaN(Number(amount))) {
    return "Entered amount is not a number!";
  }
}

const badRequest = (data: TransactionFormActionData) =>
  json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const expenseDate = form.get("expense-date");
  const amount = form.get("amount");
  const action = form.get("action");

  if (
    typeof title !== "string" ||
    typeof expenseDate !== "string" ||
    typeof amount !== "string" ||
    action !== TransactionFormAction.ADD
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    title: validateTitle(title),
    expenseDate: validateExpenseDate(expenseDate),
    amount: validateAmount(amount),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: { title, expenseDate, amount } });
  }

  const fields = {
    title,
    expenseDate: new Date(expenseDate),
    amount: Number(amount),
  };
  await db.transaction.create({
    data: { ...fields },
  });

  return redirect(`/expenses/transactions`);
};

export default function NewTransactionRoute() {
  const actionData = useActionData<TransactionFormActionData>();

  return (
    <div className="new-transaction-wrapper">
      <h2>Add Transaction</h2>
      <TransactionForm
        actionData={actionData}
        action={TransactionFormAction.ADD}
      />
    </div>
  );
}
