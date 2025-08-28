import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Icon } from '@iconify-icon/react';
import type { SettlementResult, Person, Group } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Button } from './Button';
import { Modal } from './Modal';

interface PosterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  settlementResult: SettlementResult | null;
  people: Person[];
  group: Group | null;
}

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({
  isOpen,
  onClose,
  settlementResult,
  people,
  group
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || '未知用户';
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

  const generatePoster = async () => {
    if (!posterRef.current) {
      alert('海报元素未找到，请稍后重试');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('开始生成海报...');

      // 等待一小会确保 DOM 渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
        width: posterRef.current.offsetWidth,
        height: posterRef.current.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });

      console.log('海报生成成功，开始下载...');

      // 创建下载链接
      const link = document.createElement('a');
      const fileName = `分账结果-${group?.name || '未命名组'}-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 0.95);

      // 添加到页面并点击下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('海报下载成功');
      alert('海报下载成功！');

    } catch (error) {
      console.error('生成海报失败：', error);

      let errorMessage = '生成海报失败';

      if (error instanceof Error) {
        if (error.message.includes('SecurityError')) {
          errorMessage = '安全错误：可能存在跨域图片问题';
        } else if (error.message.includes('QuotaExceededError')) {
          errorMessage = '内存不足：海报尺寸过大';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = '网络错误：请检查网络连接';
        } else {
          errorMessage = `生成失败：${error.message}`;
        }
      }

      alert(errorMessage + '。请稍后重试或联系技术支持。');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!settlementResult || !group) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分账结果海报" size="lg">
      <div className="space-y-6">
        {/* 海报预览 */}
        <div
          ref={posterRef}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl mx-auto"
          style={{ width: '600px' }}
        >
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="material-symbols:receipt-long" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">分账结果</h1>
            <h2 className="text-lg text-gray-700">{group.name}</h2>
            <p className="text-sm text-gray-600 mt-2">
              {formatDate(settlementResult.calculatedAt)}
            </p>
          </div>

          {/* 总览 */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">总消费</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(settlementResult.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">参与人数</p>
                <p className="text-xl font-bold text-gray-900">
                  {people.length} 人
                </p>
              </div>
            </div>
          </div>

          {/* 个人明细 */}
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">个人明细</h3>
            {settlementResult.personBalances.map(balance => {
              const isCreditor = balance.balance > 0.01;
              const isDebtor = balance.balance < -0.01;

              return (
                <div
                  key={balance.personId}
                  className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm
                      ${getAvatarColors(balance.personId)}
                    `}>
                      {getPersonAvatar(balance.personId) ? (
                        <img
                          src={getPersonAvatar(balance.personId)}
                          alt={getPersonName(balance.personId)}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span>
                          {getPersonName(balance.personId).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {getPersonName(balance.personId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        支付 {formatCurrency(balance.totalPaid)} · 分摊 {formatCurrency(balance.totalShare)}
                      </p>
                    </div>
                  </div>

                  <div className={`
                    text-right font-semibold
                    ${isCreditor ? 'text-green-600' : isDebtor ? 'text-red-600' : 'text-gray-600'}
                  `}>
                    <p className="text-sm">
                      {isCreditor && '应收'}
                      {isDebtor && '应付'}
                      {!isCreditor && !isDebtor && '已结清'}
                    </p>
                    <p>
                      {isCreditor && '+'}
                      {formatCurrency(Math.abs(balance.balance))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 转账方案 */}
          {settlementResult.optimalTransfers.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">转账方案</h3>
              <div className="space-y-3">
                {settlementResult.optimalTransfers.map((transfer, index) => (
                  <div
                    key={`${transfer.fromPersonId}-${transfer.toPersonId}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">
                        {getPersonName(transfer.fromPersonId)}
                      </span>
                      <Icon icon="material-symbols:arrow-forward" className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {getPersonName(transfer.toPersonId)}
                      </span>
                    </div>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(transfer.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 底部标识 */}
          <div className="text-center mt-8 pt-6 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              由人均分账应用生成 · {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
          <Button onClick={generatePoster} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Icon icon="material-symbols:progress-activity" className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:download" className="w-4 h-4 mr-2" />
                下载海报
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};