import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { useAppStore } from './store/useAppStore';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Modal } from './components/Modal';
import { ThemeToggle } from './components/ThemeToggle';
import { Icon } from '@iconify-icon/react';
import { useTheme } from './hooks/useTheme';

function App() {
  const {
    currentGroup,
    groups,
    createGroup,
    isLoading,
    initializeData
  } = useAppStore();

  const { isDarkMode } = useTheme();
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">正在加载...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* 主题切换按钮 */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-20"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* 主标题区域 */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Icon icon="material-symbols:receipt-long" className="text-4xl text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <Icon icon="material-symbols:check" className="text-sm text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              WeSplit
              <span className="block text-2xl md:text-3xl font-medium text-blue-600 dark:text-blue-400 mt-3">
                轻松分账，快乐聚餐
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              让聚餐、旅行、聚会的费用分摊变得简单透明，自动计算最优转账方案，告别复杂的账目计算
            </p>

            <Button
              onClick={() => setIsCreateGroupOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Icon icon="material-symbols:add" className="text-lg mr-2" />
              开始创建分账组
            </Button>
          </div>

          {/* 功能特性展示 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                <Icon icon="material-symbols:group" className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">智能成员管理</h3>
              <p className="text-gray-600 dark:text-gray-300">添加成员、自定义头像，智能保护有付款记录的成员数据</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                <Icon icon="material-symbols:calculate" className="text-2xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">自动分账计算</h3>
              <p className="text-gray-600 dark:text-gray-300">实时计算每个人的应付应收，使用贪心算法生成最优转账方案</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                <Icon icon="material-symbols:image" className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">一键生成海报</h3>
              <p className="text-gray-600 dark:text-gray-300">生成精美的分账结果海报，支持高清下载和分享</p>
            </div>
          </div>

          {/* 使用场景示例 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">适用场景</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="material-symbols:restaurant" className="text-3xl text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">聚餐聚会</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">朋友聚餐、生日聚会</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="material-symbols:flight" className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">旅行出游</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">团队旅行、自驾游</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="material-symbols:shopping-cart" className="text-3xl text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">团购拼单</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">合买物品、团购优惠</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="material-symbols:home" className="text-3xl text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">室友生活</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">房租水电、日常开销</p>
              </div>
            </div>
          </div>

          {/* 历史分账组 */}
          {groups.length > 0 && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Icon icon="material-symbols:history" className="text-xl text-gray-500 dark:text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">历史分账组</h2>
              </div>
              <div className="space-y-3">
                {groups.map(group => (
                  <div key={group.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon icon="material-symbols:receipt-long" className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{group.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {group.members.filter(m => !m.isDeleted).length} 人 · {group.expenses.length} 条记录
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500"
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

export default App;

