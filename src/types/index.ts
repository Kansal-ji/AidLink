export interface Alert {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  type: 'fire' | 'flood' | 'medical' | 'accident' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'in-progress';
  createdAt: Date;
  createdBy: User;
  images?: string[];
  respondersCount: number;
}

export interface AssistanceRequest {
  id: string;
  title: string;
  description: string;
  type: 'medical' | 'food' | 'shelter' | 'transportation' | 'rescue' | 'other';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  requester: User;
  responder?: User;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'volunteer' | 'ngo' | 'admin';
  verified: boolean;
  avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'request' | 'response' | 'system';
  read: boolean;
  createdAt: Date;
}