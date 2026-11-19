import { useEffect } from 'react';
import { subscribe } from '../api/fakeSocket';
import { connectionChanged, recordReceived } from '../store/witsSlice';
import { useAppDispatch } from '../store/hooks';

/**
 * Subscribes to the live WITS feed for a well and pushes records into the store.
 */
export function useWitsStream(assetId: number | null) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!assetId) return;

    dispatch(connectionChanged(true));

    const unsubscribe = subscribe(assetId, (record) => {
      dispatch(recordReceived(record));
    });

    return () => {
      unsubscribe();
      dispatch(connectionChanged(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
