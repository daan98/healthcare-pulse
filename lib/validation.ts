import { z } from "zod";

export const UserFormValidation = z.object({
    name: z.string()
        .min(2, "El nombre de usuario debe tener mínimo 2 carácteres.")
        .max(50, "El nombre de usuario no puede tener más de 50 carácteres."),
    email: z.string().email("Correo eléctronico invalido."),
    phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Número de teléfono invalido.'),
})