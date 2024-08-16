"use server";

import { ID, Query } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PROJECT_ID, storage, users, PATIENT_ID } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file"

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

export const registerPatient = async ({identificationDocument, ...patient} : RegisterUserParams) => {
    try {
        let file;

        if(identificationDocument) {
            const inputFile = identificationDocument && InputFile.fromBuffer(
                identificationDocument?.get("blobFile") as Blob,
                identificationDocument?.get("fileName") as string
            );

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            },
        );

        return parseStringify(newPatient);
    } catch (error : any) {
        console.log("There was an error while registering the patinent: ", error);
    }
};

export const getPatient = async (userId : string) => {
    try {
        const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_ID!, [Query.equal("userId", userId)]);

        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log("There was an error while getting the patient: ", error);
    }
};