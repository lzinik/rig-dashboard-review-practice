/**
 * Simulated WITS socket. Emits one record per second per subscription.
 * NOT PART OF THE PR UNDER REVIEW.
 */
import type { Channel, WitsRecord } from '../types';

type Listener = (record: WitsRecord) => void;

const BASELINES: Record<number, Record<Channel, number>> = {
  101: { hole_depth: 10240, bit_depth: 10238, rop: 140, wob: 32, hook_load: 210, spp: 2900 },
  102: { hole_depth: 11180, bit_depth: 11180, rop: 95, wob: 38, hook_load: 245, spp: 3300 },
  103: { hole_depth: 9020, bit_depth: 6400, rop: 0, wob: 0, hook_load: 180, spp: 400 },
  104: { hole_depth: 3150, bit_depth: 3149, rop: 180, wob: 26, hook_load: 150, spp: 2500 },
  105: { hole_depth: 7600, bit_depth: 7600, rop: 0, wob: 0, hook_load: 120, spp: 0 },
};

const jitter = (value: number, amount: number) => value + (Math.random() - 0.5) * amount;

export function subscribe(assetId: number, listener: Listener): () => void {
  const state = { ...(BASELINES[assetId] ?? BASELINES[101]) };

  const id = window.setInterval(() => {
    const isConnection = Math.random() < 0.1;

    state.rop = isConnection ? 0 : Math.max(0, jitter(state.rop || 120, 30));
    state.wob = isConnection ? 0 : Math.max(0, jitter(state.wob || 30, 4));
    state.spp = isConnection ? 300 : Math.max(0, jitter(state.spp || 2900, 120));
    state.hook_load = Math.max(0, jitter(state.hook_load, 10));
    state.bit_depth += state.rop / 3600;
    state.hole_depth = Math.max(state.hole_depth, state.bit_depth);

    listener({
      asset_id: assetId,
      timestamp: Math.floor(Date.now() / 1000),
      data: { ...state },
    });
  }, 1000);

  return () => window.clearInterval(id);
}
