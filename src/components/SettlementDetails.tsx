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
        <Icon icon="material-symbols:calculate" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无分账数据</h3>
        <p className="text-gray-600">添加消费记录后即可查看分账结果</p>
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
          <h2 className="text-xl font-semibold text-gray-900">分账结算</h2>
          <p className="text-sm text-gray-600 mt-1">
            总消费 {formatCurrency(settlementResult.totalAmount)}
          </p>
        </div>
        {onGeneratePoster && (
          <Button onClick={onGeneratePoster} variant="outline">
            <Icon icon="material-symbols:image" className="w-4 h-4 mr-2" />
            生成海报
          </Button>
        )}
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('balances')}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'balances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            const person = people.find(p => p.id === balance.personId);
            const isCreditor = balance.balance > 0.01;
            const isDebtor = balance.balance < -0.01;

            return (
              <div
                key={balance.personId}
                className="bg-white rounded-lg border border-gray-200 p-4"
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
                      <h3 className="text-lg font-medium text-gray-900">
                        {getPersonName(balance.personId)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isCreditor && '应收款'}
                        {isDebtor && '应付款'}
                        {!isCreditor && !isDebtor && '已结清'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`
                      text-lg font-semibold
                      ${isCreditor ? 'text-green-600' : isDebtor ? 'text-red-600' : 'text-gray-600'}
                    `}>
                      {isCreditor && '+'}
                      {formatCurrency(Math.abs(balance.balance))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">总支付</span>
                      <span className="font-semibold text-blue-800">
                        {formatCurrency(balance.totalPaid)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700 font-medium">应分摊</span>
                      <span className="font-semibold text-orange-800">
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
              <Icon icon="material-symbols:check-circle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">账目已平衡</h3>
              <p className="text-gray-600">所有人的账目都已平衡，无需转账</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Icon icon="material-symbols:info" className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    共需 {settlementResult.optimalTransfers.length} 笔转账完成结算
                  </p>
                </div>
              </div>

              {settlementResult.optimalTransfers.map((transfer, index) => (
                <div
                  key={`${transfer.fromPersonId}-${transfer.toPersonId}-${index}`}
                  className="bg-white rounded-lg border border-gray-200 p-4"
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
                        <span className="font-medium text-gray-900">
                          {getPersonName(transfer.fromPersonId)}
                        </span>
                      </div>

                      {/* 箭头 */}
                      <Icon icon="material-symbols:arrow-forward" className="w-6 h-6 text-gray-400" />

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
                        <span className="font-medium text-gray-900">
                          {getPersonName(transfer.toPersonId)}
                        </span>
                      </div>
                    </div>

                    {/* 金额 */}
                    <div className="text-lg font-semibold text-red-600">
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