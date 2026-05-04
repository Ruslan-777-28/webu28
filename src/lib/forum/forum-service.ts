import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp, 
  increment,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { ForumQuestion, ForumAnswer, ForumLike } from './forum-types';

const QUESTIONS_COLLECTION = 'forumQuestions';
const ANSWERS_SUBCOLLECTION = 'answers';
const LIKES_COLLECTION = 'forumLikes';

export async function createQuestion(data: Partial<ForumQuestion>) {
  const colRef = collection(db, QUESTIONS_COLLECTION);
  const now = Date.now();
  
  const questionData = {
    ...data,
    status: 'pending',
    answerCount: 0,
    likeCount: 0,
    viewCount: 0,
    pinned: false,
    featured: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
    createdAtMs: now,
  };

  if (process.env.NODE_ENV === 'development') {
    console.debug("[ForumService] Creating question:", {
      topicKey: data.topicKey,
      topicLabel: data.topicLabel,
      authorId: data.authorId,
      payload: questionData
    });
  }

  return await addDoc(colRef, questionData);
}

export function subscribeToQuestions(topicKey: string, callback: (questions: ForumQuestion[]) => void) {
  const colRef = collection(db, QUESTIONS_COLLECTION);
  let q = query(
    colRef, 
    where('topicKey', '==', topicKey),
    where('status', 'in', ['open', 'answered', 'featured']),
    orderBy('lastActivityAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumQuestion));
    callback(questions);
  });
}

export function subscribeToAdminQuestions(callback: (questions: ForumQuestion[]) => void) {
  const colRef = collection(db, QUESTIONS_COLLECTION);
  let q = query(
    colRef,
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumQuestion));
    callback(questions);
  });
}

export type ModerationMeta = {
  moderatedBy: string;
  moderatedByName: string;
  moderatedByRole: 'admin' | 'moderator' | 'architect';
  moderationAction: string;
  moderatedByArchitectTopicKey?: string;
  moderatedByArchitectTopicLabel?: string;
};

export async function updateQuestionStatus(
  questionId: string,
  status: ForumQuestion['status'],
  options?: { pinned?: boolean; featured?: boolean; moderation?: ModerationMeta }
) {
  const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
  const updateData: any = {
    status,
    updatedAt: serverTimestamp()
  };
  if (options?.pinned !== undefined) updateData.pinned = options.pinned;
  if (options?.featured !== undefined) updateData.featured = options.featured;

  if (options?.moderation) {
    updateData.moderatedAt = serverTimestamp();
    updateData.moderatedBy = options.moderation.moderatedBy;
    updateData.moderatedByName = options.moderation.moderatedByName;
    updateData.moderatedByRole = options.moderation.moderatedByRole;
    updateData.moderationAction = options.moderation.moderationAction;
    if (options.moderation.moderatedByArchitectTopicKey) {
      updateData.moderatedByArchitectTopicKey = options.moderation.moderatedByArchitectTopicKey;
      updateData.moderatedByArchitectTopicLabel = options.moderation.moderatedByArchitectTopicLabel;
    }
  }

  await updateDoc(docRef, updateData);
}

export function subscribeToPendingCount(callback: (count: number) => void) {
  const colRef = collection(db, QUESTIONS_COLLECTION);
  const q = query(colRef, where('status', '==', 'pending'));

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
}

export async function getQuestion(questionId: string): Promise<ForumQuestion | null> {
  const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ForumQuestion;
}

export async function addAnswer(questionId: string, data: Partial<ForumAnswer>) {
  const colRef = collection(db, QUESTIONS_COLLECTION, questionId, ANSWERS_SUBCOLLECTION);
  
  const answerData = {
    ...data,
    questionId,
    likeCount: 0,
    isAccepted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.debug("[ForumService] Adding answer:", {
      questionId,
      authorId: data.authorId,
      payload: answerData
    });
  }

  const answerDoc = await addDoc(colRef, answerData);
  
  // Update answer count on question
  const questionRef = doc(db, QUESTIONS_COLLECTION, questionId);
  await updateDoc(questionRef, {
    answerCount: increment(1),
    lastActivityAt: serverTimestamp()
  });

  return answerDoc;
}

export function subscribeToAnswers(questionId: string, callback: (answers: ForumAnswer[]) => void) {
  const colRef = collection(db, QUESTIONS_COLLECTION, questionId, ANSWERS_SUBCOLLECTION);
  const q = query(colRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const answers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumAnswer));
    callback(answers);
  });
}

export async function toggleLike(userId: string, targetId: string, targetType: "question" | "answer", questionId?: string) {
  const likeId = `${userId}_${targetId}`;
  const likeRef = doc(db, LIKES_COLLECTION, likeId);
  const likeSnap = await getDoc(likeRef);

  const isLiked = likeSnap.exists();
  
  if (isLiked) {
    // Unlike
    await deleteDoc(likeRef);
    
    // Decrement count
    if (targetType === 'question') {
      const qRef = doc(db, QUESTIONS_COLLECTION, targetId);
      await updateDoc(qRef, { likeCount: increment(-1) });
    } else if (targetType === 'answer' && questionId) {
      const aRef = doc(db, QUESTIONS_COLLECTION, questionId, ANSWERS_SUBCOLLECTION, targetId);
      await updateDoc(aRef, { likeCount: increment(-1) });
    }
  } else {
    // Like
    await setDoc(likeRef, {
      userId,
      targetId,
      targetType,
      createdAt: serverTimestamp()
    });
    
    // Increment count
    if (targetType === 'question') {
      const qRef = doc(db, QUESTIONS_COLLECTION, targetId);
      await updateDoc(qRef, { likeCount: increment(1) });
    } else if (targetType === 'answer' && questionId) {
      const aRef = doc(db, QUESTIONS_COLLECTION, questionId, ANSWERS_SUBCOLLECTION, targetId);
      await updateDoc(aRef, { likeCount: increment(1) });
    }
  }

  return !isLiked;
}

export async function checkIfLiked(userId: string, targetId: string) {
  const likeId = `${userId}_${targetId}`;
  const likeRef = doc(db, LIKES_COLLECTION, likeId);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
}
