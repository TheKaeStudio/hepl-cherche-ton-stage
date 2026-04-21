export const currentUser = {
    id: 3,
    name: "Koçak Ali",
    role: "etudiant",
    class: "D301",
    email: "kocakalierdem@gmail.com",
    phone: "+32 466 66 66 66",
    photo: null,
};

export const users = [
    { id: 1, name: "Thiernesse C.", role: "admin",      class: null,   email: "thiernesse.c@hepl.be",    phone: "+32 466 66 66 64", photo: null, stageStatus: null },
    { id: 2, name: "Jacquet D.",    role: "enseignant", class: null,   email: "jacquet.d@hepl.be",        phone: "+32 466 66 66 65", photo: null, stageStatus: null },
    { id: 3, name: "Koçak Ali",     role: "etudiant",   class: "D301", email: "kocakalierdem@gmail.com",  phone: "+32 466 66 66 66", photo: null, stageStatus: "en-cours" },
    { id: 4, name: "Marc Dupont",   role: "etudiant",   class: "D301", email: "marcdupont@gmail.com",     phone: "+32 466 66 66 67", photo: null, stageStatus: "en-cours" },
];

export const companies = [
    {
        id: 1,
        name: "EVS Broadcast Equipment",
        logo: null,
        province: "Liège",
        domain: "Informatique",
        description: "EVS Broadcast Equipment est une entreprise belge spécialisée dans la fabrication de serveurs vidéo destinés à l'enregistrement d'images professionnelles.",
        contact: { name: "Julie Crossroad", email: "julie@evs.com", phone: "+32 466 11 11 11" },
        offresObservation: true,
        offres3e: true,
        website: "www.evs.com",
    },
    {
        id: 2,
        name: "NRB",
        logo: null,
        province: "Liège",
        domain: "Informatique",
        description: "NRB est un prestataire de services IT en Belgique, actif dans les domaines du cloud, de la cybersécurité et de l'outsourcing.",
        contact: { name: "Jean Dupont", email: "jean@nrb.be", phone: "+32 466 22 22 22" },
        offresObservation: false,
        offres3e: true,
        website: "www.nrb.be",
    },
    {
        id: 3,
        name: "Philagri",
        logo: null,
        province: "Liège",
        domain: "Agriculture",
        description: "Philagri est active dans le secteur agricole belge, proposant des solutions numériques pour la gestion des exploitations.",
        contact: { name: "Luc Frontville", email: "luc@philagri.be", phone: "+32 466 33 33 33" },
        offresObservation: true,
        offres3e: false,
        website: "www.philagri.be",
    },
];

export const stages = [
    { id: 1, student: users[2], company: companies[0], supervisor: "Julie Crossroad", startDate: "2027-02-14", endDate: "2027-03-27", status: "en-cours",  title: "Stage BAC3",          group: "D301" },
    { id: 2, student: users[2], company: companies[0], supervisor: "Julie Crossroad", startDate: "2026-10-17", endDate: "2026-10-18", status: "termine",   title: "Stage d'observation", group: "D202" },
    { id: 3, student: users[3], company: companies[1], supervisor: "Jean Dupont",     startDate: "2027-02-14", endDate: "2027-03-27", status: "en-cours",  title: "Stage BAC3",          group: "D301" },
    { id: 4, student: users[2], company: companies[2], supervisor: "Luc Frontville",  startDate: "2026-09-01", endDate: "2026-09-30", status: "non-rempli", title: "Stage BAC2",          group: "D202" },
];

export const messages = [
    { id: 1, from: users[1],  subject: "Rappel : Deadline rapport de stage",  body: "N'oubliez pas de remettre votre rapport de stage avant le 15 mars. Merci de respecter les délais imposés par le département.",          date: "2027-02-10", read: false },
    { id: 2, from: { name: "Julie Crossroad", role: "entreprise", company: companies[0] }, subject: "Confirmation de votre stage", body: "Nous confirmons votre stage chez EVS Broadcast Equipment du 14 février au 27 mars 2027. Votre superviseur sera Julie Crossroad.", date: "2027-01-15", read: false },
    { id: 3, from: users[1],  subject: "Réunion d'information stages",        body: "Une réunion d'information sur les stages aura lieu le 5 février à 10h en salle B201.",                                                     date: "2027-01-08", read: true  },
    { id: 4, from: users[0],  subject: "Bienvenue sur la plateforme",         body: "Bienvenue sur HEPL Cherche Ton Stage ! Cette plateforme vous permettra de rechercher et gérer vos stages facilement.",                     date: "2026-09-01", read: true  },
];

export const notifications = [
    { id: 1, type: "new_company", message: "Nouvelle entreprise ajoutée : Philagri",     date: "2027-02-12", read: false },
    { id: 2, type: "new_message", message: "Nouveau message de Jacquet D.",               date: "2027-02-10", read: false },
    { id: 3, type: "new_company", message: "Nouvelle entreprise ajoutée : NRB",           date: "2027-01-20", read: true  },
    { id: 4, type: "new_message", message: "Nouveau message de Julie Crossroad (EVS)",    date: "2027-01-15", read: true  },
];

export const savedCompanies = [companies[0], companies[1]];

export const stageMessages = [
    { id: 1, stageId: 1, from: { id: 3, name: "Koçak Ali", role: "etudiant", photo: null }, body: "Bonjour, j'aimerais savoir si je peux décaler mon arrivée d'une heure le premier jour.", date: "2027-02-10T10:23:00" },
    { id: 2, stageId: 1, from: { id: 99, name: "Julie Crossroad", role: "entreprise", photo: null }, body: "Bien sûr, ce n'est pas un problème. Nous vous attendons à 9h30.", date: "2027-02-10T11:45:00" },
    { id: 3, stageId: 1, from: { id: 3, name: "Koçak Ali", role: "etudiant", photo: null }, body: "Merci beaucoup !", date: "2027-02-10T12:01:00" },
    { id: 4, stageId: 1, from: { id: 2, name: "Jacquet D.", role: "enseignant", photo: null }, body: "Pensez à noter votre rapport journalier dès le premier jour.", date: "2027-02-11T09:00:00" },
];

export const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
};

export const formatDateRange = (start, end) =>
    `${formatDate(start)} au ${formatDate(end)}`;

export const ROLE_LABEL = {
    etudiant:   "Étudiant",
    enseignant: "Enseignant",
    admin:      "Administrateur",
};
