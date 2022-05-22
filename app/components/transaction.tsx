export default function Transaction({title, date, amount} : {title: string, date: string, amount: string}) {
  return (
    <div className="transaction">
      <div>
        <p><b>{title}</b></p>
        <p>{date}</p>
      </div>
      <div>
        <p>{amount}</p>
      </div>
    </div>
  );
}
