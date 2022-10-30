import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot } from 'firebase/firestore';

function useFirestoreQuery(query) {
  const [firestoreCollection, setFirestoreCollection] = useState([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  const firestore = getFirestore();
  useEffect(() => {
    const unsubscribe = onSnapshot(query, (snapshot) => {
      setFirestoreCollection(snapshot.docs.map((doc) => doc.data()));
      setFirestoreLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [firestoreCollection, firestoreLoading];
}

export default useFirestoreQuery;
