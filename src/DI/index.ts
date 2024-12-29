import AuthClientRepository from "@/entities/Auth/client/models/repository/AuthClientRepository";
import { EditorClientRepository } from "@/features/Editor/models/client/repository";

export const CLIENT_DI_REPOSITORY = {
  Auth: AuthClientRepository,
  Editor: EditorClientRepository,
};
