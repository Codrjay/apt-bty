import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: number;
  category: string;
  sales: number;
  date: string;
}

const TransactionChart: React.FC = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [averageSales, setAverageSales] = useState<number>(0);
  const [categorySales, setCategorySales] = useState<{ [key: string]: number }>({});
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch total sales data
    fetch("https://3000-codrjay-aptbty-giye6tb1v0q.ws-eu117.gitpod.io/total-sales")
      .then((response) => response.json())
      .then((data) => setTotalSales(data.totalSales));

    // Fetch transactions by category
    fetch("https://3000-codrjay-aptbty-giye6tb1v0q.ws-eu117.gitpod.io/transactions-by-category")
      .then((response) => response.json())
      .then((data) => {
        const categoryCounts: { [key: string]: number } = {};
        data.forEach((item: any) => {
          categoryCounts[item.category] = item.transaction_count;
        });
        setCategorySales(categoryCounts);
      });

    // Fetch all transactions for total count and recent transactions
    fetch("https://3000-codrjay-aptbty-giye6tb1v0q.ws-eu117.gitpod.io/transactions")
      .then((response) => response.json())
      .then((data: Transaction[]) => {
        setTotalTransactions(data.length);
        const totalTransactionSales = data.reduce((sum, transaction) => sum + transaction.sales, 0);
        setAverageSales(data.length ? totalTransactionSales / data.length : 0);

        const sortedTransactions = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentTransactions(sortedTransactions.slice(0, 5));
      });
  }, []);

  const chartData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        data: Object.values(categorySales),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p><strong>Total Sales:</strong> {totalSales}</p>
      <p><strong>Total Transactions:</strong> {totalTransactions}</p>
      <p><strong>Average Sales Per Transaction:</strong> {averageSales.toFixed(2)}</p>

      <h3>Sales by Category</h3>
      <Pie data={chartData} />

      <h3>Recent Transactions</h3>
      <ul>
        {recentTransactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>Category:</strong> {transaction.category}, 
            <strong> Sales:</strong> {transaction.sales}, 
            <strong> Date:</strong> {new Date(transaction.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionChart;
