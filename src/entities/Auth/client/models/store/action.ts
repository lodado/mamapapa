import { UserEntity } from "@/entities/Auth/core";
import { createAction } from "@reduxjs/toolkit";

export const AUTH_LOGIN_ACTION = createAction<{ user: UserEntity }>("AUTH_LOGIN_ACTION");

export const AUTH_LOGOUT_ACTION = createAction("AUTH_LOGOUT_ACTION");
