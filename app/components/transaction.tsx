import { Link } from "@remix-run/react/node_modules/react-router-dom";

export default function Transaction({
  id,
  title,
  date,
  amount,
  source,
}: {
  id: string;
  title: string;
  date: string;
  amount: string;
  source: string;
}) {
  return (
    <div className="transaction">
      <div>
        <p>
          <b>{title}</b>
        </p>
        <p><b>{source}</b> - {date}</p>
      </div>
      <div>
        <p>{amount}</p>
        <form method="post">
          <input type="hidden" name="transaction-id" value={id} />
          <input type="hidden" name="action" value="delete" />
          <button type="submit">Delete</button>
        </form>
        <Link to={`edit/${id}`}>
          <button type="button">Edit</button>
        </Link>
      </div>
    </div>
  );
}
