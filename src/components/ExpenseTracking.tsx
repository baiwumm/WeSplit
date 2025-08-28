import React, { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import { ExpenseCard } from './ExpenseCard';
import { AddExpenseForm } from './AddExpenseForm';
import { EditExpenseForm } from './EditExpenseForm';
import { Button } from './Button';
import type { Expense, Person } from '../types';
import { formatCurrency } from '../utils';

interface ExpenseTrackingProps {
  expenses: Expense[];
  people: Person[];
  onAddExpense: (
    title: string,
    amount: number,
    payerId: string,
    participants: string[],
    description?: string,
    category?: string
  ) => void;
  onUpdateExpense: (
    expenseId: string,
    title: string,
    amount: number,
    payerId: string,
    participants: string[],
    description?: string,
    category?: string
  ) => void;
  onRemoveExpense: (expenseId: string) => void;
}

export const ExpenseTracking: React.FC<ExpenseTrackingProps> = ({
  expenses,
  people,
  onAddExpense,
  onUpdateExpense,
  onRemoveExpense
}) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (data: any) => {
    onAddExpense(
      data.title,
      Number(data.amount),
      data.payerId,
      data.participants,
      data.description,
      data.category
    );
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditFormOpen(true);
  };

  const handleUpdateExpense = (data: any) => {
    if (editingExpense) {
      onUpdateExpense(
        editingExpense.id,
        data.title,
        Number(data.amount),
        data.payerId,
        data.participants,
        data.description,
        data.category
      );
    }
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingExpense(null);
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const canAddExpense = people.length >= 2;

  return (
    <div className="space-y-6">
      {/* 标题和统计信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">消费记录</h2>
          <p className="text-sm text-gray-600 mt-1">
            共 {expenses.length} 条记录，总计 {formatCurrency(totalAmount)}
          </p>
        </div>
        <Button
          onClick={() => setIsAddFormOpen(true)}
          disabled={!canAddExpense}
        >
          <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
          添加消费
        </Button>
      </div>

      {/* 提示信息 */}
      {!canAddExpense && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center">
            <Icon icon="material-symbols:info" className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">
              至少需要添加 2 个成员才能记录消费
            </p>
          </div>
        </div>
      )}

      {/* 消费记录列表 */}
      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <Icon icon="material-symbols:receipt-long" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有消费记录</h3>
          <p className="text-gray-600 mb-4">开始记录你们的消费吧</p>
          {canAddExpense && (
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
              添加第一条记录
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {expenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              people={people}
              onRemove={onRemoveExpense}
              onEdit={handleEditExpense}
            />
          ))}
        </div>
      )}

      {/* 添加消费表单 */}
      <AddExpenseForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddExpense}
        people={people}
      />

      {/* 编辑消费表单 */}
      <EditExpenseForm
        isOpen={isEditFormOpen}
        onClose={handleCloseEditForm}
        onSubmit={handleUpdateExpense}
        people={people}
        expense={editingExpense}
      />
    </div>
  );
};