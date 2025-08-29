import React, { useRef, useState } from 'react';
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
    setIsGenerating(true);

    try {

      // 使用Canvas API直接绘制海报，完全避开CSS兼容性问题
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // 设置高清尺寸
      const width = 1200;
      const height = 1600;
      canvas.width = width;
      canvas.height = height;

      // 绘制渐变背景
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#dbeafe'); // blue-50
      gradient.addColorStop(1, '#e0e7ff'); // indigo-100
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      let y = 80;

      // 绘制顶部图标
      ctx.fillStyle = '#2563eb'; // blue-600
      ctx.beginPath();
      ctx.arc(width / 2, y + 40, 32, 0, 2 * Math.PI);
      ctx.fill();

      y += 120;

      // 标题
      ctx.fillStyle = '#111827'; // gray-900
      ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('分账结果', width / 2, y);

      y += 60;

      // 组名
      ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#374151'; // gray-700
      ctx.fillText(group?.name || '未命名组', width / 2, y);

      y += 50;

      // 日期
      ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#4b5563'; // gray-600
      ctx.fillText(formatDate(settlementResult!.calculatedAt), width / 2, y);

      y += 80;

      // 总览卡片
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(80, y, width - 160, 120);

      // 添加卡片阴影
      ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillRect(80, y, width - 160, 120);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 总消费
      ctx.fillStyle = '#4b5563'; // gray-600
      ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('总消费', width / 4, y + 40);

      ctx.fillStyle = '#111827'; // gray-900
      ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(formatCurrency(settlementResult!.totalAmount), width / 4, y + 80);

      // 参与人数
      ctx.fillStyle = '#4b5563'; // gray-600
      ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('参与人数', (width * 3) / 4, y + 40);

      ctx.fillStyle = '#111827'; // gray-900
      ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${people.length} 人`, (width * 3) / 4, y + 80);

      y += 180;

      // 个人明细标题
      ctx.fillStyle = '#111827'; // gray-900
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('个人明细', 80, y);
      y += 60;

      // 个人明细卡片
      settlementResult!.personBalances.forEach((balance, index) => {
        const isCreditor = balance.balance > 0.01;
        const isDebtor = balance.balance < -0.01;
        const cardY = y + (index * 120);

        // 绘制卡片背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(80, cardY, width - 160, 100);

        // 添加卡片圆角效果（通过多个矩形模拟）
        ctx.fillRect(80, cardY, width - 160, 100);

        // 人名
        ctx.fillStyle = '#111827'; // gray-900
        ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(getPersonName(balance.personId), 120, cardY + 40);

        // 支付和分摊信息
        ctx.fillStyle = '#6b7280'; // gray-500
        ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`支付 ${formatCurrency(balance.totalPaid)} · 分摊 ${formatCurrency(balance.totalShare)}`, 120, cardY + 70);

        // 状态和金额
        let statusText = '';
        let statusColor = '';
        let amountText = '';

        if (isCreditor) {
          statusText = '应收';
          statusColor = '#16a34a'; // green-600
          amountText = `+${formatCurrency(balance.balance)}`;
        } else if (isDebtor) {
          statusText = '应付';
          statusColor = '#dc2626'; // red-600
          amountText = formatCurrency(Math.abs(balance.balance));
        } else {
          statusText = '已结清';
          statusColor = '#4b5563'; // gray-600
          amountText = formatCurrency(0);
        }

        // 状态文字
        ctx.fillStyle = statusColor;
        ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(statusText, width - 120, cardY + 35);

        // 金额
        ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(amountText, width - 120, cardY + 70);
      });

      y += settlementResult!.personBalances.length * 120 + 60;

      // 转账方案（如果有）
      if (settlementResult!.optimalTransfers.length > 0) {
        // 转账方案标题
        ctx.fillStyle = '#111827'; // gray-900
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('转账方案', 80, y);
        y += 60;

        // 转账方案卡片背景
        const transferCardHeight = settlementResult!.optimalTransfers.length * 60 + 40;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(80, y, width - 160, transferCardHeight);

        y += 40;

        settlementResult!.optimalTransfers.forEach((transfer, index) => {
          const transferY = y + (index * 60);

          // 转账项背景
          ctx.fillStyle = '#f9fafb'; // gray-50
          ctx.fillRect(120, transferY - 20, width - 240, 50);

          // 转账信息
          ctx.fillStyle = '#374151'; // gray-700
          ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${getPersonName(transfer.fromPersonId)} → ${getPersonName(transfer.toPersonId)}`, 140, transferY + 8);

          // 转账金额
          ctx.fillStyle = '#dc2626'; // red-600
          ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(formatCurrency(transfer.amount), width - 140, transferY + 8);
        });

        y += transferCardHeight + 40;
      }

      // 底部标识
      y = height - 80;
      ctx.strokeStyle = '#d1d5db'; // gray-300
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, y - 40);
      ctx.lineTo(width - 80, y - 40);
      ctx.stroke();

      ctx.fillStyle = '#6b7280'; // gray-500
      ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`由人均分账应用生成 · ${formatDate(new Date())}`, width / 2, y);

      // 下载图片
      const link = document.createElement('a');
      const fileName = `分账结果-${group?.name || '未命名组'}-${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 0.95);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('海报下载成功！');

    } catch (error) {
      console.error('生成海报失败：', error);
      alert(`生成失败：${error instanceof Error ? error.message : '未知错误'}。请稍后重试或联系技术支持。`);
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
              <Icon icon="material-symbols:receipt-long" className="text-2xl text-white" />
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
                      <Icon icon="material-symbols:arrow-forward" className="text-sm text-gray-400" />
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
                <Icon icon="material-symbols:progress-activity" className="text-sm mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:download" className="text-sm mr-2" />
                下载海报
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};