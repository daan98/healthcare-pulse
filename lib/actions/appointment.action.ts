"use server"

import { ID } from "node-appwrite";
import { APPOINTMENT_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (appointment : CreateAppointmentParams) => {
    try {
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_ID!,
            ID.unique(),
            appointment,
        );

        return parseStringify(newPatient);
    } catch (error : any) {
        console.log("There was an error while creating the appointment: ", error);
    }
};

export const getAppointment = async (appointmentId : string) => {
    try {
        const appointment = await databases.getDocument(DATABASE_ID!, APPOINTMENT_ID!, appointmentId);

        return parseStringify(appointment);
    } catch (error) {
        console.log("There was an error while getting the appointment: ", error);
    }
};