import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import SubFormHeader from "~/components/sub-form-header";
import type { TransactionFormActionData } from "~/components/transaction-form";
import TransactionForm, {
  TransactionFormAction,
} from "~/components/transaction-form";

import newTransactionStylesUrl from "~/styles/new-transaction.css";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

type LoaderData = {
  sources: Array<{ id: string; label: string; }>;
};

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
  const sourceId = form.get("source");
  const action = form.get("action");
  const userId = await requireUserId(request);

  if (
    typeof title !== "string" ||
    typeof expenseDate !== "string" ||
    typeof amount !== "string" ||
    typeof sourceId !== "string" ||
    action !== TransactionFormAction.ADD
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const source = db.source.findFirst({where: {id: sourceId}});

  const fieldErrors = {
    title: validateTitle(title),
    expenseDate: validateExpenseDate(expenseDate),
    amount: validateAmount(amount),
    source: !source ? "Source does not exist!" : undefined
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: { title, expenseDate, amount, source: sourceId } });
  }

  const fields = {
    title,
    expenseDate: new Date(expenseDate),
    amount: Number(amount),
    sourceId,
    userId
  };
  await db.transaction.create({
    data: { ...fields },
  });

  return redirect(`/expenses/transactions`);
};

export const loader: LoaderFunction = async () => {
  const sources = await db.source.findMany();
  const data : LoaderData = {
    sources: sources.map((item) => ({id: item.id, label: item.label}))
  };

  return json(data);
};

export default function NewTransactionRoute() {
  const actionData = useActionData<TransactionFormActionData>();
  const data = useLoaderData<LoaderData>();

  return (
    <div className="new-transaction-wrapper">
      <SubFormHeader title="Add Transaction" />
      <TransactionForm
        actionData={actionData}
        action={TransactionFormAction.ADD}
        sources={data.sources}
      />
    </div>
  );
}
