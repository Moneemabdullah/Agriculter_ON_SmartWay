import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, Download, Check } from 'lucide-react';
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

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

const transactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2025-10-20',
    description: 'Premium Subscription - Monthly',
    amount: 2500,
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
    id: 'TXN003',
    date: '2025-10-10',
    description: 'Data Analytics Add-on',
    amount: 1500,
    status: 'completed',
  },
  {
    id: 'TXN004',
    date: '2025-10-05',
    description: 'Additional Storage - 50GB',
    amount: 500,
    status: 'pending',
  },
];

export function PaymentsPanel() {
  const handlePayment = () => {
    // Mock SSLCommerz integration
    alert('Redirecting to SSLCommerz payment gateway...\n\nNote: This is a demo. In production, this would integrate with SSLCommerz API.');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">Premium</p>
            <p className="text-sm text-gray-500 mt-1">₹2,500/month</p>
            <Button className="w-full mt-4" variant="outline">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">₹19,500</p>
            <p className="text-sm text-gray-500 mt-1">Last 3 months</p>
            <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
              <Check className="h-4 w-4" />
              All payments up to date
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">₹2,500</p>
            <p className="text-sm text-gray-500 mt-1">Due on Nov 20, 2025</p>
            <Button className="w-full mt-4" onClick={handlePayment}>
              Pay Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (BDT)</Label>
              <Input id="amount" type="number" placeholder="Enter amount" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" placeholder="e.g., Subscription renewal" />
            </div>
          </div>
          <Button onClick={handlePayment} className="w-full md:w-auto">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with SSLCommerz
          </Button>
          <p className="text-xs text-gray-500">
            Secure payment powered by SSLCommerz. Supports credit/debit cards, mobile banking, and internet banking.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.id}</TableCell>
                  <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell>₹{txn.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        txn.status === 'completed'
                          ? 'default'
                          : txn.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        txn.status === 'completed' ? 'bg-green-500' : ''
                      }
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
