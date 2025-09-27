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

interface ServerMember {
  user: string | PopulatedUser;
  roles: string[];
  _id: string;
}

export interface Server {
  _id: string;
  name: string;
  description?: string;
  imageUrl: string;
  owner: PopulatedUser;
  visibility: "public" | "private" | "invite-only";
  members: ServerMember[];
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
