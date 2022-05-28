import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { SourcesData, TransactionFormActionData, TransactionFormLoaderData } from "~/components/transaction-form";
import TransactionForm, { TransactionFormAction } from "~/components/transaction-form";
import { badRequest } from "~/utils";
import { db } from "~/utils/db.server";
import { validateAmount, validateExpenseDate, validateTitle } from "./new";

type LoaderData = {
  transaction: TransactionFormLoaderData;
  sources: SourcesData;
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const transactionId = form.get("transaction-id");
  const title = form.get("title");
  const expenseDate = form.get("expense-date");
  const amount = form.get("amount");
  const sourceId = form.get("source");
  const action = form.get("action");

  if (
    typeof transactionId !== "string" ||
    typeof title !== "string" ||
    typeof expenseDate !== "string" ||
    typeof amount !== "string" ||
    typeof sourceId !== "string" ||
    action !== TransactionFormAction.EDIT
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const transaction = await db.transaction.findFirst({where: {id: transactionId}});
  if (!transaction) {
    throw new Error("Transaction does not exist");
  }

  const fieldErrors = {
    title: validateTitle(title),
    expenseDate: validateExpenseDate(expenseDate),
    amount: validateAmount(amount),
    source: !sourceId ? "Source does not exist" : undefined
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: { title, expenseDate, amount, source: sourceId } });
  }

  const fields = {
    title,
    expenseDate: new Date(expenseDate),
    amount: Number(amount),
    sourceId
  };

  await db.transaction.update({
    where: {id: transactionId},
    data: { ...fields },
  });

  return redirect("/expenses/transactions");
};

export const loader: LoaderFunction = async ({ params }) => {
  const {transactionId} = params;

  if (typeof transactionId !== "string") {
    return redirect("/expenses/transactions");
  }

  const transaction = await db.transaction.findFirst({where: {id: transactionId}});
  if (!transaction) {
    throw new Error("Transaction ID not found");
  }

  const sources = await db.source.findMany();

  const data : LoaderData = {
    transaction: {
      transactionId: transaction.id,
      title: transaction.title,
      expenseDate: transaction.expenseDate.toISOString().slice(0, -1),
      amount: transaction.amount.toString(),
      source: transaction.sourceId,
    },
    sources: sources.map((item) => ({id: item.id, label: item.label}))
  };

  return json(data);
};

export default function EditTransactionRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<TransactionFormActionData>();

  return (
    <div className="edit-transaction-wrapper">
      <h2>Edit Transaction</h2>
      <TransactionForm
        initialTransaction={data.transaction}
        action={TransactionFormAction.EDIT}
        actionData={actionData}
        sources={data.sources}
      />
    </div>
  );
}
