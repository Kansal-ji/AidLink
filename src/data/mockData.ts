import { Alert, AssistanceRequest, User } from '../types';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'citizen',
    verified: true,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@rescue.org',
    phone: '+1234567891',
    role: 'volunteer',
    verified: true,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@ngo.org',
    phone: '+1234567892',
    role: 'ngo',
    verified: true,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
  },
];

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Flooding on Main Street',
    description: 'Heavy rainfall has caused severe flooding on Main Street. Several cars are stranded and the road is impassable.',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'Main Street, Downtown',
    },
    type: 'flood',
    severity: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    createdBy: mockUsers[0],
    respondersCount: 3,
  },
  {
    id: '2',
    title: 'House Fire on Oak Avenue',
    description: 'Active house fire with smoke visible from several blocks away. Fire department en route.',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Oak Avenue',
    },
    type: 'fire',
    severity: 'critical',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    createdBy: mockUsers[1],
    respondersCount: 8,
  },
  {
    id: '3',
    title: 'Multi-vehicle Accident',
    description: 'Three-car accident at the intersection of 5th and Broadway. Traffic is backed up and emergency services are needed.',
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: '5th Street & Broadway',
    },
    type: 'accident',
    severity: 'medium',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    createdBy: mockUsers[2],
    respondersCount: 5,
  },
];

// Mock assistance requests
export const mockRequests: AssistanceRequest[] = [
  {
    id: '1',
    title: 'Need medical assistance for elderly person',
    description: 'My grandmother has fallen and cannot get up. She is conscious but in pain. Need medical help urgently.',
    type: 'medical',
    location: {
      latitude: 40.7282,
      longitude: -74.0776,
      address: '456 Elm Street, Apt 3B',
    },
    status: 'pending',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    requester: mockUsers[0],
  },
  {
    id: '2',
    title: 'Food and water needed for family',
    description: 'Our apartment building has been without power for 2 days due to the storm. We have run out of food and clean water. Family of 4 including 2 young children.',
    type: 'food',
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: '789 Pine Street, Building C',
    },
    status: 'accepted',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    requester: mockUsers[1],
    responder: mockUsers[2],
    acceptedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '3',
    title: 'Transportation to evacuation center',
    description: 'Elderly couple needs transportation to the evacuation center. Cannot walk long distances and public transport is not running.',
    type: 'transportation',
    location: {
      latitude: 40.7549,
      longitude: -73.9840,
      address: '321 Maple Drive',
    },
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    requester: mockUsers[2],
  },
  {
    id: '4',
    title: 'Temporary shelter needed',
    description: 'Our home has been damaged by flooding and is uninhabitable. Need temporary shelter for tonight for family of 3.',
    type: 'shelter',
    location: {
      latitude: 40.7421,
      longitude: -74.0018,
      address: '654 River Road',
    },
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    requester: mockUsers[0],
    responder: mockUsers[1],
    acceptedAt: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];

// Mock current user
export const mockCurrentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  role: 'volunteer',
  verified: true,
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
};