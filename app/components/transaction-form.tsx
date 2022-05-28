export type TransactionFormLoaderData = {
  transactionId: string;
  title: string;
  expenseDate: string;
  amount: string;
  source: string;
};

export type SourcesData = Array<{ id: string; label: string; }>;

export type TransactionFormActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    expenseDate: string | undefined;
    amount: string | undefined;
    source: string | undefined;
  };
  fields?: {
    title: string;
    expenseDate: string;
    amount: string;
    source: string;
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
  sources,
}: {
  actionData?: TransactionFormActionData;
  action: TransactionFormAction;
  initialTransaction?: TransactionFormLoaderData;
  sources: SourcesData;
}) {
  return (
    <form method="post" id="transaction-form">
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
      <div className="input-group">
        <label htmlFor="source">Source</label>
        <select
          name="source"
          form="transaction-form"
          defaultValue={actionData?.fields?.source ?? initialTransaction?.source}
          aria-invalid={Boolean(actionData?.fieldErrors?.source) || undefined}
          aria-errormessage={
            actionData?.fieldErrors?.source ? "source-error" : undefined
          }
        >
          {sources.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
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
      {actionData?.fieldErrors?.source ? (
        <p className="form-validation-error" role="alert" id="source-error">
          {actionData.fieldErrors.source}
        </p>
      ) : null}
      {actionData?.formError ? (
        <p
          className="form-validation-error"
          role="alert"
        >
          {actionData.formError}
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
