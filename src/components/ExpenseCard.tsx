import React, { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import type { Expense, Person } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
  onRemove: (expenseId: string) => void;
  onEdit?: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  people,
  onRemove,
  onEdit
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onRemove(expense.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(expense);
    }
  };

  const payer = people.find(p => p.id === expense.payerId);
  const participants = people.filter(p => expense.participants.includes(p.id));
  const amountPerPerson = expense.amount / expense.participants.length;

  const getAvatarColors = (id: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
      '餐饮': 'material-symbols:restaurant',
      '交通': 'material-symbols:directions-car',
      '住宿': 'material-symbols:hotel',
      '娱乐': 'material-symbols:sports-esports',
      '购物': 'material-symbols:shopping-cart',
      '其他': 'material-symbols:more-horiz'
    };
    return icons[category || '其他'] || 'material-symbols:receipt';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* 标题栏 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon
              icon={getCategoryIcon(expense.category)}
              className="text-lg text-blue-600"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{expense.title}</h3>
            <p className="text-sm text-gray-500">{formatDate(expense.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(expense.amount)}
          </span>
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              title="编辑消费记录"
            >
              <Icon icon="material-symbols:edit-outline" className="text-lg" />
            </button>
          )}
          {!showDeleteConfirm ? (
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="删除消费记录"
            >
              <Icon icon="material-symbols:delete-outline" className="text-lg" />
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleConfirmDelete}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                title="确认删除"
              >
                <Icon icon="material-symbols:check" className="text-sm" />
              </button>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="取消删除"
              >
                <Icon icon="material-symbols:close" className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 付款人信息 */}
      <div className="mb-3">
        <div className="flex items-center space-x-2">
          <Icon icon="material-symbols:payments" className="text-sm text-green-600" />
          <span className="text-sm text-gray-600">付款人：</span>
          <div className="flex items-center space-x-2">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium
              ${getAvatarColors(payer?.id || '')}
            `}>
              {payer?.avatar ? (
                <img src={payer.avatar} alt={payer.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span>{payer?.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900">{payer?.name}</span>
          </div>
        </div>
      </div>

      {/* 参与者信息 */}
      <div className="mb-3">
        <div className="flex items-start space-x-2">
          <Icon icon="material-symbols:group" className="text-sm text-blue-600 mt-0.5" />
          <div className="flex-1">
            <span className="text-sm text-gray-600">参与者：</span>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {participants.map(participant => (
                <div
                  key={participant.id}
                  className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1"
                >
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium
                    ${getAvatarColors(participant.id)}
                  `}>
                    {participant.avatar ? (
                      <img src={participant.avatar} alt={participant.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <span>{participant.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-700">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 分摊信息 */}
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            人均分摊：{formatCurrency(amountPerPerson)}
          </span>
          <span className="text-gray-600">
            {participants.length} 人参与
          </span>
        </div>
        {expense.description && (
          <p className="text-sm text-gray-600 mt-2 italic">
            {expense.description}
          </p>
        )}
      </div>
    </div>
  );
};