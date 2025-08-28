import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { CheckboxGroup } from './CheckboxGroup';
import { Modal } from './Modal';
import type { Person, ExpenseFormData } from '../types';
import { validateExpenseForm } from '../utils';

interface AddExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  people: Person[];
}

const categories = [
  { value: '餐饮', label: '餐饮' },
  { value: '交通', label: '交通' },
  { value: '住宿', label: '住宿' },
  { value: '娱乐', label: '娱乐' },
  { value: '购物', label: '购物' },
  { value: '其他', label: '其他' }
];

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  people
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    amount: '',
    payerId: '',
    participants: [],
    description: '',
    category: '其他'
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateExpenseForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    setFormData({
      title: '',
      amount: '',
      payerId: '',
      participants: [],
      description: '',
      category: '其他'
    });
    setErrors([]);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      amount: '',
      payerId: '',
      participants: [],
      description: '',
      category: '其他'
    });
    setErrors([]);
    onClose();
  };

  const personOptions = people.map(person => ({
    value: person.id,
    label: person.name
  }));

  const checkboxOptions = people.map(person => ({
    value: person.id,
    label: person.name,
    avatar: person.avatar
  }));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="添加消费记录" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <ul className="text-sm text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="消费项目"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            placeholder="例如：晚餐、打车费"
            required
          />

          <Input
            label="金额"
            type="number"
            value={formData.amount}
            onChange={(value) => setFormData(prev => ({ ...prev, amount: value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="付款人"
            value={formData.payerId}
            onChange={(value) => setFormData(prev => ({ ...prev, payerId: value }))}
            options={personOptions}
            placeholder="选择付款人"
            required
          />

          <Select
            label="消费类别"
            value={formData.category || '其他'}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            options={categories}
          />
        </div>

        <CheckboxGroup
          label="参与分账的人员"
          options={checkboxOptions}
          selected={formData.participants}
          onChange={(selected) => setFormData(prev => ({ ...prev, participants: selected }))}
          required
        />

        <Input
          label="备注（可选）"
          value={formData.description || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="添加备注信息"
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            取消
          </Button>
          <Button type="submit">
            添加记录
          </Button>
        </div>
      </form>
    </Modal>
  );
};