import { collection, addDoc, getDoc, doc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

export interface DetectionResult {
  id?: string;
  label: "fresh" | "rotten";
  confidence: number;
  insight: {
    alasan: string;
    saran: string;
  };
  imageUrl: string;
  createdAt: Date;
}

export async function saveDetection(data: {
  label: "fresh" | "rotten";
  confidence: number;
  insight: { alasan: string; saran: string };
  imageFile: File;
}): Promise<string> {
  // Upload image to Storage
  const timestamp = Date.now();
  const safeFileName = data.imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `detections/${timestamp}-${safeFileName}`;
  const storageRef = ref(storage, storagePath);
  
  await uploadBytes(storageRef, data.imageFile);
  const imageUrl = await getDownloadURL(storageRef);

  // Save to Firestore
  const docRef = await addDoc(collection(db, "detections"), {
    label: data.label,
    confidence: data.confidence,
    insight: data.insight,
    imageUrl: imageUrl,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

export async function getDetectionById(id: string): Promise<DetectionResult | null> {
  const docRef = doc(db, "detections", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      label: data.label,
      confidence: data.confidence,
      insight: data.insight,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt.toDate(),
    };
  } else {
    return null;
  }
}

export async function getHistory(): Promise<DetectionResult[]> {
  const q = query(collection(db, "detections"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      label: data.label,
      confidence: data.confidence,
      insight: data.insight,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt.toDate(),
    };
  });
}
