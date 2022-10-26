import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, doc } from 'firebase/firestore';

function useFirestoreDocument(path) {
  const [document, setdocument] = useState([]);
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, path), (doc) => {
      setdocument(doc.data());
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return [document, loading];
}

export default useFirestoreDocument;
