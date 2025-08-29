import React, { useState } from 'react';
import { Icon } from '@iconify-icon/react';
import type { SettlementResult, Person } from '../types';
import { formatCurrency } from '../utils';
import { Button } from './Button';

interface SettlementDetailsProps {
  settlementResult: SettlementResult | null;
  people: Person[];
  onGeneratePoster?: () => void;
}

export const SettlementDetails: React.FC<SettlementDetailsProps> = ({
  settlementResult,
  people,
  onGeneratePoster
}) => {
  const [activeTab, setActiveTab] = useState<'balances' | 'transfers'>('balances');

  if (!settlementResult) {
    return (
      <div className="text-center py-12">
        <Icon icon="material-symbols:calculate" className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无分账数据</h3>
        <p className="text-gray-600 dark:text-gray-400">添加消费记录后即可查看分账结果</p>
      </div>
    );
  }

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) {
      return '已删除用户';
    }
    return person.isDeleted ? `${person.name}（已删除）` : person.name;
  };

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

  const getPersonAvatar = (personId: string) => {
    return people.find(p => p.id === personId)?.avatar;
  };

  return (
    <div className="space-y-6">
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">分账结算</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            总消费 {formatCurrency(settlementResult.totalAmount)}
          </p>
        </div>
        {onGeneratePoster && (
          <Button onClick={onGeneratePoster} variant="outline">
            <Icon icon="material-symbols:image" className="text-sm mr-2" />
            生成海报
          </Button>
        )}
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('balances')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'balances'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            个人明细
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'transfers'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            转账方案
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      {activeTab === 'balances' && (
        <div className="grid gap-4">
          {settlementResult.personBalances.map(balance => {
            // 使用严格的数值比较，考虑浮点数精度问题
            let status: string;
            let colorClass: string;
            let displayAmount: string;

            if (balance.balance > 0.01) {
              status = '应收';
              colorClass = 'text-green-600 dark:text-green-400';
              displayAmount = `+${formatCurrency(balance.balance)}`;
            } else if (balance.balance < -0.01) {
              status = '应付';
              colorClass = 'text-red-600 dark:text-red-400';
              displayAmount = formatCurrency(Math.abs(balance.balance));
            } else {
              status = '已结清';
              colorClass = 'text-gray-600 dark:text-gray-400';
              displayAmount = formatCurrency(0);
            }

            return (
              <div
                key={balance.personId}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-medium
                      ${getAvatarColors(balance.personId)}
                    `}>
                      {getPersonAvatar(balance.personId) ? (
                        <img
                          src={getPersonAvatar(balance.personId)}
                          alt={getPersonName(balance.personId)}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">
                          {getPersonName(balance.personId).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {getPersonName(balance.personId)}
                      </h3>
                      <p className={`text-sm font-medium ${colorClass}`}>
                        {status}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-semibold ${colorClass}`}>
                      {displayAmount}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">总支付</span>
                      <span className="font-semibold text-blue-800 dark:text-blue-200">
                        {formatCurrency(balance.totalPaid)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/50 border border-orange-200 dark:border-orange-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700 dark:text-orange-300 font-medium">应分摊</span>
                      <span className="font-semibold text-orange-800 dark:text-orange-200">
                        {formatCurrency(balance.totalShare)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="space-y-4">
          {settlementResult.optimalTransfers.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon="material-symbols:check-circle" className="text-4xl text-green-500 dark:text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">账目已平衡</h3>
              <p className="text-gray-600 dark:text-gray-400">所有人的账目都已平衡，无需转账</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Icon icon="material-symbols:info" className="text-lg text-blue-600 dark:text-blue-400 mr-2" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    共需 {settlementResult.optimalTransfers.length} 笔转账完成结算
                  </p>
                </div>
              </div>

              {settlementResult.optimalTransfers.map((transfer, index) => (
                <div
                  key={`${transfer.fromPersonId}-${transfer.toPersonId}-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* 付款人 */}
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                          ${getAvatarColors(transfer.fromPersonId)}
                        `}>
                          {getPersonAvatar(transfer.fromPersonId) ? (
                            <img
                              src={getPersonAvatar(transfer.fromPersonId)}
                              alt={getPersonName(transfer.fromPersonId)}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {getPersonName(transfer.fromPersonId).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getPersonName(transfer.fromPersonId)}
                        </span>
                      </div>

                      {/* 箭头 */}
                      <Icon icon="material-symbols:arrow-forward" className="text-xl text-gray-400 dark:text-gray-500" />

                      {/* 收款人 */}
                      <div className="flex items-center space-x-2">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                          ${getAvatarColors(transfer.toPersonId)}
                        `}>
                          {getPersonAvatar(transfer.toPersonId) ? (
                            <img
                              src={getPersonAvatar(transfer.toPersonId)}
                              alt={getPersonName(transfer.toPersonId)}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span>
                              {getPersonName(transfer.toPersonId).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getPersonName(transfer.toPersonId)}
                        </span>
                      </div>
                    </div>

                    {/* 金额 */}
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(transfer.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};