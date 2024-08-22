import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 carácteres ")
    .max(50, "El nombre no puede tener más de 50 carácteres ."),
  email: z.string().email("Dirección de correo invalido."),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Número telefónico invalido."),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 carácteres ")
    .max(50, "El nombre no puede tener más de 50 carácteres ."),
  email: z.string().email("Dirección de correo invalido."),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Número telefónico invalido."),
  birthDate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z
    .string()
    .min(5, "La dirección debe contener mínimo 5 caracteres")
    .max(500, "La dirección debe contener máximo 500 caracteres"),
  occupation: z
    .string()
    .min(2, "Ocupación debe contener mínimo 2 caracteres")
    .max(500, "Ocupación debe contener máximo 500 caracteres"),
  emergencyContactName: z
    .string()
    .min(2, "Nombre de contacto debe contener mínimo 2 caracteres")
    .max(50, "Nombre de contacto debe contener máximo 50 caracteres"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Número telefónico invalido"
    ),
  primaryPhysician: z.string().min(2, "Seleccione un doctor."),
  insuranceProvider: z
    .string()
    .min(2, "Proveedor de seguro debe contener mínimo 2 caracteres")
    .max(50, "Proveedor de seguro debe contener máximo 50 caracteres"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Número de poliza de seguro debe contener mínimo 2 caracteres")
    .max(50, "Número de poliza de seguro debe contener máximo 50 caracteres"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Debes aceptar el tratamiento para seguir.",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Debes aceptar la política de divulgación de información para seguir",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Debes aceptar la política de privacidad para seguir",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Seleccione un doctor."),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "La razón debe contener mínimo 2 caracteres")
    .max(500, "La razón debe contener máximo 500 caracteres"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Seleccione un doctor."),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Seleccione un doctor."),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "La razón debe contener mínimo 2 caracteres")
    .max(500, "La razón debe contener máximo 500 caracteres"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}