import React, { useState, useEffect, useRef } from 'react';
import { PersonManagement } from '../components/PersonManagement';
import { ExpenseTracking } from '../components/ExpenseTracking';
import { SettlementDetails } from '../components/SettlementDetails';
import { PosterGenerator } from '../components/PosterGenerator';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { EditGroupForm } from '../components/EditGroupForm';
import { DeleteGroupConfirm } from '../components/DeleteGroupConfirm';
import { ClearDataConfirm } from '../components/ClearDataConfirm';
import { useAppStore } from '../store/useAppStore';
import type { Group } from '../types';
import { Icon } from '@iconify-icon/react';

export const HomePage: React.FC = () => {
  const {
    currentGroup,
    groups,
    createGroup,
    updateGroup,
    removeGroup,
    switchGroup,
    addPerson,
    removePerson,
    addExpense,
    updateExpense,
    removeExpense,
    getSettlementResult,
    clearAllData
  } = useAppStore();

  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [groupForm, setGroupForm] = useState({ name: '', description: '' });
  const groupMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (groupMenuRef.current && !groupMenuRef.current.contains(event.target as Node)) {
        setIsGroupMenuOpen(false);
      }
    };

    if (isGroupMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGroupMenuOpen]);

  const handleAddPerson = (name: string, avatar?: string) => {
    addPerson(name, avatar);
  };

  const handleAddExpense = (
    title: string,
    amount: number,
    payerId: string,
    participants: string[],
    description?: string,
    category?: string
  ) => {
    addExpense(title, amount, payerId, participants, description, category);
  };

  const handleUpdateExpense = (
    expenseId: string,
    title: string,
    amount: number,
    payerId: string,
    participants: string[],
    description?: string,
    category?: string
  ) => {
    updateExpense(expenseId, title, amount, payerId, participants, description, category);
  };

  // 创建新分账组
  const handleCreateGroup = () => {
    if (!groupForm.name.trim()) {
      alert('请输入分账组名称');
      return;
    }

    const result = createGroup(groupForm.name, groupForm.description);

    setGroupForm({ name: '', description: '' });
    setIsCreateGroupOpen(false);
  };

  // 编辑分账组
  const handleEditGroup = (name: string, description?: string) => {
    if (currentGroup) {
      updateGroup(currentGroup.id, name, description);
    }
  };

  // 删除分账组
  const handleDeleteGroup = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteGroupOpen(true);
    setIsGroupMenuOpen(false);
  };

  const handleConfirmDeleteGroup = () => {
    if (groupToDelete) {
      const result = removeGroup(groupToDelete.id);
      if (!result.success) {
        alert(result.message);
      }
      setGroupToDelete(null);
    }
  };

  // 清空所有数据
  const handleClearAllData = () => {
    clearAllData();
  };

  const handleCloseCreateGroup = () => {
    setGroupForm({ name: '', description: '' });
    setIsCreateGroupOpen(false);
  };

  // 切换分账组
  const handleSwitchGroup = (groupId: string) => {
    switchGroup(groupId);
    setIsGroupMenuOpen(false);
  };

  const settlementResult = getSettlementResult();

  // 过滤掉已删除的成员
  const activeMembers = currentGroup ? currentGroup.members.filter(member => !member.isDeleted) : [];
  const activeMemberCount = activeMembers.length;
  const totalMemberCount = currentGroup ? currentGroup.members.length : 0;

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">欢迎使用人均分账</h1>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧：当前分账组 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon icon="material-symbols:receipt-long" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{currentGroup.name}</h2>
                {currentGroup.description && (
                  <p className="text-sm text-gray-600">{currentGroup.description}</p>
                )}
              </div>
              <button
                onClick={() => setIsEditGroupOpen(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                title="编辑分账组"
              >
                <Icon icon="material-symbols:edit-outline" className="w-5 h-5" />
              </button>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center space-x-3">
              {/* 删除当前分账组 */}
              {groups.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteGroup(currentGroup)}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Icon icon="material-symbols:delete-outline" className="w-4 h-4 mr-2" />
                  删除当前组
                </Button>
              )}

              {/* 清空数据 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsClearDataOpen(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Icon icon="material-symbols:delete-sweep" className="w-4 h-4 mr-2" />
                清空数据
              </Button>

              {/* 切换分账组 */}
              {groups.length > 1 && (
                <div className="relative" ref={groupMenuRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsGroupMenuOpen(!isGroupMenuOpen)}
                  >
                    <Icon icon="material-symbols:swap-horiz" className="w-4 h-4 mr-2" />
                    切换组
                  </Button>

                  {/* 分账组下拉菜单 */}
                  {isGroupMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-2">切换到其他分账组</p>
                        {groups.filter(g => g.id !== currentGroup.id).map(group => (
                          <div
                            key={group.id}
                            className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <button
                              onClick={() => handleSwitchGroup(group.id)}
                              className="flex-1 text-left"
                            >
                              <div className="font-medium text-gray-900">{group.name}</div>
                              <div className="text-sm text-gray-600">
                                {group.members.filter(m => !m.isDeleted).length} 人 · {group.expenses.length} 条记录
                              </div>
                            </button>

                            {/* 删除按钮 */}
                            {groups.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteGroup(group);
                                }}
                                className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="删除分账组"
                              >
                                <Icon icon="material-symbols:delete-outline" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 创建新分账组 */}
              <Button
                onClick={() => setIsCreateGroupOpen(true)}
                size="sm"
              >
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                新建组
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* 内容区域 */}
        <div className="space-y-8">
          {/* 成员管理 */}
          <section>
            <PersonManagement
              people={activeMembers}
              onAddPerson={handleAddPerson}
              onRemovePerson={removePerson}
            />
          </section>

          {/* 消费记录 */}
          <section>
            <ExpenseTracking
              expenses={currentGroup.expenses}
              people={activeMembers}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onRemoveExpense={removeExpense}
            />
          </section>

          {/* 分账结算 */}
          <section>
            <SettlementDetails
              settlementResult={settlementResult}
              people={currentGroup.members}
              onGeneratePoster={() => setIsPosterOpen(true)}
            />
          </section>
        </div>

        {/* 海报生成器 */}
        <PosterGenerator
          isOpen={isPosterOpen}
          onClose={() => setIsPosterOpen(false)}
          settlementResult={settlementResult}
          people={currentGroup.members}
          group={currentGroup}
        />

        {/* 创建分账组弹窗 */}
        <Modal
          isOpen={isCreateGroupOpen}
          onClose={handleCloseCreateGroup}
          title="创建新分账组"
        >
          <div className="space-y-6">
            <Input
              label="分账组名称"
              value={groupForm.name}
              onChange={(value) => setGroupForm(prev => ({ ...prev, name: value }))}
              placeholder="例如：北京旅行、同学聚会"
              required
            />

            <Input
              label="描述（可选）"
              value={groupForm.description}
              onChange={(value) => setGroupForm(prev => ({ ...prev, description: value }))}
              placeholder="添加一些描述信息"
            />

            <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleCloseCreateGroup}
              >
                取消
              </Button>
              <Button onClick={handleCreateGroup}>
                创建
              </Button>
            </div>
          </div>
        </Modal>

        {/* 编辑分账组弹窗 */}
        <EditGroupForm
          isOpen={isEditGroupOpen}
          onClose={() => setIsEditGroupOpen(false)}
          onSubmit={handleEditGroup}
          group={currentGroup}
        />

        {/* 清空数据确认对话框 */}
        <ClearDataConfirm
          isOpen={isClearDataOpen}
          onClose={() => setIsClearDataOpen(false)}
          onConfirm={handleClearAllData}
        />

        {/* 删除分账组确认对话框 */}
        <DeleteGroupConfirm
          isOpen={isDeleteGroupOpen}
          onClose={() => {
            setIsDeleteGroupOpen(false);
            setGroupToDelete(null);
          }}
          onConfirm={handleConfirmDeleteGroup}
          group={groupToDelete}
        />
      </div>
    </div>
  );
};