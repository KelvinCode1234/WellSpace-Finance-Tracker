"use client"

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Landmark, ArrowRightLeft, PiggyBank, PlusCircle, LogOut } from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { ExpenseChart } from './ExpenseChart';
import { StatsCard } from './StatsCard';
import type { Expense } from '@/lib/types';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';

interface DashboardProps {
  onLogout: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

export default function Dashboard({ onLogout }: DashboardProps) {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('wellspace_expenses', []);
  const [income, setIncome] = useLocalStorage<number>('wellspace_income', 0);
  const [savingsGoal, setSavingsGoal] = useLocalStorage<number>('wellspace_savings_goal', 0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [tempIncome, setTempIncome] = useState(income);

  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [tempSavingsGoal, setTempSavingsGoal] = useState(savingsGoal);

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const balance = useMemo(() => income - totalExpenses, [income, totalExpenses]);

  const handleSaveExpense = (expenseData: Expense) => {
    const existingIndex = expenses.findIndex(e => e.id === expenseData.id);
    if (existingIndex > -1) {
      const updatedExpenses = [...expenses];
      updatedExpenses[existingIndex] = expenseData;
      setExpenses(updatedExpenses);
    } else {
      setExpenses([...expenses, expenseData]);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };
  
  const handleOpenForm = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  }

  const handleSaveIncome = () => {
    setIncome(tempIncome);
    setIsIncomeModalOpen(false);
  };

  const handleSaveSavingsGoal = () => {
    setSavingsGoal(tempSavingsGoal);
    setIsSavingsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 sm:px-6 backdrop-blur">
          <h1 className="text-xl font-semibold text-primary">WellSpace Finance Tracker</h1>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Income" value={formatCurrency(income)} icon={Landmark} onClick={() => { setTempIncome(income); setIsIncomeModalOpen(true); }} />
            <StatsCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={ArrowRightLeft} />
            <StatsCard title="Savings Goal" value={formatCurrency(savingsGoal)} icon={PiggyBank} onClick={() => { setTempSavingsGoal(savingsGoal); setIsSavingsModalOpen(true); }}/>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                <p className="text-xs text-primary-foreground/80">
                  {savingsGoal > 0 ? `${formatCurrency(savingsGoal - balance > 0 ? savingsGoal - balance : 0)} away from your goal` : 'Set a savings goal!'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ExpenseChart expenses={expenses} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Recent Expenses</h2>
                <Button onClick={handleOpenForm}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </div>
              <ExpenseList expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
            </div>
          </div>
        </main>
      </div>

      <ExpenseForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
      />
      
      {/* Income Modal */}
      <Dialog open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Monthly Income</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="number"
              value={tempIncome}
              onChange={(e) => setTempIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter total monthly income"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={handleSaveIncome}>Save Income</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Savings Goal Modal */}
      <Dialog open={isSavingsModalOpen} onOpenChange={setIsSavingsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Savings Goal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="number"
              value={tempSavingsGoal}
              onChange={(e) => setTempSavingsGoal(parseFloat(e.target.value) || 0)}
              placeholder="Enter your savings goal"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={handleSaveSavingsGoal}>Set Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
