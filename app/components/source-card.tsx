export default function SourceCard({title, description} : {title: string, description: string}) {
  return (
    <div className="source-card">
      <div className="title">
        {title}
      </div>
      <div className="description">
        {description}
      </div>
    </div>
  );
}
