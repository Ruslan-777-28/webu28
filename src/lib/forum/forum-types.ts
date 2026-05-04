import { Timestamp } from 'firebase/firestore';

export type ForumQuestionStatus = "pending" | "open" | "answered" | "featured" | "hidden" | "rejected";

export interface ForumQuestion {
  id: string;
  title: string;
  body: string;
  topicKey: string;        // active focus key, e.g. "tarot", "astrology", "lector"
  topicLabel: string;      // e.g. "Tarot", "Astrology", "LECTOR"
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorRole: string | null;
  authorTrustLevel: number | null;

  status: ForumQuestionStatus;
  answerCount: number;
  likeCount: number;
  viewCount: number;

  pinned: boolean;
  featured: boolean;

  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
  lastActivityAt: any; // serverTimestamp
  createdAtMs: number;
}

export interface ForumAnswer {
  id: string;
  questionId: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorRole: string | null;
  authorTrustLevel: number | null;

  likeCount: number;
  isAccepted: boolean;

  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
}

export interface ForumLike {
  id: string;
  userId: string;
  targetId: string; // questionId or answerId
  targetType: "question" | "answer";
  createdAt: any; // serverTimestamp
}
