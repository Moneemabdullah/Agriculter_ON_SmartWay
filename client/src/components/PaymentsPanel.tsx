import { useState, useMemo, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, Download, Check, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

// --- Type Definitions ---
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

// --- Initial Mock Data ---
const initialTransactions: Transaction[] = [
  {
    id: 'TXN004',
    date: '2025-11-05',
    description: 'Additional Storage - 50GB',
    amount: 500,
    status: 'pending',
  },
  {
    id: 'TXN003',
    date: '2025-10-10',
    description: 'Data Analytics Add-on',
    amount: 1500,
    status: 'completed',
  },
  {
    id: 'TXN002',
    date: '2025-10-15',
    description: 'IoT Sensor Package',
    amount: 15000,
    status: 'completed',
  },
  {
    id: 'TXN001',
    date: '2025-10-20',
    description: 'Premium Subscription - Monthly',
    amount: 2500,
    status: 'completed',
  },
];

// --- Utility for Currency Formatting ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT', // Using BDT for Bangladeshi Taka
    minimumFractionDigits: 0, // Simplify for whole numbers
  }).format(amount);
};

// --- Main Component ---
export function PaymentsPanel() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [quickAmount, setQuickAmount] = useState<number | string>('');
  const [quickPurpose, setQuickPurpose] = useState('');
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Dynamic Calculation for Total Spent
  const totalSpent = useMemo(() => {
    return transactions
      .filter(txn => txn.status === 'completed')
      .reduce((sum, txn) => sum + txn.amount, 0);
  }, [transactions]);

  const handlePayment = (amount: number, description: string) => {
    // Mock SSLCommerz integration
    const message = `Redirecting to SSLCommerz for ${description} payment of ${formatCurrency(amount)}...\n\nNote: This is a demo.`;
    alert(message);
  };

  const handleQuickPaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amountNum = Number(quickAmount);

    if (amountNum <= 0 || !quickPurpose.trim()) {
      setPaymentMessage({ type: 'error', message: 'Please enter a valid amount and purpose.' });
      return;
    }

    handlePayment(amountNum, quickPurpose);

    // Simulate successful payment and adding a new transaction
    const newTransaction: Transaction = {
      id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      description: quickPurpose,
      amount: amountNum,
      status: 'completed',
    };

    // Add the new transaction to the start of the list
    setTransactions(prev => [newTransaction, ...prev]);
    setQuickAmount('');
    setQuickPurpose('');
    setPaymentMessage({ type: 'success', message: `Payment of ${formatCurrency(amountNum)} for '${quickPurpose}' completed!` });
    
    // Clear the message after a few seconds
    setTimeout(() => setPaymentMessage(null), 5000);
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-bold">💳 Payment & Billing</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {/* --- Card 1: Current Plan --- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-indigo-600">Premium</p>
            <p className="text-sm text-gray-500 mt-1">{formatCurrency(2500)}/month</p>
            <Button className="w-full mt-4" variant="outline">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        {/* --- Card 2: Total Spent (Dynamic) --- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-gray-500 mt-1">From completed transactions</p>
            <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
              <Check className="h-4 w-4" />
              **All completed payments tracked**
            </div>
          </CardContent>
        </Card>

        {/* --- Card 3: Next Payment --- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-red-600">{formatCurrency(2500)}</p>
            <p className="text-sm text-gray-500 mt-1">Due on Nov 20, 2025</p>
            <Button className="w-full mt-4" onClick={() => handlePayment(2500, 'Next Subscription Payment')}>
              Pay Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <hr className="my-6" />

      {/* 🚀 Quick Payment Form (Interactive) */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Payment</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMessage && (
            <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 ${paymentMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {paymentMessage.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {paymentMessage.message}
            </div>
          )}
          <form onSubmit={handleQuickPaymentSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (BDT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 1200"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Invoice #1234 or Balance Top-up"
                  value={quickPurpose}
                  onChange={(e) => setQuickPurpose(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <CreditCard className="mr-2 h-4 w-4" />
              **Proceed to SSLCommerz**
            </Button>
            <p className="text-xs text-gray-500">
              Secure payment powered by SSLCommerz. Your payment will be logged in the transaction history below.
            </p>
          </form>
        </CardContent>
      </Card>

      <hr className="my-6" />

      {/* 🧾 Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">ID</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="text-right min-w-[120px]">Amount</TableHead>
                  <TableHead className="text-center min-w-[100px]">Status</TableHead>
                  <TableHead className="text-center min-w-[80px]">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id}</TableCell>
                      <TableCell>{new Date(txn.date).toLocaleDateString('en-BD')}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(txn.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" title="Download Invoice">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}