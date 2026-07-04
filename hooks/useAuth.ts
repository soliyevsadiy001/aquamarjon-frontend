import React, { useCallback, useEffect, useReducer } from "react";
import type { Account, Role } from "../types";
import { INIT_ACCOUNTS } from "../data/accounts";
import {
  ALLOW_OFFLINE_AUTH_FALLBACK,
  adminCreateAccount,
  adminDeleteAccount,
  adminListAccounts,
  adminResetPassword,
  adminToggleAccount,
  adminUpdateAccount,
  changePasswordRemote,
  clearToken,
  logClientError,
} from "../lib/api";
import { genTempPass } from "../lib/auth-utils";

// ── Персист аккаунтов в localStorage ──────────────────────────
// Это временный костыль для демо/офлайн-режима (см. предупреждение про
// ALLOW_OFFLINE_AUTH_FALLBACK в lib/api.ts) — пароли и так уже лежат в
// клиентском бандле открытым текстом, так что localStorage не добавляет
// новой поверхности риска. Как только аккаунты переедут на бэкенд
// (/admin/accounts), этот блок и вызовы loadAccounts/saveAccounts надо
// будет убрать целиком.
const ACCOUNTS_STORAGE_KEY = "aquamarjon_accounts_v1";

function loadAccounts(): Account[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return INIT_ACCOUNTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INIT_ACCOUNTS;
    return parsed;
  } catch {
    // localStorage недоступен (приватный режим/SSR) или JSON битый —
    // откатываемся к дефолтным аккаунтам, не роняем приложение.
    return INIT_ACCOUNTS;
  }
}

function saveAccounts(accounts: Account[]) {
  try {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // квота/приватный режим — молча игнорируем, это некритичный кэш
  }
}

export type AuthState = {
  accounts: Account[];
  loggedInAcc: Account | null;
  needChangePwd: boolean;
  noAccessRole: Role | null;
};


export type AuthAction =
  | { type: "login"; account: Account; needChangePwd: boolean }
  | { type: "logout" }
  | { type: "passwordChanged"; newPassword: string }
  | { type: "noAccess"; role: Role }
  | { type: "dismissNoAccess" }
  | { type: "addAccount"; account: Account }
  | { type: "updateAccount"; id: string; field: string; value: any }
  | { type: "toggleAccount"; id: string }
  | { type: "deleteAccount"; id: string }
  | { type: "resetPassword"; id: string; tempPass: string }
  | { type: "accountsSynced"; accounts: Account[] }
  | { type: "accountUpserted"; account: Account };


export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return { ...state, loggedInAcc: action.account, needChangePwd: action.needChangePwd, noAccessRole: null };
    case "logout":
      return { ...state, loggedInAcc: null, needChangePwd: false };
    case "passwordChanged":
      if (!state.loggedInAcc) return state;
      return {
        ...state,
        needChangePwd: false,
        accounts: state.accounts.map((a) =>
          a.id === state.loggedInAcc!.id ? { ...a, password: action.newPassword, tempPass: null } : a
        ),
      };
    case "noAccess":
      return { ...state, noAccessRole: action.role };
    case "dismissNoAccess":
      return { ...state, noAccessRole: null };
    case "addAccount":
      return { ...state, accounts: [...state.accounts, action.account] };
    case "updateAccount":
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.id ? { ...a, [action.field]: action.value } : a
        ),
      };
    case "toggleAccount":
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.id ? { ...a, active: !a.active } : a
        ),
        // если заблокировали текущего залогиненного пользователя — выкидываем его
        loggedInAcc:
          state.loggedInAcc && state.loggedInAcc.id === action.id
            ? null
            : state.loggedInAcc,
      };
    case "deleteAccount":
      return {
        ...state,
        accounts: state.accounts.filter((a) => a.id !== action.id),
        loggedInAcc:
          state.loggedInAcc && state.loggedInAcc.id === action.id
            ? null
            : state.loggedInAcc,
      };
    case "resetPassword":
      return {
        ...state,
        accounts: state.accounts.map((a) =>
          a.id === action.id ? { ...a, tempPass: action.tempPass } : a
        ),
      };
    case "accountsSynced":
      // Полная замена списка данными с бэкенда (GET /admin/accounts) — источник
      // правды теперь сервер, локальный/localStorage-список был только кэшем.
      return { ...state, accounts: action.accounts };
    case "accountUpserted": {
      // Ответ бэкенда на create/update/toggle — либо обновляем существующий
      // аккаунт по id, либо (новый, ещё не встречавшийся id) добавляем его.
      const exists = state.accounts.some((a) => a.id === action.account.id);
      return {
        ...state,
        accounts: exists
          ? state.accounts.map((a) => (a.id === action.account.id ? action.account : a))
          : [...state.accounts, action.account],
      };
    }
    default:
      return state;
  }
}


export function useAuth() {
  const [state, dispatch] = useReducer(
    authReducer,
    undefined,
    () =>
      ({
        accounts: loadAccounts(),
        loggedInAcc: null,
        needChangePwd: false,
        noAccessRole: null,
      } as AuthState)
  );

  // Пишем в localStorage при каждом изменении accounts — так и создание/
  // блокировка/сброс пароля в админке, и смена пароля пользователем в
  // ChangePasswordScreen переживают F5.
  useEffect(() => {
    saveAccounts(state.accounts);
  }, [state.accounts]);

  const login = useCallback((account: Account, needChangePwd: boolean) => {
    dispatch({ type: "login", account, needChangePwd: !!needChangePwd });
  }, []);
  // clearToken() — побочный эффект (мутация модуля auth-хранилища),
  // поэтому он здесь, в обёртке, а не внутри чистого authReducer.
  const logout = useCallback(() => { clearToken(); dispatch({ type: "logout" }); }, []);
  const changePassword = useCallback(async (newPassword: string) => {
    try {
      await changePasswordRemote(newPassword);
    } catch (err) {
      // Не блокируем пользователя экраном ошибки из-за недоступного бэкенда —
      // просто логируем (Sentry увидит) и всё равно применяем локально, как раньше.
      logClientError("changePassword: backend unavailable", err);
    }
    dispatch({ type: "passwordChanged", newPassword });
  }, []);
  const requestNoAccess = useCallback((role: Role) => dispatch({ type: "noAccess", role }), []);
  const dismissNoAccess = useCallback(() => dispatch({ type: "dismissNoAccess" }), []);

  // ── Аккаунты: бэкенд как источник правды, локальный reducer/localStorage
  // как фолбэк для офлайн-демо (см. ALLOW_OFFLINE_AUTH_FALLBACK в lib/api.ts —
  // тот же флаг решает оба вопроса разом: и логин, и CRUD аккаунтов).
  // Все функции ниже возвращают Promise: сперва пробуют /admin/accounts,
  // и только если бэкенд недоступен/ещё не поднят — тихо (при включённом
  // флаге) применяют то же изменение локально, как раньше.

  // Подтягивает актуальный список с бэкенда — дергать при открытии
  // AdminPanel. Если бэкенд недоступен, молча остаёмся на том, что уже
  // есть в state (INIT_ACCOUNTS/localStorage) — это не считается ошибкой
  // ввода, поэтому не проверяется через ALLOW_OFFLINE_AUTH_FALLBACK.
  const refreshAccounts = useCallback(async () => {
    try {
      const accounts = await adminListAccounts();
      dispatch({ type: "accountsSynced", accounts });
    } catch {
      // бэкенда нет / ручка не поднята / нет admin-токена — остаёмся на кэше
    }
  }, []);

  const addAccount = useCallback(
    async (payload: Pick<Account, "role" | "name" | "phone" | "region" | "login" | "password">) => {
      try {
        const account = await adminCreateAccount(payload);
        dispatch({ type: "accountUpserted", account });
        return account;
      } catch (err) {
        if (!ALLOW_OFFLINE_AUTH_FALLBACK) throw err;
        const account: Account = {
          ...payload,
          id: `${payload.role[0]}_${Date.now()}`,
          active: true,
          lastLogin: "—",
          tempPass: null,
        };
        dispatch({ type: "addAccount", account });
        return account;
      }
    },
    []
  );

  const updateAccount = useCallback(async (id: string, field: string, value: any) => {
    try {
      const account = await adminUpdateAccount(id, field, value);
      dispatch({ type: "accountUpserted", account });
    } catch (err) {
      if (!ALLOW_OFFLINE_AUTH_FALLBACK) throw err;
      dispatch({ type: "updateAccount", id, field, value });
    }
  }, []);

  const toggleAccount = useCallback(async (id: string) => {
    try {
      const account = await adminToggleAccount(id);
      dispatch({ type: "accountUpserted", account });
    } catch (err) {
      if (!ALLOW_OFFLINE_AUTH_FALLBACK) throw err;
      dispatch({ type: "toggleAccount", id });
    }
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await adminDeleteAccount(id);
      dispatch({ type: "deleteAccount", id });
    } catch (err) {
      if (!ALLOW_OFFLINE_AUTH_FALLBACK) throw err;
      // Бэкенд недоступен — удаляем только локально, это уже фолбэк-путь.
      dispatch({ type: "deleteAccount", id });
    }
  }, []);

  // Возвращает сгенерированный временный пароль — вызывающий код (AdminPanel)
  // использует его для тоста/показа админу.
  const resetPassword = useCallback(async (id: string) => {
    try {
      const tempPass = await adminResetPassword(id);
      dispatch({ type: "resetPassword", id, tempPass });
      return tempPass;
    } catch (err) {
      if (!ALLOW_OFFLINE_AUTH_FALLBACK) throw err;
      const tempPass = genTempPass();
      dispatch({ type: "resetPassword", id, tempPass });
      return tempPass;
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    changePassword,
    requestNoAccess,
    dismissNoAccess,
    refreshAccounts,
    addAccount,
    updateAccount,
    toggleAccount,
    deleteAccount,
    resetPassword,
  };
}

