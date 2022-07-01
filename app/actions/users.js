import {Server} from "@helpers/server";

export const signup = data => Server('post', '/users/signup', data);

export const login = data => Server('post', '/users/login', data);

export const logout = jwt => Server('post', '/users/logout', {jwt});

export const getAllUsers = () => Server('get', '/users/all');

export const getSelf = () => Server('get', `/users/self`);

export const userUpdate = (data) => Server('post', '/users/update', data);

export const getUserPhoto = id => Server('get', `/users/photo/${id}`);