export type TransactionFormLoaderData = {
  transactionId: string;
  title: string;
  expenseDate: string;
  amount: string;
};

export type TransactionFormActionData = {
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

export enum TransactionFormAction {
  ADD = "add",
  EDIT = "edit",
}

export default function TransactionForm({
  actionData,
  action,
  initialTransaction,
}: {
  actionData?: TransactionFormActionData;
  action: TransactionFormAction;
  initialTransaction?: TransactionFormLoaderData;
}) {
  return (
    <form method="post">
      <div className="input-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.fields?.title ?? initialTransaction?.title}
          aria-invalid={Boolean(actionData?.fieldErrors?.title) || undefined}
          aria-errormessage={
            actionData?.fieldErrors?.title ? "title-error" : undefined
          }
        />
      </div>
      <div className="input-group">
        <label htmlFor="expense-date">Expense Date</label>
        <input
          type="datetime-local"
          name="expense-date"
          defaultValue={
            actionData?.fields?.expenseDate ?? initialTransaction?.expenseDate
          }
          aria-invalid={
            Boolean(actionData?.fieldErrors?.expenseDate) || undefined
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
          defaultValue={actionData?.fields?.amount ?? initialTransaction?.amount}
          aria-invalid={Boolean(actionData?.fieldErrors?.amount) || undefined}
          aria-errormessage={
            actionData?.fieldErrors?.amount ? "amount-error" : undefined
          }
        />
      </div>
      <input type="hidden" name="transaction-id" value={initialTransaction?.transactionId} />
      {actionData?.fieldErrors?.title ? (
        <p className="form-validation-error" role="alert" id="title-error">
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
        <p className="form-validation-error" role="alert" id="amount-error">
          {actionData.fieldErrors.amount}
        </p>
      ) : null}
      <input type="hidden" name="action" value={action} />
      <div className="submit">
        <button type="submit" className="button">
          {action === TransactionFormAction.ADD ? "Add" : "Edit"}
        </button>
      </div>
    </form>
  );
}
