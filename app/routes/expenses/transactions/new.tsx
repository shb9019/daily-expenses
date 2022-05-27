import { ActionFunction, json, LinksFunction, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

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

function validateTitle(title: string) {
  if (title.length == 0) {
    return "Title cannot be empty!";
  }
}

function validateExpenseDate(expenseDate: string) {
  if (isNaN(Date.parse(expenseDate))) {
    return "Selected date is invalid!";
  }
}

function validateAmount(amount: string) {
  if (isNaN(Number(amount))) {
    return "Entered amount is not a number!";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    expenseDate: string | undefined;
    amount: string | undefined;
  };
  fields?: {
    title: string;
    expenseDate: string;
    amount: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({
  request,
}) => {
  const form = await request.formData();
  const title = form.get("title");
  const expenseDate = form.get("expense-date");
  const amount = form.get("amount");

  if (
    typeof title !== "string" ||
    typeof expenseDate !== "string" ||
    typeof amount !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    title: validateTitle(title),
    expenseDate: validateExpenseDate(expenseDate),
    amount: validateAmount(amount)
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: {title, expenseDate, amount} });
  }

  const fields = { title, expenseDate: new Date(expenseDate), amount: Number(amount) };
  await db.transaction.create({
    data: { ...fields },
  });

  return redirect(`/expenses/transactions`);
};

export default function NewTransactionRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="new-transaction-wrapper">
      <h2>Add Transaction</h2>
      <form method="post">
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={actionData?.fields?.title}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.title) ||
              undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.title
                ? "title-error"
                : undefined
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="expense-date">Expense Date</label>
          <input
            type="datetime-local"
            name="expense-date"
            defaultValue={actionData?.fields?.expenseDate}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.expenseDate) ||
              undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.expenseDate
                ? "expense-date-error"
                : undefined
            }
          />
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            defaultValue={actionData?.fields?.amount}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.amount) ||
              undefined
            }
            aria-errormessage={
              actionData?.fieldErrors?.amount
                ? "amount-error"
                : undefined
            }
          />
        </div>
        {actionData?.fieldErrors?.title ? (
          <p
            className="form-validation-error"
            role="alert"
            id="title-error"
          >
            {actionData.fieldErrors.title}
          </p>
        ) : null}
        {actionData?.fieldErrors?.expenseDate ? (
          <p
            className="form-validation-error"
            role="alert"
            id="expense-date-error"
          >
            {actionData.fieldErrors.expenseDate}
          </p>
        ) : null}
        {actionData?.fieldErrors?.amount ? (
          <p
            className="form-validation-error"
            role="alert"
            id="amount-error"
          >
            {actionData.fieldErrors.amount}
          </p>
        ) : null}
        <div className="submit">
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}