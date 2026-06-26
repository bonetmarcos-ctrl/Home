import { createInitialState, parseAppState, type AppState, type CollectionName } from "@habitacion/domain";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, apiClient } from "../services/apiClient.js";

const storageKeyPrefix = "habitacion-poblenou-state";

export type SyncStatus = "loading" | "synced" | "saving" | "local" | "error";

function getStorageKey(ownerId: string | undefined): string {
  return ownerId ? `${storageKeyPrefix}:${ownerId}` : storageKeyPrefix;
}

function loadLocalState(ownerId: string | undefined): AppState {
  try {
    const cached = localStorage.getItem(getStorageKey(ownerId));
    return cached ? parseAppState(JSON.parse(cached)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export function useAppState(ownerId: string | undefined) {
  const enabled = Boolean(ownerId);
  const storageKey = getStorageKey(ownerId);
  const [state, setState] = useState<AppState>(() => loadLocalState(ownerId));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(enabled ? "loading" : "local");
  const [error, setError] = useState("");
  const hydratedRef = useRef(false);
  const localOnlyRef = useRef(false);
  const suppressNextSaveRef = useRef(false);

  useEffect(() => {
    if (!enabled || !ownerId) {
      hydratedRef.current = false;
      localOnlyRef.current = false;
      setSyncStatus("local");
      return;
    }

    let alive = true;
    hydratedRef.current = false;
    localOnlyRef.current = false;
    suppressNextSaveRef.current = true;
    setState(loadLocalState(ownerId));
    setError("");
    setSyncStatus("loading");
    void apiClient
      .getState()
      .then((remoteState) => {
        if (!alive) {
          return;
        }
        const parsed = parseAppState(remoteState);
        suppressNextSaveRef.current = true;
        setState(parsed);
        localStorage.setItem(storageKey, JSON.stringify(parsed));
        localOnlyRef.current = false;
        setSyncStatus("synced");
        setError("");
      })
      .catch((caught) => {
        if (!alive) {
          return;
        }
        localOnlyRef.current = true;
        setError(caught instanceof ApiError ? caught.message : "Modo local activo");
        setSyncStatus("local");
      })
      .finally(() => {
        if (alive) {
          hydratedRef.current = true;
        }
      });

    return () => {
      alive = false;
    };
  }, [enabled, ownerId, storageKey]);

  useEffect(() => {
    if (!enabled || !hydratedRef.current) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(state));

    if (localOnlyRef.current) {
      return;
    }

    if (suppressNextSaveRef.current) {
      suppressNextSaveRef.current = false;
      return;
    }

    setSyncStatus("saving");
    const timeout = window.setTimeout(() => {
      void apiClient
        .saveState(state)
        .then(() => {
          setSyncStatus("synced");
          setError("");
        })
        .catch((caught) => {
          localOnlyRef.current = true;
          setError(caught instanceof ApiError ? caught.message : "No se pudo sincronizar");
          setSyncStatus("local");
        });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [enabled, state, storageKey]);

  const replaceCollection = useCallback(
    <TCollection extends CollectionName>(collection: TCollection, items: AppState[TCollection]) => {
      setState((current) => parseAppState({ ...current, [collection]: items }));
    },
    []
  );

  const upsertItem = useCallback(<TCollection extends CollectionName>(collection: TCollection, item: { id: string }) => {
    setState((current) => {
      const items = current[collection] as Array<{ id: string }>;
      const nextItems = items.some((existing) => existing.id === item.id)
        ? items.map((existing) => (existing.id === item.id ? item : existing))
        : [item, ...items];
      return parseAppState({ ...current, [collection]: nextItems });
    });
  }, []);

  const deleteItem = useCallback(<TCollection extends CollectionName>(collection: TCollection, id: string) => {
    setState((current) => {
      const items = current[collection] as Array<{ id: string }>;
      return parseAppState({ ...current, [collection]: items.filter((item) => item.id !== id) });
    });
  }, []);

  const reset = useCallback(async () => {
    try {
      const remote = await apiClient.resetState();
      const parsed = parseAppState(remote);
      suppressNextSaveRef.current = true;
      localOnlyRef.current = false;
      localStorage.setItem(storageKey, JSON.stringify(parsed));
      setState(parsed);
      setSyncStatus("synced");
      setError("");
    } catch {
      const initialState = createInitialState();
      localOnlyRef.current = true;
      localStorage.setItem(storageKey, JSON.stringify(initialState));
      setState(initialState);
      setSyncStatus("local");
    }
  }, [storageKey]);

  return useMemo(
    () => ({ state, setState, replaceCollection, upsertItem, deleteItem, reset, syncStatus, error }),
    [deleteItem, error, replaceCollection, reset, state, syncStatus, upsertItem]
  );
}