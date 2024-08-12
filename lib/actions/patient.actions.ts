"use server";

import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(),user.email, user.phone, undefined, user.name);

        console.log("newUser: ", newUser);

        return parseStringify(newUser)
    } catch (error : any) {
        if(error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email]),
            ]);

            return existingUser
        }

        console.log("There was an error while creating the user: ", error);
    }
};

export const getUser = async (userId : string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log("There was an error while getting the user: ", error);
    }
}