export type ChannelType = "Text" | "Voice" | "Video";

export interface Channel {
  _id: string;
  name: string;
  type: ChannelType;
}

export interface Category {
  _id: string;
  name: string;
  channels: Channel[];
}

interface PopulatedOwner {
  _id: string;
  name: string;
  profilePic: string;
}

interface ServerMember {
  user: string;
  roles: string[];
}

export interface Server {
  _id: string;
  name: string;
  imageUrl: string;
  owner: PopulatedOwner;
  members: ServerMember[];
  categories: Category[];
  description?: string;
}
