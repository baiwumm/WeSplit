import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import type { Group } from '../types';

interface EditGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
  group: Group | null;
}

export const EditGroupForm: React.FC<EditGroupFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  group
}) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  // 当 group 变化时，更新表单数据
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || ''
      });
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('请输入分账组名称');
      return;
    }

    onSubmit(formData.name, formData.description);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="编辑分账组"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="分账组名称"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="例如：北京旅行、同学聚会"
          required
        />

        <Input
          label="描述（可选）"
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="添加一些描述信息"
        />

        <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            取消
          </Button>
          <Button type="submit">
            保存修改
          </Button>
        </div>
      </form>
    </Modal>
  );
};