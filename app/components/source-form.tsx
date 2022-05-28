export type SourceFormLoaderData = {
  sourceId: string;
  label: string;
  description: string;
};

export type SourceFormActionData = {
  formError?: string;
  fieldErrors?: {
    label: string | undefined;
    description: string | undefined;
  };
  fields?: {
    label: string;
    description: string;
  };
};

export enum SourceFormAction {
  ADD = "add",
  EDIT = "edit",
}

export default function SourceForm({
  actionData,
  action,
  initialSource,
}: {
  actionData?: SourceFormActionData;
  action: SourceFormAction;
  initialSource?: SourceFormLoaderData;
}) {
  return (
    <form method="post">
      <div className="input-group">
        <label htmlFor="label">Label</label>
        <input
          type="text"
          name="label"
          defaultValue={actionData?.fields?.label ?? initialSource?.label}
          aria-invalid={Boolean(actionData?.fieldErrors?.label) || undefined}
          aria-errormessage={
            actionData?.fieldErrors?.label ? "label-error" : undefined
          }
        />
      </div>
      <div className="input-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          defaultValue={
            actionData?.fields?.description ?? initialSource?.description
          }
          aria-invalid={
            Boolean(actionData?.fieldErrors?.description) || undefined
          }
          aria-errormessage={
            actionData?.fieldErrors?.description
              ? "expense-date-error"
              : undefined
          }
        />
      </div>
      <input type="hidden" name="source-id" value={initialSource?.sourceId} />
      <input type="hidden" name="action" value={action} />
      {actionData?.fieldErrors?.label ? (
        <p className="form-validation-error" role="alert" id="label-error">
          {actionData.fieldErrors.label}
        </p>
      ) : null}
      {actionData?.fieldErrors?.description ? (
        <p
          className="form-validation-error"
          role="alert"
          id="description-error"
        >
          {actionData.fieldErrors.description}
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
      <div className="submit">
        <button type="submit" className="button">
          {action === SourceFormAction.ADD ? "Add" : "Edit"}
        </button>
      </div>
    </form>
  );
}
