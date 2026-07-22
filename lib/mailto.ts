// Hard rule 2: inquiries are direct email. No forms, no stored inquiries.
export function adoptionMailto(rescuerEmail: string, animalName: string, petRef: string): string {
  const subject = `Adoption inquiry: ${animalName} (${petRef})`;
  const body = [
    `Hi — I'd like to ask about ${animalName}.`,
    "",
    "Where I live (country/city):",
    "My home setup (apartment/villa, indoor/outdoor):",
    "Other pets:",
    "Experience with cats/dogs:",
    "",
    "Please ask me anything you'd like to know — happy to share more.",
  ].join("\n");
  return `mailto:${rescuerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Fostering is UAE-local — the rescuer needs the pet reachable.
export function fosterMailto(rescuerEmail: string, animalName: string, petRef: string): string {
  const subject = `Foster inquiry: ${animalName} (${petRef})`;
  const body = [
    `Hi — I'd like to ask about fostering ${animalName}.`,
    "",
    "Where I am in the UAE:",
    "How long I can foster:",
    "My home setup (apartment/villa, other pets):",
    "I can do vet runs (yes/no):",
    "",
    "Please ask me anything you'd like to know — happy to share more.",
  ].join("\n");
  return `mailto:${rescuerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
