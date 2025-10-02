import React from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminOnly = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAdmin) return null;

  return children;
};

export default AdminOnly;