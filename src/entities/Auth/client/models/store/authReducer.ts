import { createReducer } from "@reduxjs/toolkit";

import { AUTH_LOGIN_ACTION, AUTH_LOGOUT_ACTION } from "./action";
 
import { UserEntity } from "@/entities/Auth/core";

// Define a type for the slice state
interface AuthState {
  isLogin: boolean;
  user: UserEntity;
}

const initUserState = {
  id: "",
  email: "",
  name: "",
};

// Define the initial state using that type
const initialState: AuthState = {
  isLogin: false,
  user: {
    id: "",
    email: "",
    name: "",
  },
};

export const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(AUTH_LOGIN_ACTION, (state, { payload: { user } }: { payload: { user: UserEntity } }) => {
    state.isLogin = true;
    state.user = user;
  });

  builder.addCase(AUTH_LOGOUT_ACTION, (state) => {
    state.isLogin = false;
    state.user = initUserState;
  });
});
