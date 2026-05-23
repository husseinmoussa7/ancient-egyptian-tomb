// Artifact data for the Egyptian Tomb Explorer
// Each artifact maps to a 3D model type and contains historical information

export type ModelType =
  | 'canopicJar'
  | 'sarcophagus'
  | 'statue'
  | 'chest'
  | 'amulet'
  | 'shabti'
  | 'scroll'
  | 'scarab'

export type ArtifactCategory =
  | 'funerary'
  | 'religious'
  | 'treasure'
  | 'statue'
  | 'amulet'

export interface ArtifactData {
  id: string
  name: string
  category: ArtifactCategory
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  chamber: 1 | 2 | 3
  shortDescription: string
  historicalContext: string
  funFact: string
  period: string
  material: string
  color: string       // base color in original mode
  discoveredColor: string  // weathered/faded color for discovered mode
  glowColor: string   // hover/selection glow
  modelType: ModelType
  // Where to insert a real GLTF model from Sketchfab:
  // gltfUrl?: string  (e.g. '/models/sarcophagus.glb')
}

export const ARTIFACTS: ArtifactData[] = [
  // ─── CHAMBER 3: MAIN BURIAL CHAMBER ────────────────────────────────────────

  {
    id: 'sarcophagus',
    name: 'Royal Sarcophagus',
    category: 'funerary',
    position: [0, 0.1, -1.5],
    chamber: 3,
    shortDescription:
      "The gilded outer sarcophagus of the pharaoh, crafted from cedar wood and covered in gold leaf with lapis lazuli inlay.",
    historicalContext:
      "Sarcophagi were used in ancient Egypt as the final resting place for mummified remains. This example dates to the New Kingdom period (1550–1070 BCE). The gold symbolized the divine flesh of the gods and eternal life, while hieroglyphic texts inscribed across its surface offered protection and guided the soul through the underworld. Pharaohs of the 18th Dynasty were typically enclosed in three nested coffins — an innermost golden coffin, a middle coffin of gilded wood, and the outer stone sarcophagus.",
    funFact:
      "The word 'sarcophagus' comes from Greek meaning 'flesh-eater,' though ancient Egyptians called them 'neb ankh' — meaning 'lord of life.' The irony reflects Egyptian beliefs about death as a threshold, not an ending.",
    period: '1320 BCE — New Kingdom, 18th Dynasty',
    material: 'Cedar wood, gold leaf, lapis lazuli inlay',
    color: '#D4AF37',
    discoveredColor: '#7A6020',
    glowColor: '#FFD700',
    modelType: 'sarcophagus',
  },

  {
    id: 'canopic-imsety',
    name: 'Canopic Jar of Imsety',
    category: 'funerary',
    position: [2.2, 0.5, -0.5],
    chamber: 3,
    shortDescription:
      "A human-headed alabaster canopic jar containing the pharaoh's preserved liver, guarded by the son of Horus, Imsety.",
    historicalContext:
      "Canopic jars were essential burial items in ancient Egypt from the Old Kingdom through the Late Period. The four sons of Horus each protected a specific organ: Imsety (human head) protected the liver, Hapy (baboon) the lungs, Duamutef (jackal) the stomach, and Qebehsenuef (falcon) the intestines. The jars were placed in a special chest called a 'canopic chest' and positioned near the body.",
    funFact:
      "The brain was considered unimportant by the Egyptians — it was removed through the nose using a long hook and discarded, while the heart was carefully returned to the body because it was believed to be the seat of intelligence and soul.",
    period: '1320 BCE — New Kingdom',
    material: 'Alabaster, painted faience',
    color: '#E8D8A0',
    discoveredColor: '#C0A870',
    glowColor: '#FFE8A0',
    modelType: 'canopicJar',
  },

  {
    id: 'canopic-hapy',
    name: 'Canopic Jar of Hapy',
    category: 'funerary',
    position: [2.2, 0.5, 0.3],
    chamber: 3,
    shortDescription:
      "The baboon-headed canopic jar of Hapy, guardian of the lungs, made from polished alabaster.",
    historicalContext:
      "Hapy was one of the Four Sons of Horus who guarded the canopic jars. The baboon head represents this deity's protective role over the lungs. In the New Kingdom, canopic jars became increasingly elaborate with detailed carved lids. Hapy was protected by the goddess Nephthys and associated with the north.",
    funFact:
      "Despite being named Hapy, this deity has no relation to Hapi, the god of the Nile flood — they are entirely different gods with different hieroglyphic spellings and iconography.",
    period: '1320 BCE — New Kingdom',
    material: 'Alabaster, gilded lid',
    color: '#D4C4A0',
    discoveredColor: '#9A8C70',
    glowColor: '#FFE8A0',
    modelType: 'canopicJar',
  },

  {
    id: 'canopic-duamutef',
    name: 'Canopic Jar of Duamutef',
    category: 'funerary',
    position: [2.6, 0.5, -1.3],
    chamber: 3,
    shortDescription:
      "A jackal-headed canopic jar containing the pharaoh's stomach, under the protection of Duamutef and the goddess Neith.",
    historicalContext:
      "Duamutef, depicted with a jackal head, was associated with the east and protected the stomach. The goddess Neith served as the jar's guardian deity. The stomach was mummified separately and stored in this vessel, which was inscribed with protective spells from the Book of the Dead.",
    funFact:
      "All four canopic jars were typically placed in a four-compartment alabaster chest nested within an ornate wooden shrine. Tutankhamun's canopic chest was made of a single piece of translucent calcite and is considered one of the most beautiful objects ever created.",
    period: '1320 BCE — New Kingdom',
    material: 'Alabaster, gilded',
    color: '#D4B88A',
    discoveredColor: '#9A8060',
    glowColor: '#FFE0A0',
    modelType: 'canopicJar',
  },

  {
    id: 'canopic-qebehsenuef',
    name: 'Canopic Jar of Qebehsenuef',
    category: 'funerary',
    position: [2.6, 0.5, 0.8],
    chamber: 3,
    shortDescription:
      "The falcon-headed canopic jar of Qebehsenuef, guardian of the intestines, protected by the goddess Serqet.",
    historicalContext:
      "Qebehsenuef — 'he who refreshes his brothers' — had a falcon head and was associated with the west. He protected the intestines and was guarded by the scorpion goddess Serqet. The intestines were removed, cleaned, wrapped in linen, anointed with oils, and placed inside this jar with magical amulets.",
    funFact:
      "The process of mummification took exactly 70 days — the same number of days the star Sirius (Sopdet) disappeared from the Egyptian night sky each year, representing Osiris's death and rebirth.",
    period: '1320 BCE — New Kingdom',
    material: 'Alabaster, painted details',
    color: '#C8B090',
    discoveredColor: '#8C7A60',
    glowColor: '#FFD890',
    modelType: 'canopicJar',
  },

  {
    id: 'anubis-statue',
    name: 'Statue of Anubis',
    category: 'statue',
    position: [0, 0, -7.2],
    rotation: [0, 0, 0],
    scale: 1.8,
    chamber: 3,
    shortDescription:
      "A life-sized black jackal statue of Anubis, god of embalming and guardian of the dead, watches over the burial chamber from the far wall.",
    historicalContext:
      "Anubis (Anpu in Egyptian) was one of the most important deities in Egyptian afterlife mythology. He presided over mummification and guided souls through the Duat (underworld). His black color represented both death and rebirth — the fertile black soil of the Nile Delta that brought life each year. Statues of Anubis were often placed at tomb entrances or in burial chambers to protect the deceased.",
    funFact:
      "When Howard Carter discovered Tutankhamun's tomb in 1922, a gilded wooden statue of Anubis was found guarding the treasury — still wrapped in a linen shroud, untouched for 3,245 years. Carter described it as 'the most thrilling moment' of the entire excavation.",
    period: '1320 BCE — New Kingdom, 18th Dynasty',
    material: 'Gilded wood, obsidian eyes, linen wrappings',
    color: '#1a1a2e',
    discoveredColor: '#111118',
    glowColor: '#6060CC',
    modelType: 'statue',
  },

  {
    id: 'eye-of-horus',
    name: 'Eye of Horus Amulet',
    category: 'amulet',
    position: [-6, 1.0, 2.5],
    chamber: 3,
    shortDescription:
      "A large protective amulet in the form of the Wedjat (Eye of Horus), cast in faience with gold inlay — one of ancient Egypt's most powerful symbols.",
    historicalContext:
      "The Eye of Horus (Wedjat) was one of the most powerful protective symbols in ancient Egypt. According to myth, the god Set tore out Horus's eye during their battle for the throne of Egypt, but the moon god Thoth magically healed it. The restored eye became a symbol of wholeness, healing, and protection. Thousands of these amulets were placed on mummies and in tombs.",
    funFact:
      "The six parts of the Eye of Horus symbol were used as fractions in ancient Egyptian medical measurements: 1/2, 1/4, 1/8, 1/16, 1/32, and 1/64 — together summing to 63/64, with the missing 1/64 said to be magically restored by Thoth himself.",
    period: 'c. 1320 BCE — New Kingdom',
    material: 'Faience (blue-green glazed ceramic), gold inlay',
    color: '#00AAA0',
    discoveredColor: '#207060',
    glowColor: '#00FFEE',
    modelType: 'amulet',
  },

  {
    id: 'scarab-amulet',
    name: 'Heart Scarab',
    category: 'amulet',
    position: [6, 1.0, 2.5],
    chamber: 3,
    shortDescription:
      "A large heart scarab of green jasper inscribed with Chapter 30 of the Book of the Dead — placed over the heart of the mummy to speak on its behalf during judgment.",
    historicalContext:
      "Heart scarabs were carved from dark stone and inscribed with Chapter 30 of the Book of the Dead. They were placed over the heart of the mummy during burial. During the 'Weighing of the Heart' ceremony, Anubis weighed the deceased's heart against the feather of Ma'at (truth and cosmic order). The scarab inscription asked the heart not to testify against its owner before the 42 divine judges.",
    funFact:
      "The ancient Egyptians observed that dung beetles rolled balls of dung across the earth and buried them — mimicking, they believed, how the sun god Khepri rolled the sun across the sky. This made the scarab a symbol of self-creation, sunrise, and eternal renewal.",
    period: 'c. 1320 BCE — New Kingdom',
    material: 'Green jasper, gold mount with cartouche',
    color: '#2E7D32',
    discoveredColor: '#1B4D1E',
    glowColor: '#66BB6A',
    modelType: 'scarab',
  },

  {
    id: 'treasure-chest',
    name: 'Royal Treasure Chest',
    category: 'treasure',
    position: [6.5, 0.25, -5],
    rotation: [0, -0.3, 0],
    chamber: 3,
    shortDescription:
      "An ornate cedar chest bound with hammered gold, containing the pharaoh's jewelry, ritual objects, and personal amulets for use in the afterlife.",
    historicalContext:
      "Tomb treasures served a crucial purpose: to provide the deceased with everything needed in the afterlife. Chests contained clothing, jewelry, cosmetics, games, and ritual objects. The more elaborate the burial, the more 'magical charge' the deceased had to navigate the dangers of the Duat underworld. Egyptian craftsmen spent years creating these objects, with the finest work reserved for royal burials.",
    funFact:
      "Tutankhamun's tomb contained over 5,000 individual objects, including a golden throne, alabaster canopic shrine, his childhood toys, and even a lock of his grandmother Queen Tiye's hair preserved in a tiny coffin. The treasures took Carter's team 10 years to fully catalog.",
    period: 'c. 1320 BCE — New Kingdom',
    material: 'Cedar wood, gold leaf, ebony inlay, ivory',
    color: '#8B4513',
    discoveredColor: '#5C3010',
    glowColor: '#CD7F32',
    modelType: 'chest',
  },

  {
    id: 'shabti-figures',
    name: 'Shabti Worker Figures',
    category: 'funerary',
    position: [-6.5, 0.25, -5],
    rotation: [0, 0.3, 0],
    chamber: 3,
    shortDescription:
      "A set of 365 faience shabti (servant) figurines — one for each day of the year — to perform agricultural labor in the afterlife on behalf of the pharaoh.",
    historicalContext:
      "Shabti (also called ushabti) figures were small funerary statuettes placed in tombs from the Middle Kingdom onward. The word means 'answerer' — they would answer the call to do agricultural work in the afterlife. Wealthy Egyptians might have 401 shabtis: 365 worker figures (one per day of the year) plus 36 overseer figures with whips to supervise the workers. Each worker carried agricultural tools: a hoe, a pick, and a basket.",
    funFact:
      "The most shabtis ever found in one tomb belonged to Taharqa, a Nubian pharaoh (690–664 BCE) — he had over 1,070 shabti figures. The sheer quantity reflected the Egyptians' belief that the afterlife involved real physical labor, and no pharaoh wanted to work in the fields for eternity.",
    period: 'c. 1320 BCE — New Kingdom',
    material: 'Faience (blue-green glazed ceramic), painted hieroglyphs',
    color: '#5B9BD5',
    discoveredColor: '#3A6090',
    glowColor: '#90CAF9',
    modelType: 'shabti',
  },

  {
    id: 'book-of-dead',
    name: 'Book of the Dead',
    category: 'religious',
    position: [3.5, 0.5, 2.8],
    rotation: [0, -0.5, 0],
    chamber: 3,
    shortDescription:
      "A papyrus scroll inscribed with spells, hymns, and illustrated vignettes guiding the pharaoh's soul through the perils of the underworld.",
    historicalContext:
      "The 'Book of the Dead' (ancient Egyptian: 'The Book of Coming Forth by Day') was a collection of funerary spells used throughout the New Kingdom and later periods. It contained up to 192 known spells (chapters) to help the deceased navigate the Duat underworld, pass divine judgment, and achieve eternal life. Each copy was customized for its owner with their name and titles inserted into the spells, and illustrated with detailed vignettes.",
    funFact:
      "The Book of the Dead wasn't a single canonical text — scribes chose different combinations of spells for different clients. Some mass-produced cheaper versions left blank spaces where the client's name should go. Occasionally, a scribe would copy the wrong name throughout the entire scroll.",
    period: 'c. 1320 BCE — New Kingdom',
    material: 'Papyrus, mineral pigments (ochre, malachite, lapis lazuli)',
    color: '#C8A96E',
    discoveredColor: '#9A7A45',
    glowColor: '#E8C88E',
    modelType: 'scroll',
  },
]

// Category color mapping for UI badges
export const CATEGORY_COLORS: Record<ArtifactCategory, { bg: string; text: string; label: string }> = {
  funerary: { bg: 'rgba(139,0,0,0.3)', text: '#FF8888', label: 'Funerary' },
  religious: { bg: 'rgba(75,0,130,0.3)', text: '#BB88FF', label: 'Religious' },
  treasure: { bg: 'rgba(184,134,11,0.3)', text: '#FFD700', label: 'Treasure' },
  statue: { bg: 'rgba(0,60,100,0.3)', text: '#88BBFF', label: 'Statue' },
  amulet: { bg: 'rgba(0,100,80,0.3)', text: '#88FFDD', label: 'Amulet' },
}
