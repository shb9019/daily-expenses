import type { LinksFunction } from "@remix-run/node";
import Transaction from "~/components/transaction"

import transactionsStylesUrl from "~/styles/transactions.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: transactionsStylesUrl,
    },
  ];
};

export default function TransactionsRoute() {
  return (
    <div>
      <Transaction title="Flowers" date="10/10/2022" amount={100} />
      <Transaction title="Animals" date="10/10/2022" amount={6000} />
      <Transaction title="Animals" date="10/10/2022" amount={2000} />
    </div>
  );
}
