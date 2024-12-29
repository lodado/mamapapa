"use client";
import { createContext, useRef } from "react";
import { Provider } from "react-redux";

import { store } from "@/app";
import { NextAuthSessionResponse } from "@/entities/Auth/server/type";
import { AUTH_LOGIN_ACTION, AUTH_LOGOUT_ACTION } from "@/entities";
import { Domain, SET_USER_DOMAIN } from "@/features/blog/domain/models";

export const GlobalReduxContext = createContext<any>(undefined);

/**
 * ReduxInitStoreProvider component initializes the Redux store and provides it to the React component tree.
 *
 * @param {Object} props - The properties object.
 * @param {typeof store} props.initStore - The initial Redux store.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the Redux Provider.
 * @param {NextAuthSessionResponse | undefined} props.session - The session object from NextAuth, used to hydrate the initial state.
 *
 * @returns {JSX.Element} The Redux Provider component wrapping the children components.
 *
 * @remarks
 * This component uses a `useRef` hook to store the Redux store instance. If the store is not already initialized,
 * it sets the store to the provided `initStore` and dispatches an `AUTH_LOGIN_ACTION` if a session is provided.
 */
export default function ReduxInitStoreProvider({
  initStore,
  children,
  session,
  userDomain,
}: {
  initStore: typeof store;
  children: React.ReactNode;
  session: NextAuthSessionResponse | undefined;
  userDomain: Domain;
}) {
  const storeRef = useRef<typeof store | null>(null);
  if (!storeRef.current) {
    storeRef.current = initStore;

    /**
     * redux에서 권장하는 initState hydrate 방식;;
     */
    if (session) {
      storeRef.current.dispatch(AUTH_LOGIN_ACTION({ user: session.user }));
    } else {
      storeRef.current.dispatch(AUTH_LOGOUT_ACTION());
    }

    if (userDomain) {
      storeRef.current.dispatch(SET_USER_DOMAIN(userDomain));
    }
  }


  return (
    <Provider store={storeRef.current} context={GlobalReduxContext}>
      {children}
    </Provider>
  );
}
