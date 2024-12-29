"use server";

import { SERVER_DI_REPOSITORY } from "@/DI/index.server";
import { LOGIN_METHOD } from "./variable";
import { AuthError } from "next-auth";
import { Oauth2LoginUsecase } from "@/entities/Auth/core";
import { EDGE_DI_REPOSITORY } from "@/DI/edge.server";

// eslint-disable-next-line consistent-return
export async function authenticateAction(formData: FormData) {
  const signupMethod = formData.get(LOGIN_METHOD);
  const href = formData.get("href") as string;
  try {
    await new Oauth2LoginUsecase(new EDGE_DI_REPOSITORY.Auth(signupMethod as string)).execute({ href });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
