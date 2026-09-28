import { useCallback } from 'react';
import { useApp } from '../state/AppContext';
import type { CreateUserInput } from '../../application/users/CreateUser';
import type { User, UserChanges } from '../../domain/entities/User';
import { useOperations } from '../state/OperationsContext';

export function useUsers() {
  const { users, loading, error, createUser: create, updateUser: update } = useOperations();
  const { state } = useApp();
  const actorId = state.currentUser?.id ?? 'u1';

  const createUser = useCallback((input: CreateUserInput) => create(input, actorId), [create, actorId]);
  const updateUser = useCallback((id: string, changes: UserChanges) => update(id, changes, actorId), [update, actorId]);
  const setUserStatus = useCallback((user: User, status: User['status']) => update(user.id, { status }, actorId), [update, actorId]);

  return { users, loading, error, createUser, updateUser, setUserStatus };
}
