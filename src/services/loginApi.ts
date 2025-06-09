import {api} from "./api"

export const login = (name: string, email: string) =>
  api.post('/auth/login', { name, email });

export const logout = () =>
  api.post('/auth/logout');

