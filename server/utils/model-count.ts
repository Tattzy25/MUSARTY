import {
  GROUP1_MODELS,
  GROUP2_MODELS,
  SPECIALTY_MODELS,
} from "../config/model-groups";

console.log("📊 MODEL COUNT VERIFICATION:");
console.log(`GROUP 1 (Fast Text): ${GROUP1_MODELS.length} models`);
console.log(`GROUP 2 (Heavy): ${GROUP2_MODELS.length} models`);
console.log(`SPECIALTY (Creative): ${SPECIALTY_MODELS.length} models`);
console.log(
  `TOTAL: ${GROUP1_MODELS.length + GROUP2_MODELS.length + SPECIALTY_MODELS.length} models`,
);

console.log("\n🔥 GROUP 1 MODELS:");
GROUP1_MODELS.forEach((m, i) => console.log(`${i + 1}. ${m.name} (${m.id})`));

console.log("\n💪 GROUP 2 MODELS:");
GROUP2_MODELS.forEach((m, i) => console.log(`${i + 1}. ${m.name} (${m.id})`));

console.log("\n🎨 SPECIALTY MODELS:");
SPECIALTY_MODELS.forEach((m, i) =>
  console.log(`${i + 1}. ${m.name} (${m.id})`),
);
