export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Acta de Nacimiento",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Acta de Nacimiento",
  "Licencia de Conducir",
  "Poliza/Tarjeta de Seguro Médico",
  "Cartilla Militar",
  "Tarjeta de Identificación Única",
  "Pasaporte",
  "Forma Migratoria",
  "Número de Seguridad Social",
  "Matricula Consular",
  "Identificación Estudiantil",
  "Credencial para votar",
];

export const Doctors : Doctor[] = [
  {
    image: "/assets/images/dr-green.png",
    name: "Juan Valdéz",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Baptista",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Eugenio Pérez",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Karla Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramírez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};