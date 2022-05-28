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
        <form method="post">
          <input type="hidden" name="action" value="delete" />
          <input type="hidden" name="source-id" value={sourceId} />
          <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
}
