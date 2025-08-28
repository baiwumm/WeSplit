import React, { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import { PersonCard } from './PersonCard';
import { AddPersonForm } from './AddPersonForm';
import { Button } from './Button';
import type { Person } from '../types';

interface PersonManagementProps {
  people: Person[];
  onAddPerson: (name: string, avatar?: string) => void;
  onRemovePerson: (personId: string) => void;
}

export const PersonManagement: React.FC<PersonManagementProps> = ({
  people,
  onAddPerson,
  onRemovePerson
}) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleAddPerson = (data: { name: string; avatar?: string }) => {
    onAddPerson(data.name, data.avatar);
  };

  const existingNames = people.map(p => p.name);

  return (
    <div className="space-y-6">
      {/* 标题和添加按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">成员管理</h2>
          <p className="text-sm text-gray-600 mt-1">
            添加参与分账的成员（{people.length}人）
          </p>
        </div>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Icon icon="material-symbols:person-add" className="w-4 h-4 mr-2" />
          添加成员
        </Button>
      </div>

      {/* 成员列表 */}
      {people.length === 0 ? (
        <div className="text-center py-12">
          <Icon icon="material-symbols:group" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有成员</h3>
          <p className="text-gray-600 mb-4">开始添加参与分账的成员吧</p>
          <Button onClick={() => setIsAddFormOpen(true)}>
            <Icon icon="material-symbols:person-add" className="w-4 h-4 mr-2" />
            添加第一个成员
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onRemove={onRemovePerson}
            />
          ))}
        </div>
      )}

      {/* 添加成员表单 */}
      <AddPersonForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddPerson}
        existingNames={existingNames}
      />
    </div>
  );
};