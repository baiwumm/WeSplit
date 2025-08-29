import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Icon } from '@iconify-icon/react';

interface ClearDataConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearDataConfirm: React.FC<ClearDataConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="清空所有数据"
    >
      <div className="space-y-6">
        {/* 警告图标和提示 */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <Icon icon="material-symbols:warning" className="text-2xl text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">确认清空所有数据？</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">此操作无法撤销</p>
          </div>
        </div>

        {/* 详细说明 */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">以下数据将被永久删除：</h4>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
            <li>• 所有分账组信息</li>
            <li>• 所有成员信息</li>
            <li>• 所有消费记录</li>
            <li>• 所有分账结算数据</li>
          </ul>
        </div>

        {/* 确认按钮 */}
        <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100 dark:border-gray-700">
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
            <Icon icon="material-symbols:delete-forever" className="text-sm mr-2" />
            确认清空
          </Button>
        </div>
      </div>
    </Modal>
  );
};