import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type {
  SourceFormActionData,
  SourceFormLoaderData,
} from "~/components/source-form";
import SourceForm, { SourceFormAction } from "~/components/source-form";
import { badRequest } from "~/utils";
import { db } from "~/utils/db.server";
import { validateLabel, validateDescription } from "./new";
import SubFormHeader from "~/components/sub-form-header";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const sourceId = form.get("source-id");
  const label = form.get("label");
  const description = form.get("description");
  const action = form.get("action");

  if (
    typeof sourceId !== "string" ||
    typeof label !== "string" ||
    typeof description !== "string" ||
    action !== SourceFormAction.EDIT
  ) {
    return badRequest({
      formError: "Form not submitted correctly.",
    });
  }

  const source = await db.source.findFirst({
    where: { id: sourceId },
  });
  if (!source) {
    throw new Error("Source does not exist");
  }

  const fieldErrors = {
    label: validateLabel(label),
    description: validateDescription(description),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields: { label, description } });
  }

  const fields = { label, description };

  await db.source.update({
    where: { id: sourceId },
    data: { ...fields },
  });

  return redirect("/expenses/sources");
};

export const loader: LoaderFunction = async ({ params }) => {
  const { sourceId } = params;

  if (typeof sourceId !== "string") {
    return redirect("/expenses/sources");
  }

  const source = await db.source.findFirst({ where: { id: sourceId } });
  if (!source) {
    throw new Error("Source ID not found");
  }

  const data: SourceFormLoaderData = {
    sourceId: source.id,
    label: source.label,
    description: source.description,
  };

  return json(data);
};

export default function EditSourceRoute() {
  const data = useLoaderData<SourceFormLoaderData>();
  const actionData = useActionData<SourceFormActionData>();

  return (
    <div className="edit-source-wrapper">
      <SubFormHeader title="Edit Source" />
      <SourceForm
        initialSource={data}
        action={SourceFormAction.EDIT}
        actionData={actionData}
      />
    </div>
  );
}
