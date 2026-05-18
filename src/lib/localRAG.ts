const protocols = [
    "IMCI guidelines: children with fever and fast breathing should be referred immediately.",
    "For suspected TB, collect sputum sample and refer for GeneXpert test.",
    "High-risk pregnancy signs: bleeding, severe abdominal pain, blurred vision, reduced fetal movement.",
    "ANC protocol: All pregnant women should receive 4 ANC visits minimum.",
    "NCD screening: Check blood pressure at every patient visit over 30 years.",
    "Malaria: Fever with chills in endemic area, perform RDT and treat based on result.",
    "Diarrhea management: ORS and zinc supplementation for children under 5.",
    "Immunization: Follow National Immunization Schedule strictly, check for contraindications.",
];

export async function searchProtocols(query: string, k = 3): Promise<string[]> {
    const queryLower = query.toLowerCase();

    const scored = protocols.map((text) => {
        const words = queryLower.split(/\s+/);
        let score = 0;
        for (const word of words) {
            if (text.toLowerCase().includes(word)) score++;
        }
        return { text, score };
    });

    return scored
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
        .map((item) => item.text);
}
