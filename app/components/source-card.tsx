import { Link } from "@remix-run/react";

export default function SourceCard({
  title,
  description,
  sourceId,
}: {
  title: string;
  description: string;
  sourceId: string;
}) {
  return (
    <div className="source-card">
      <div className="title">{title}</div>
      <div className="description">{description}</div>
      <div>
        <form method="post" className="source-delete-form">
          <input type="hidden" name="action" value="delete" />
          <input type="hidden" name="source-id" value={sourceId} />
          <button type="submit">Delete</button>
        </form>
        <Link to={`edit/${sourceId}`}>
          <button type="button">Edit</button>
        </Link>
      </div>
    </div>
  );
}
