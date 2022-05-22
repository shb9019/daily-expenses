import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getTransactions().map((transaction) => {
      return db.transaction.create({ data: transaction });
    })
  );
}

seed();

function getTransactions() {

  return [
    {
      title: "Basic Pay",
      amount: 112613,
      expenseDate: new Date(2021, 12 - 1, 31)
    },
    {
      title: "House Rent Allowance",
      amount: 45045,
      expenseDate: new Date(2021, 12 - 1, 31)
    },
    {
      title: "Long Term Investment",
      amount: 250000,
      expenseDate: new Date(2021, 12 - 1, 31)
    },
    {
      title: "Leave Travel Allowance",
      amount: 2500,
      expenseDate: new Date(2021, 12 - 1, 31)
    },
    {
      title: "Provident Fund",
      amount: -13514.51,
      expenseDate: new Date(2022, 6 - 1, 1)
    },
    {
      title: "Income Tax",
      amount: -122083.32,
      expenseDate: new Date(2022, 6 - 1, 1)
    },
  ];
}
