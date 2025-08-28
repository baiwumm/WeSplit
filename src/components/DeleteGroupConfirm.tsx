import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Icon } from '@iconify-icon/react';
import type { Group } from '../types';

interface DeleteGroupConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  group: Group | null;
}

export const DeleteGroupConfirm: React.FC<DeleteGroupConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  group
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!group) return null;

  const activeMemberCount = group.members.filter(m => !m.isDeleted).length;
  const expenseCount = group.expenses.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="删除分账组"
    >
      <div className="space-y-6">
        {/* 警告图标和提示 */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Icon icon="material-symbols:warning" className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">确认删除分账组？</h3>
            <p className="text-sm text-gray-600 mt-1">此操作无法撤销</p>
          </div>
        </div>

        {/* 分账组信息 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">即将删除的分账组：</h4>
          <div className="text-sm text-red-700 space-y-1">
            <p><span className="font-medium">分账组名称：</span>{group.name}</p>
            {group.description && (
              <p><span className="font-medium">描述：</span>{group.description}</p>
            )}
            <p><span className="font-medium">成员数量：</span>{activeMemberCount} 人</p>
            <p><span className="font-medium">消费记录：</span>{expenseCount} 条</p>
          </div>
        </div>

        {/* 详细说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">删除后将丢失：</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 所有成员信息</li>
            <li>• 所有消费记录</li>
            <li>• 分账计算结果</li>
            <li>• 相关的历史数据</li>
          </ul>
        </div>

        {/* 确认按钮 */}
        <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Icon icon="material-symbols:delete-forever" className="w-4 h-4 mr-2" />
            确认删除
          </Button>
        </div>
      </div>
    </Modal>
  );
};