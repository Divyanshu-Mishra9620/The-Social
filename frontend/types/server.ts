export type ChannelType = "Text" | "Voice" | "Video";

export interface Channel {
  _id: string;
  name: string;
  type: ChannelType;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  channels: Channel[];
}

interface PopulatedUser {
  _id: string;
  name: string;
  profilePic: string;
}

export interface Server {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
  owner: PopulatedUser;
  visibility: "public" | "private" | "invite-only";
  members: User[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: PopulatedUser;
  channel: string;
  edited?: boolean;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  user: {
    _id: string;
    name: string;
    profilePic: string;
  };
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic?: string;
  banner?: string;
  bio?: string;
  status: "online" | "idle" | "dnd" | "offline";
  customStatus?: string;
  joinedAt: string;
  roles?: string[];
  badges?: string[];
}

export interface DirectMessage {
  _id: string;
  participants: User[];
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  unreadCount: number;
}

export interface VoiceParticipant {
  _id: string;
  name: string;
  profilePic?: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
}
