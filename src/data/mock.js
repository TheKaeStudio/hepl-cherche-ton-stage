export const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const formatDateRange = (start, end) =>
    `${formatDate(start)} au ${formatDate(end)}`;

export const ROLE_LABEL = {
    etudiant: "Étudiant",
    enseignant: "Enseignant",
    manager: "Manager",
    admin: "Administrateur",
};
