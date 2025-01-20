import { create } from "zustand";

export interface Player {
  id: string;
  name: string;
}

export interface PlayerStore {
  players: Map<string, Map<string, Player>>;
  addPlayer: (parentId: string, player: Player) => void;
  removePlayer: (parentId: string, playerId: string) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: new Map([
    ["나", new Map()],
    ["엄마", new Map()],
    ["아빠", new Map()],
  ]),

  addPlayer: (parentId, player) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      const parentPlayers = newPlayers.get(parentId) || new Map();
      parentPlayers.set(player.id, player);
      newPlayers.set(parentId, parentPlayers);
      return { players: newPlayers };
    }),
  removePlayer: (parentId, playerId) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      const parentPlayers = newPlayers.get(parentId);
      if (parentPlayers) {
        parentPlayers.delete(playerId);
        if (parentPlayers.size === 0) {
          newPlayers.delete(parentId);
        } else {
          newPlayers.set(parentId, parentPlayers);
        }
      }
      return { players: newPlayers };
    }),
}));
