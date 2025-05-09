import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

// Define the UserRole enum to match what's in the Prisma schema
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

// Define a User type with the properties needed for permissions
export interface User {
  id: string;
  name: string;
  role: UserRole;
  [key: string]: any; // Allow for other properties
}

// Define permission types
export type Resource = 'modules' | 'lessons' | 'users' | 'achievements';
export type Action = 'create' | 'read' | 'update' | 'delete';

export function createPermission(action: Action, resource: Resource): string {
  return `${action}:${resource}`;
}

// Role-based permission mapping
const rolePermissions: Record<string, string[]> = {
  STUDENT: [
    createPermission('read', 'modules'),
    createPermission('read', 'lessons'),
  ],
  TEACHER: [
    createPermission('read', 'modules'),
    createPermission('read', 'lessons'),
    createPermission('create', 'lessons'),
    createPermission('update', 'lessons'),
    createPermission('read', 'users'),
  ],
  ADMIN: [
    createPermission('read', 'modules'),
    createPermission('create', 'modules'),
    createPermission('update', 'modules'),
    createPermission('delete', 'modules'),
    createPermission('read', 'lessons'),
    createPermission('create', 'lessons'),
    createPermission('update', 'lessons'),
    createPermission('delete', 'lessons'),
    createPermission('read', 'users'),
    createPermission('create', 'users'),
    createPermission('update', 'users'),
    createPermission('delete', 'users'),
    createPermission('read', 'achievements'),
    createPermission('create', 'achievements'),
    createPermission('update', 'achievements'),
    createPermission('delete', 'achievements'),
  ]
};

// Check if a user has a specific permission
export function hasPermission(user: User, action: Action, resource: Resource): boolean {
  if (!user || !user.role) return false;
  
  const permission = createPermission(action, resource);
  return rolePermissions[user.role].includes(permission);
}

// Get all permissions for a specific role
export function getPermissionsForRole(role: string): string[] {
  return rolePermissions[role] || [];
}

// Check if a user has a specific role
export function hasRole(user: User, role: string): boolean {
  if (!user || !user.role) return false;
  
  if (role === UserRole.STUDENT) {
    return true; // Everyone has at least STUDENT permissions
  }
  
  if (role === UserRole.TEACHER) {
    return user.role === UserRole.TEACHER || user.role === UserRole.ADMIN;
  }
  
  return user.role === role;
}

// Get a user by ID with their role
export async function getUserWithRole(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) return null;
    
    return {
      ...user,
      role: user.role as UserRole
    };
  } catch (error) {
    console.error('Error fetching user with role:', error);
    return null;
  }
}

// Helper to get the effective permissions for a user
export function getUserPermissions(user: User): string[] {
  if (!user || !user.role) return [];
  return rolePermissions[user.role];
}
