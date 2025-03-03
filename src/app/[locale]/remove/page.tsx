"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { CLIENT_DI_REPOSITORY } from "@/DI";
import { useAuthStore } from "@/entities/Auth/client/models/store/AuthStore";
import { LogoutUseCase } from "@/entities/Auth/core";
import { PAGE_ROUTE } from "@/entities/Router/configs/route";
import { supabaseInstance } from "@/shared/index.server";

const RemoveAccountPage: React.FC = () => {
  const { session, clearSession } = useAuthStore();
  const router = useRouter();

  const handleRemoveAccount = async () => {
    const { error } = await supabaseInstance.schema("next_auth").from("users").delete().eq("id", session?.user.id);

    if (error) {
      console.error("계정 삭제 중 오류가 발생했습니다:", error);
      return;
    }
    alert("delete success");
    clearSession();
    new LogoutUseCase(new CLIENT_DI_REPOSITORY.Auth()).execute();
    router.push(PAGE_ROUTE.MAIN);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Delete Account</h1>
        <p className="text-lg mb-6 text-center">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <button
          onClick={handleRemoveAccount}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default RemoveAccountPage;
