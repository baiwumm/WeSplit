import { useState, useEffect, useCallback } from 'react';
import type { Group, Person, Expense, AppState, SettlementResult } from '../types';
import { generateId, storage, calculateSettlement } from '../utils';

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    currentGroup: null,
    groups: [],
    isLoading: true,
    error: null
  });

  // 初始化数据
  useEffect(() => {
    try {

      const groups = storage.getGroups();
      const currentGroupId = storage.getCurrentGroupId();
      const currentGroup = groups.find((g: Group) => g.id === currentGroupId) || null;


      setState({
        currentGroup,
        groups,
        isLoading: false,
        error: null
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '加载数据失败'
      }));
    }
  }, []);

  // 保存数据到本地存储
  const saveToStorage = useCallback((groups: Group[], currentGroupId?: string) => {
    storage.saveGroups(groups);
    if (currentGroupId !== undefined) {
      storage.setCurrentGroupId(currentGroupId);
    }
  }, []);

  // 创建新分账组
  const createGroup = useCallback((name: string, description?: string) => {

    const newGroup: Group = {
      id: generateId(),
      name,
      description,
      members: [],
      expenses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };


    setState(prev => {
      const newGroups = [...prev.groups, newGroup];

      saveToStorage(newGroups, newGroup.id);

      return {
        ...prev,
        groups: newGroups,
        currentGroup: newGroup
      };
    });

    return newGroup;
  }, [saveToStorage]);

  // 切换当前分账组
  const switchGroup = useCallback((groupId: string) => {
    setState(prev => {
      const group = prev.groups.find(g => g.id === groupId) || null;
      if (group) {
        storage.setCurrentGroupId(groupId);
      }
      return {
        ...prev,
        currentGroup: group
      };
    });
  }, []);

  // 添加成员
  const addPerson = useCallback((name: string, avatar?: string) => {
    let newPerson: Person | null = null;

    setState(prev => {
      if (!prev.currentGroup) return prev;

      newPerson = {
        id: generateId(),
        name,
        avatar,
        createdAt: new Date()
      };

      const updatedGroup = {
        ...prev.currentGroup,
        members: [...prev.currentGroup.members, newPerson],
        updatedAt: new Date()
      };

      const updatedGroups = prev.groups.map(g =>
        g.id === updatedGroup.id ? updatedGroup : g
      );

      saveToStorage(updatedGroups);

      return {
        ...prev,
        currentGroup: updatedGroup,
        groups: updatedGroups
      };
    });

    return newPerson;
  }, [saveToStorage]);

  // 删除成员
  const removePerson = useCallback((personId: string) => {
    setState(prev => {
      if (!prev.currentGroup) return prev;

      const updatedGroup = {
        ...prev.currentGroup,
        members: prev.currentGroup.members.filter(p => p.id !== personId),
        expenses: prev.currentGroup.expenses.filter(e =>
          e.payerId !== personId && !e.participants.includes(personId)
        ),
        updatedAt: new Date()
      };

      const updatedGroups = prev.groups.map(g =>
        g.id === updatedGroup.id ? updatedGroup : g
      );

      saveToStorage(updatedGroups);

      return {
        ...prev,
        currentGroup: updatedGroup,
        groups: updatedGroups
      };
    });
  }, [saveToStorage]);

  // 添加消费记录
  const addExpense = useCallback((
    title: string,
    amount: number,
    payerId: string,
    participants: string[],
    description?: string,
    category?: string
  ) => {
    let newExpense: Expense | null = null;

    setState(prev => {
      if (!prev.currentGroup) return prev;

      newExpense = {
        id: generateId(),
        title,
        amount,
        payerId,
        participants,
        description,
        category,
        createdAt: new Date()
      };

      const updatedGroup = {
        ...prev.currentGroup,
        expenses: [...prev.currentGroup.expenses, newExpense],
        updatedAt: new Date()
      };

      const updatedGroups = prev.groups.map(g =>
        g.id === updatedGroup.id ? updatedGroup : g
      );

      saveToStorage(updatedGroups);

      return {
        ...prev,
        currentGroup: updatedGroup,
        groups: updatedGroups
      };
    });

    return newExpense;
  }, [saveToStorage]);

  // 删除消费记录
  const removeExpense = useCallback((expenseId: string) => {
    setState(prev => {
      if (!prev.currentGroup) return prev;

      const updatedGroup = {
        ...prev.currentGroup,
        expenses: prev.currentGroup.expenses.filter(e => e.id !== expenseId),
        updatedAt: new Date()
      };

      const updatedGroups = prev.groups.map(g =>
        g.id === updatedGroup.id ? updatedGroup : g
      );

      saveToStorage(updatedGroups);

      return {
        ...prev,
        currentGroup: updatedGroup,
        groups: updatedGroups
      };
    });
  }, [saveToStorage]);

  // 修复后的同步版本
  const getSettlementResultSync = useCallback((): SettlementResult | null => {
    let result: SettlementResult | null = null;
    setState(prev => {
      if (!prev.currentGroup || prev.currentGroup.expenses.length === 0) {
        result = null;
        return prev;
      }

      const { personBalances, optimalTransfers } = calculateSettlement(
        prev.currentGroup.expenses,
        prev.currentGroup.members
      );

      const totalAmount = prev.currentGroup.expenses.reduce((sum, expense) => sum + expense.amount, 0);

      result = {
        groupId: prev.currentGroup.id,
        personBalances,
        optimalTransfers,
        totalAmount,
        calculatedAt: new Date()
      };

      return prev;
    });
    return result;
  }, []);

  return {
    ...state,
    createGroup,
    switchGroup,
    addPerson,
    removePerson,
    addExpense,
    removeExpense,
    getSettlementResult: getSettlementResultSync
  };
};