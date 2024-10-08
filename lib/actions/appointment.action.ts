"use server"

import { ID, Models, Query } from "node-appwrite";
import { APPOINTMENT_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.type";
import { revalidatePath } from "next/cache";

export interface AppointmentInitialCountInterface {
    scheduledCount: number;
    pendingCount: number;
    cancelledCount: number;
}

export interface AppointmentsInterface {
    counts : AppointmentInitialCountInterface;
    totalCounts : number;
    documents : Models.Document[];
}

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

export const getAppointmentsList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_ID!
        );

        const initialCounts : AppointmentInitialCountInterface = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts : AppointmentInitialCountInterface = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === "scheduled") {
                acc.scheduledCount += 1;
            }else if (appointment.status === "pending") {
                acc.pendingCount += 1;
            } else if (appointment.status === "cancelled") {
                acc.cancelledCount += 1;
            }

            return acc;
        }, initialCounts);

        const data : AppointmentsInterface = {
            totalCounts: appointments.total,
            counts,
            documents: appointments.documents,
        }

        return parseStringify(data);
    } catch (error) {
        console.log("There was an error while getting all appointments: ", error);
    }
}

export const updateAppointment = async ({userId, appointmentId, appointment, type} : UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_ID!,
            appointmentId,
            appointment
        );

        if(!updatedAppointment) {
            throw new Error("Appointment not found");
        }

        //TODO SMS Notification
        const smsMessage = `Hola, te saluda clinica CarePulse.${type === 'schedule' ? ` Tu cita ha sido agendada para el ${formatDateTime(appointment.schedule!).dateTime}\n\nDr. ${appointment.primaryPhysician}` : `Lamentamos infromarle que su cita ha sido cancelada. Motivo: ${appointment.cancellationReason}.\n\nLe avisaremos cuando su cita sea reagendada`}`;

        await sendSMSNotification(userId, smsMessage);

        revalidatePath("/admin");
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.log("There was an error while updating appointment: ", error);
    }
}

export const sendSMSNotification = async (userId : string, content : string) => {
    try {
        const message = await messaging.createSms(ID.unique(), content, [], [userId]);

        return parseStringify(message);
    } catch (error) {
        console.log("There was an error while sending SMS notification: ", error);
    }
};