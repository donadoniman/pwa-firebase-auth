import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  Auth,
  User,
  ConfirmationResult,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  Firestore,
  WhereFilterOp,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY as string,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN as string,
  databaseURL: process.env.REACT_APP_DATABASE_URL as string,
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET as string,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID as string,
  appId: process.env.REACT_APP_APP_ID as string,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

/* Authentication Functions */
export const firebaseAuth = {
  signUpWithEmail: async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },

  loginWithEmail: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },

  loginWithPhone: async (
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
  ): Promise<ConfirmationResult> => {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  },

  setupRecaptcha: (recaptchaContainerId: string): RecaptchaVerifier => {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized.");
    }
    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
      callback: (response: any) => {
        console.log("reCAPTCHA solved:", response);
      },
    });
    verifier.render();
    return verifier;
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
    console.log("User logged out");
  },

  observeAuthState: (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

/* Firestore Database Functions */
export const firebaseDB = {
  getDocumentById: async (
    collectionName: string,
    docId: string
  ): Promise<any> => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    throw new Error("No document found!");
  },

  setDocument: async (
    collectionName: string,
    docId: string,
    data: any
  ): Promise<boolean> => {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    console.log("Document successfully written!");
    return true;
  },

  addDocument: async (collectionName: string, data: any): Promise<string> => {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document added with ID:", docRef.id);
    return docRef.id;
  },

  updateDocument: async (
    collectionName: string,
    docId: string,
    data: any
  ): Promise<boolean> => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document successfully updated!");
    return true;
  },

  deleteDocument: async (
    collectionName: string,
    docId: string
  ): Promise<boolean> => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
    return true;
  },

  getDocumentsByQuery: async (
    collectionName: string,
    field: string,
    operator: WhereFilterOp,
    value: any
  ): Promise<any[]> => {
    try {
      // Create the Firestore query
      const q = query(
        collection(db, collectionName),
        where(field, operator, value)
      );
      // Execute the query
      const querySnapshot = await getDocs(q);
      // Map the results to an array of objects with document ID and data
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching documents by query:", error);
      throw error;
    }
  },

  getAllDocuments: async (collectionName: string): Promise<any[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  getNestedCollection: async (
    parentCollection: string,
    parentDocId: string,
    nestedCollection: string
  ): Promise<any[]> => {
    const nestedCollectionRef = collection(
      db,
      parentCollection,
      parentDocId,
      nestedCollection
    );
    const querySnapshot = await getDocs(nestedCollectionRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  getAllNestedCollections: async (
    parentCollection: string,
    parentDocId: string
  ): Promise<any[]> => {
    try {
      // Reference the parent document
      const parentDocRef = doc(db, parentCollection, parentDocId);

      // Fetch the parent document to retrieve subcollection names
      const parentDocSnapshot = await getDoc(parentDocRef);

      if (!parentDocSnapshot.exists()) {
        throw new Error(
          `Parent document not found in ${parentCollection}/${parentDocId}`
        );
      }

      // Dynamically retrieve subcollection names from a field in the parent document
      const subCollectionNames: string[] =
        parentDocSnapshot.data()?.subCollectionNames;

      if (!subCollectionNames || subCollectionNames.length === 0) {
        throw new Error("No subcollection names found in the parent document.");
      }

      // Fetch data from all subcollections dynamically
      const allSubCollections = await Promise.all(
        subCollectionNames.map(async (subCollectionName) => {
          const subCollectionRef = collection(parentDocRef, subCollectionName);
          const querySnapshot = await getDocs(subCollectionRef);

          return {
            collectionName: subCollectionName,
            data: querySnapshot.docs.map((doc) => ({
              id: doc.id, // Document ID
              ...doc.data(), // Document data
            })),
          };
        })
      );

      return allSubCollections;
    } catch (error) {
      console.error("Error fetching nested collections:", error);
      throw new Error("Failed to retrieve nested collections.");
    }
  },
};
