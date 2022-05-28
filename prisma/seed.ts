import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

async function seed() {
  await Promise.all(
    getSources().map((source) => {
      return db.source.create({ data: source });
    })
  );

  const sources = await db.source.findMany();
  const numSources = sources.length;

  await Promise.all(
    getTransactions().map((transaction) => {
      return db.transaction.create({
        data: {...transaction, sourceId: sources[getRandomInt(0, numSources)].id}
      });
    })
  );
}

seed();

function getTransactions() {
  return [
    {
      title: "Basic Pay",
      amount: 112613,
      expenseDate: new Date(2021, 12 - 1, 31),
    },
    {
      title: "House Rent Allowance",
      amount: 45045,
      expenseDate: new Date(2021, 12 - 1, 31),
    },
    {
      title: "Long Term Investment",
      amount: 250000,
      expenseDate: new Date(2021, 12 - 1, 31),
    },
    {
      title: "Leave Travel Allowance",
      amount: 2500,
      expenseDate: new Date(2021, 12 - 1, 31),
    },
    {
      title: "Provident Fund",
      amount: -13514.51,
      expenseDate: new Date(2022, 6 - 1, 1),
    },
    {
      title: "Income Tax",
      amount: -122083.32,
      expenseDate: new Date(2022, 6 - 1, 1),
    },
  ];
}

function getSources() {
  return [
    {
      label: "Axis (1234)",
      description:
        "Main account. Salary is deposited to this account. Proceed with Caution",
    },
    {
      label: "SBI (3685)",
      description:
        "All cards and accounts expired for this one. No longer used.",
    },
    {
      label: "Apple",
      description: "Main apple account used for App Store and Apple TV",
    },
    {
      label: "IDBI (9999)",
      description: "Auxiliary account. All EMIs are deducted from this.",
    },
  ];
}
