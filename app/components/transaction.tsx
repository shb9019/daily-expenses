export default function Transaction({id, title, date, amount} : {id: string, title: string, date: string, amount: string}) {
  return (
    <div className="transaction">
      <div>
        <p><b>{title}</b></p>
        <p>{date}</p>
      </div>
      <div>
        <p>{amount}</p>
        <form method="post">
          <input type="hidden" name="transaction-id" value={id} />
          <input type="hidden" name="action" value="delete" />
          <button type="submit">Delete</button>
        </form>
        <form method="post">
          <input type="hidden" name="transaction-id" value={id} />
          <input type="hidden" name="action" value="edit" />
          <button type="submit">Edit</button>
        </form>
      </div>
    </div>
  );
}
