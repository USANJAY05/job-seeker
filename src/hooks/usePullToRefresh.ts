import { useCallback, useState } from 'react';
import { useAppTheme } from '../theme';

export type RefreshHandler = () => void | Promise<void>;
export function usePullToRefresh(onRefresh?: RefreshHandler) {
  const { colors } = useAppTheme(); const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try { await onRefresh?.(); }
    finally { setRefreshing(false); }
  }, [onRefresh, refreshing]);
  return { refreshing, onRefresh: refresh, tintColor: colors.primary, colors: [colors.primaryStrong] };
}
