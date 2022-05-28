import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import SourceCard from "~/components/source-card";

import sourcesStylesUrl from "~/styles/sources.css";
import { db } from "~/utils/db.server";

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

export const loader: LoaderFunction = async () => {
  const sources = await db.source.findMany();
  const data: LoaderData = {
    sources,
  };

  return json(data);
};

export default function SourcesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      {data.sources.map((source) => (
        <SourceCard
          key={source.id}
          title={source.label}
          description={source.description}
        />
      ))}
    </div>
  );
}
