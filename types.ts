export enum MessageSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface Message {
  id: string;
  text: string;
  sender: MessageSender;
  image?: string;
  isError?: boolean;
  timestamp: any; // Firestore timestamp
}

export type BranchId = 'scientific' | 'literary' | 'industrial' | 'entrepreneurship';

export interface Branch {
  id: BranchId;
  name: string;
  description: string;
  systemInstruction: string;
}

export interface Subject {
  id: string;
  name: string;
  emoji: string;
  systemInstruction: string;
  branch: BranchId[];
}

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  branchId?: BranchId;
}

export interface ChatSession {
    id: string;
    userId: string;
    title: string;
    branchId: BranchId;
    createdAt: any; // Firestore timestamp
}