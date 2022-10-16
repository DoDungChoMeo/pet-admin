import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection } from 'firebase/firestore';

function useFirestoreCollection(collectionName) {
  const [firestoreCollection, setFirestoreCollection] = useState([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, collectionName),
      (snapshot) => {
        setFirestoreCollection(snapshot.docs.map((e) => e.data()));
        setFirestoreLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return [firestoreCollection, firestoreLoading];
}

export default useFirestoreCollection;
