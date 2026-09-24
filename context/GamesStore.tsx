import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import {
  MOCK_GAMES,
  buildGameFromCreate,
  countOpenGames as countOpenFrom,
  countUpcomingIncludingFeatured as countUpcomingFrom,
  getFeaturedGame as getFeaturedFrom,
  getGameById as getGameFrom,
  getPlayHeaderDay as getPlayHeaderDayFrom,
  listPastGames as listPastFrom,
  listPlayOpenGames as listPlayOpenFrom,
  listUpcomingGames as listUpcomingFrom,
  type CreateGameInput,
  type MockGame,
} from '@/data/mockGames';

type GamesState = {
  games: MockGame[];
};

type GamesAction =
  | { type: 'JOIN'; id: string }
  | { type: 'LEAVE'; id: string }
  | { type: 'ADD_GAME'; game: MockGame };

type GamesStoreValue = {
  games: MockGame[];
  getById: (id: string) => MockGame | undefined;
  joinGame: (id: string) => void;
  leaveGame: (id: string) => void;
  createGame: (input: CreateGameInput) => MockGame;
  featuredGame: MockGame;
  playOpenGames: MockGame[];
  upcomingGames: MockGame[];
  pastGames: MockGame[];
  playHeaderDay: string;
  openGamesCount: number;
  upcomingIncludingFeaturedCount: number;
};

const GamesStoreContext = createContext<GamesStoreValue | null>(null);

function isJoined(game: MockGame): boolean {
  return game.joined || game.currentUserState === 'in';
}

function reducer(state: GamesState, action: GamesAction): GamesState {
  switch (action.type) {
    case 'JOIN': {
      return {
        games: state.games.map((game) => {
          if (game.id !== action.id) return game;
          if (game.status === 'PLAYED') return game;
          if (isJoined(game)) return game;
          if (game.status === 'FULL') return game;
          // Soft inconsistency: count already at/over max — heal to FULL, do not join.
          if (game.playersCurrent >= game.playersMax) {
            return { ...game, status: 'FULL' as const, playersCurrent: game.playersMax };
          }

          const playersCurrent = Math.min(game.playersMax, game.playersCurrent + 1);
          const status = playersCurrent >= game.playersMax ? 'FULL' : 'OPEN';

          return {
            ...game,
            playersCurrent,
            status,
            joined: true,
            currentUserState: 'in' as const,
          };
        }),
      };
    }
    case 'LEAVE': {
      return {
        games: state.games.map((game) => {
          if (game.id !== action.id) return game;
          if (game.status === 'PLAYED') return game;
          if (!isJoined(game)) return game;

          const clamped = Math.min(game.playersMax, Math.max(0, game.playersCurrent));
          const playersCurrent = Math.max(0, clamped - 1);
          // Leaving never yields PLAYED; OPEN unless still at capacity (should not happen).
          const status = playersCurrent >= game.playersMax ? 'FULL' : 'OPEN';

          return {
            ...game,
            playersCurrent,
            status,
            joined: false,
            currentUserState: 'out' as const,
          };
        }),
      };
    }
    case 'ADD_GAME': {
      return {
        games: [action.game, ...state.games],
      };
    }
    default:
      return state;
  }
}

export function GamesStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { games: MOCK_GAMES });

  const joinGame = useCallback((id: string) => {
    dispatch({ type: 'JOIN', id });
  }, []);

  const leaveGame = useCallback((id: string) => {
    dispatch({ type: 'LEAVE', id });
  }, []);

  const createGame = useCallback((input: CreateGameInput): MockGame => {
    const game = buildGameFromCreate(input);
    dispatch({ type: 'ADD_GAME', game });
    return game;
  }, []);

  const getById = useCallback(
    (id: string) => getGameFrom(state.games, id),
    [state.games],
  );

  const value = useMemo<GamesStoreValue>(() => {
    const { games } = state;
    return {
      games,
      getById,
      joinGame,
      leaveGame,
      createGame,
      featuredGame: getFeaturedFrom(games),
      playOpenGames: listPlayOpenFrom(games),
      upcomingGames: listUpcomingFrom(games),
      pastGames: listPastFrom(games),
      playHeaderDay: getPlayHeaderDayFrom(games),
      openGamesCount: countOpenFrom(games),
      upcomingIncludingFeaturedCount: countUpcomingFrom(games),
    };
  }, [state, getById, joinGame, leaveGame, createGame]);

  return (
    <GamesStoreContext.Provider value={value}>
      {children}
    </GamesStoreContext.Provider>
  );
}

export function useGamesStore(): GamesStoreValue {
  const ctx = useContext(GamesStoreContext);
  if (!ctx) {
    throw new Error('useGamesStore must be used within GamesStoreProvider');
  }
  return ctx;
}
