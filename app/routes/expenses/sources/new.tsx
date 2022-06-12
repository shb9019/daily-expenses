import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import SourceForm, { SourceFormAction } from "~/components/source-form";
import SubFormHeader from "~/components/sub-form-header";
import { TransactionFormAction } from "~/components/transaction-form";

import newTransactionStylesUrl from "~/styles/new-transaction.css";
import { db } from "~/utils/db.server";

export type ActionData = {
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

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: newTransactionStylesUrl,
    },
  ];
};

export function validateLabel(title: string) {
  if (title.length == 0) {
    return "Title cannot be empty!";
  }
}

export function validateDescription(description: string) {
  if (description.length == 0) {
    return "Description cannot be empty!";
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const label = form.get("label");
  const description = form.get("description");
  const action = form.get("action");

  if (
    typeof label !== "string" ||
    typeof description !== "string" ||
    action !== TransactionFormAction.ADD
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    label: validateLabel(label),
    description: validateDescription(description),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: { label, description } });
  }

  const fields = { label, description };

  await db.source.create({
    data: { ...fields },
  });

  return redirect(`/expenses/sources`);
};

export default function NewSourceRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="new-source-wrapper">
      <SubFormHeader title="Add Source" />
      <SourceForm action={SourceFormAction.ADD} actionData={actionData} />
    </div>
  );
}
