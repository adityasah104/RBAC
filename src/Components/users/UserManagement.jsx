import React, { useState } from 'react';
import { 
  Pencil, Trash2, UserPlus, Shield, 
  AlertCircle
} from 'lucide-react';

const UserManagement = ({ currentUser }) => {
  // Sample user data - in a real app, this would come from an API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Admin',
      email: 'john@example.com',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'assign_roles'],
      status: 'active',
      lastLogin: '2024-03-15 10:30 AM'
    },
    {
      id: 2,
      name: 'Sarah Moderator',
      email: 'sarah@example.com',
      role: 'moderator',
      permissions: ['read', 'write', 'delete'],
      status: 'active',
      lastLogin: '2024-03-14 03:45 PM'
    },
    {
      id: 3,
      name: 'Mike Client',
      email: 'mike@example.com',
      role: 'client',
      permissions: ['read'],
      status: 'active',
      lastLogin: '2024-03-13 09:15 AM'
    }
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const canModifyUser = (userToModify) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') return false;
    if (currentUser.role === 'moderator' && userToModify.role === 'admin') return false;
    if (userToModify.id === currentUser.id) return false;
    return true;
  };

  const canAssignRoles = (userToModify) => {
    return currentUser.role === 'admin' && userToModify.id !== currentUser.id;
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    // In a real app, you'd open a modal or navigate to an edit page
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowDeleteConfirm(null);
  };

  const handleRoleChange = (user, newRole) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { 
            ...u, 
            role: newRole, 
            permissions: getDefaultPermissions(newRole)
          } 
        : u
    ));
    setShowRoleModal(false);
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case 'admin':
        return ['read', 'write', 'delete', 'assign_roles'];
      case 'moderator':
        return ['read', 'write', 'delete'];
      case 'client':
        return ['read'];
      default:
        return ['read'];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((permission, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded">
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {canModifyUser(user) && (
                      <>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {canAssignRoles(user) && (
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-medium">Confirm Delete</h3>
            </div>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Assign Role to {selectedUser.name}
            </h3>
            <div className="space-y-3">
              {['admin', 'moderator', 'client'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedUser, role)}
                  className={`w-full text-left px-4 py-2 border rounded-md ${
                    selectedUser.role === role
                      ? 'bg-blue-100 border-blue-400 text-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;