import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaUserFriends, FaTimes, FaSave } from 'react-icons/fa';
import { fetchUsers, createUser, deleteUser, updateUser } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      console.log('🔍 Usuarios cargados:', data);
      console.log('🔍 Estructura del primer usuario:', data[0] ? JSON.stringify(data[0], null, 2) : 'No hay usuarios');
      
      // Verificar si el _id está presente en cada usuario
      data.forEach((user, index) => {
        console.log(`Usuario ${index + 1}:`, {
          name: user.name,
          hasId: '_id' in user,
          id: user._id,
          keys: Object.keys(user)
        });
      });
      
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
      setShowAddUserForm(false);
      setNewUser({ name: '', email: '', role: 'user' });
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('🔍 handleDeleteUser - userId recibido:', userId);
    console.log('🔍 handleDeleteUser - tipo de userId:', typeof userId);
    
    if (!userId || userId === 'undefined') {
      console.error('❌ Error: userId es undefined o inválido');
      setError('ID de usuario inválido');
      return;
    }
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await updateUser(editingUser._id, editingUser);
      setUsers(users.map(user => 
        user._id === editingUser._id ? updatedUser : user
      ));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const roles = {
    admin: { text: 'Administrador', color: 'bg-red-500' },
    manager: { text: 'Gerente', color: 'bg-blue-500' },
    user: { text: 'Usuario', color: 'bg-green-500' }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios del sistema</p>
        </div>
        
        <button 
          onClick={() => setShowAddUserForm(true)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Agregar Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddUserForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Agregar Nuevo Usuario</h3>
            <button 
              onClick={() => setShowAddUserForm(false)}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                Rol
              </label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="user">Usuario</option>
                <option value="manager">Gerente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddUserForm(false)}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !newUser.name.trim() || !newUser.email.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showAddUserForm ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FaUserFriends className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay usuarios registrados</p>
          <button 
            onClick={() => setShowAddUserForm(true)}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Agregar primer usuario
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 text-gray-500 text-sm font-medium px-4 py-3 border-b">
            <div className="col-span-1">Avatar</div>
            <div className="col-span-3">Nombre</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Rol</div>
            <div className="col-span-2">Acciones</div>
          </div>
          
          <div className="divide-y">
            {users.map((user, index) => (
              <div key={user._id || `user-${index}`} className="px-4 py-3">
                {editingUser && editingUser._id === user._id ? (
                  // Formulario de edición
                  <form onSubmit={handleUpdateUser} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {editingUser.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        disabled={loading}
                      >
                        <option value="user">Usuario</option>
                        <option value="manager">Gerente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={loading || !editingUser.name.trim() || !editingUser.email.trim()}
                          className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                        >
                          <FaSave />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          className="text-gray-400 hover:text-gray-600 disabled:text-gray-300"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  // Vista normal del usuario
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-1">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="col-span-3 font-medium">{user.name}</div>
                    <div className="col-span-4 text-gray-600">{user.email}</div>
                    <div className="col-span-2">
                      <span className={`${roles[user.role]?.color || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full`}>
                        {roles[user.role]?.text || user.role}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 