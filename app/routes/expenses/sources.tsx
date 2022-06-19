import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import SourceCard from "~/components/source-card";

import sourcesStylesUrl from "~/styles/sources.css";
import { badRequest } from "~/utils";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

type LoaderData = {
  sources: Array<{ id: string; label: string; description: string }>;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: sourcesStylesUrl,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const sources = await db.source.findMany({ where: { userId } });
  const data: LoaderData = {
    sources,
  };

  return json(data);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action");
  const sourceId = form.get("source-id");
  const userId = await requireUserId(request);

  if (typeof action !== "string" || typeof sourceId !== "string") {
    return badRequest({
      formError: "Form not submitted correctly.",
    });
  }

  const source = await db.source.findFirst({ where: { AND: {id: sourceId, userId} } });
  if (!source) {
    return badRequest({
      formError: "Source does not exist!",
    });
  }

  switch (action) {
    case "delete": {
      await db.source.delete({ where: { id: sourceId } });
      return redirect("/expenses/sources");
    }
    default:
      return badRequest({
        formError: "Action type invalid",
      });
  }
};

export default function SourcesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="sources-wrapper">
      <div>
        <div>
          {data.sources.map((source) => (
            <SourceCard
              key={source.id}
              sourceId={source.id}
              title={source.label}
              description={source.description}
            />
          ))}
        </div>
        <div className="new-source-button">
          <Link to="new">
            <button type="button">Create Source</button>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
