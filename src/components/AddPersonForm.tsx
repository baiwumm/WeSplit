import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import type { PersonFormData } from '../types';
import { validatePersonForm } from '../utils';

interface AddPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonFormData) => void;
  existingNames: string[];
}

export const AddPersonForm: React.FC<AddPersonFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingNames
}) => {
  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    avatar: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validatePersonForm(formData, existingNames);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ name: '', avatar: '' });
    setErrors([]);
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', avatar: '' });
    setErrors([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="添加成员">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <ul className="text-sm text-red-600 dark:text-red-400">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <Input
          label="姓名"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="输入成员姓名"
          required
        />

        <Input
          label="头像链接（可选）"
          value={formData.avatar || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, avatar: value }))}
          placeholder="输入头像图片链接"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            取消
          </Button>
          <Button type="submit">
            添加
          </Button>
        </div>
      </form>
    </Modal>
  );
};