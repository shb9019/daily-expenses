export default function Transaction({title, date, amount} : {title: string, date: string, amount: number}) {
  return (
    <div className="transaction">
      <div>
        <p>{title}</p>
        <p>{date}</p>
      </div>
      <div>
        <p>{amount}</p>
      </div>
    </div>
  );
}
