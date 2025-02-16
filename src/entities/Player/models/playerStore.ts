import { create } from "zustand";

export interface Player {
  id: string;
  name: string;
}

export interface PlayerStore {
  players: Map<string, string>;
  initPlayers: (players: Map<string, string>) => void;
  addPlayer: (parentId: string, player: Player) => void;
  removePlayer: (parentId: string, playerId: string) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: new Map([
    ["나", "나"],
    ["엄마", "엄마"],
    ["아빠", "아빠"],
  ]),

  initPlayers: (players) => {
    set((state) => {
      return { players };
    });
  },

  addPlayer: (parentId, player) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.set(parentId, player.name);
      return { players: newPlayers };
    }),
  removePlayer: (parentId) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.delete(parentId);

      return { players: newPlayers };
    }),
}));
