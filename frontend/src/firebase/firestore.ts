import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure the Firebase configuration is correct

// Define a type for the Firestore data
interface FirestoreData {
  id: string;
  data: Record<string, unknown>; // Use Record<string, unknown> to represent dynamic fields
}

export const fetchDataFromFirestore = (
  collectionName: string,
  setData: React.Dispatch<React.SetStateAction<FirestoreData[]>>
) => {
  const collectionRef = collection(db, collectionName);

  const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
    const fetchedData: FirestoreData[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(), // Store the document data under 'data'
    }));

    setData(fetchedData); // Update the state with fetched data
  });

  return unsubscribe; // Return unsubscribe function to cleanup on unmount
};
