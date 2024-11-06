import { FIRESTORE_DB } from "../utils/FirebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { phonePlans } from "../data/mock/phoneplan";

async function populatePhonePlans() {
  try {
    const plansCollection = collection(FIRESTORE_DB, "plans");

    for (const plan of phonePlans) {
      // Using provider as document ID
      const docRef = doc(plansCollection, plan.provider);
      await setDoc(docRef, plan);
      console.log(`Successfully added plan: ${plan.provider}`);
    }

    console.log("All plans have been successfully added to Firestore!");
  } catch (error) {
    console.error("Error populating plans:", error);
  }
}

// Execute the population
populatePhonePlans();
