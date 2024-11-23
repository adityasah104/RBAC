// userDatabase.js
export const users = [
    {
      id: 1,
      name: 'John Admin',
      email: 'john@example.com',
      password: 'admin123', // In a real app, this would be hashed
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'assign_roles'],
      status: 'active',
      lastLogin: '2024-03-15 10:30 AM'
    },
    {
      id: 2,
      name: 'Sarah Moderator',
      email: 'sarah@example.com',
      password: 'mod123',
      role: 'moderator',
      permissions: ['read', 'write', 'delete'],
      status: 'active',
      lastLogin: '2024-03-14 03:45 PM'
    }
  ];
  
  export const authService = {
    login: (email, password) => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const token = btoa(JSON.stringify({ userId: user.id, role: user.role })); // Simple token creation
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }
      throw new Error('Invalid credentials');
    },
  
    signup: (userData) => {
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }
  
      const newUser = {
        id: users.length + 1,
        ...userData,
        role: 'client', // Default role for new users
        permissions: ['read'], // Default permissions
        status: 'active',
        lastLogin: new Date().toLocaleString()
      };
  
      users.push(newUser);
      
      // Auto login after signup
      const token = btoa(JSON.stringify({ userId: newUser.id, role: newUser.role }));
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    },
  
    getCurrentUser: () => {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    },
  
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    },
  
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    }
  };