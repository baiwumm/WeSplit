import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { useAppStore } from './store/useAppStore';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Modal } from './components/Modal';
import { Icon } from '@iconify-icon/react';

function App() {
  const {
    currentGroup,
    groups,
    createGroup,
    isLoading,
    initializeData
  } = useAppStore();

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', description: '' });

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, [initializeData]);


  // 创建分账组
  const handleCreateGroup = () => {
    if (!groupForm.name.trim()) {
      alert('请输入分账组名称');
      return;
    }

    createGroup(groupForm.name, groupForm.description);
    setGroupForm({ name: '', description: '' });
    setIsCreateGroupOpen(false);
  };

  const handleCloseCreateGroup = () => {
    setGroupForm({ name: '', description: '' });
    setIsCreateGroupOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="material-symbols:receipt-long" className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">人均分账</h1>
            <p className="text-gray-600 mb-8">
              轻松管理朋友聚会、旅行等场景的分账，自动计算最优转账方案
            </p>
            <Button
              onClick={() => setIsCreateGroupOpen(true)}
              size="lg"
            >
              <Icon icon="material-symbols:add" className="w-5 h-5 mr-2" />
              创建分账组
            </Button>
          </div>

          {groups.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">历史分账组</h2>
              <div className="space-y-3">
                {groups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-600">
                        {group.members.length} 人 · {group.expenses.length} 条记录
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      查看
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 创建分账组弹窗 */}
        <Modal
          isOpen={isCreateGroupOpen}
          onClose={handleCloseCreateGroup}
          title="创建分账组"
        >
          <div className="space-y-6">
            <Input
              label="分账组名称"
              value={groupForm.name}
              onChange={(value) => setGroupForm(prev => ({ ...prev, name: value }))}
              placeholder="例如：三亚旅行、聚餐AA"
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
      </div>
    );
  }

  return <HomePage />;
}

export default App
