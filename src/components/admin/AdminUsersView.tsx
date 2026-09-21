import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  UserX,
  Edit2,
  Trash2,
  KeyRound,
  Eye,
  X,
  Filter,
  Check,
  Copy,
  Clock,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { INITIAL_USERS, AdminUserRecord } from './adminMockData';
import { formatPrice } from '../../utils/formatters';

interface AdminUsersViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ currency }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>(() => {
    const saved = localStorage.getItem('zebra_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [inspectingUser, setInspectingUser] = useState<AdminUserRecord | null>(null);
  const [tempPasswordNotice, setTempPasswordNotice] = useState<{ user: string; pass: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+255 ');
  const [role, setRole] = useState<'Super Admin' | 'Kitchen Manager' | 'Dispatcher' | 'Driver' | 'Customer'>('Kitchen Manager');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');

  useEffect(() => {
    localStorage.setItem('zebra_admin_users', JSON.stringify(users));
  }, [users]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('+255 7');
    setRole('Kitchen Manager');
    setStatus('active');
    setShowAddUserModal(true);
  };

  const openEditModal = (u: AdminUserRecord) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
    setStatus(u.status);
    setShowAddUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id
            ? { ...u, name, email, phone, role, status }
            : u
        )
      );
      showToast(`User ${name} updated successfully!`);
    } else {
      const newUser: AdminUserRecord = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        role,
        status,
        ordersCount: 0,
        totalSpent: 0,
        joinedDate: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      setUsers([newUser, ...users]);
      showToast(`Added new staff member: ${name}`);
    }

    setShowAddUserModal(false);
  };

  const toggleUserStatus = (id: string, userName: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`User ${userName} is now ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      showToast(`User ${userName} deleted`);
      if (inspectingUser?.id === id) setInspectingUser(null);
    }
  };

  const handleResetPassword = (userName: string) => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setTempPasswordNotice({ user: userName, pass: `Zebra-${randomPin}!` });
  };

  const rolesList = ['all', 'Super Admin', 'Kitchen Manager', 'Dispatcher', 'Driver', 'Customer'];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Users, Staff & Permission Roles</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              {users.length} Total Users
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Full user lifecycle management: add kitchen operators, drivers, edit details, assign security roles, and suspend accounts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New User / Staff</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {tempPasswordNotice && (
        <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/30 text-neutral-800 dark:text-neutral-200 text-xs space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-blue-600 dark:text-blue-400">
                Temporary Password Generated for {tempPasswordNotice.user}
              </span>
            </div>
            <button onClick={() => setTempPasswordNotice(null)} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400 select-all">
              {tempPasswordNotice.pass}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(tempPasswordNotice.pass);
                showToast('Temporary password copied to clipboard!');
              }}
              className="flex items-center space-x-1 text-[11px] font-bold text-neutral-600 dark:text-neutral-300 hover:text-blue-500"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
          </div>
          <p className="text-[11px] text-neutral-500">
            Share this password with the staff member. They will be prompted to choose a new password upon first login.
          </p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {rolesList.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === r
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                          <span>{u.name}</span>
                          {u.role === 'Super Admin' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-400">Joined {u.joinedDate}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                    <div className="space-y-0.5">
                      <p className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        <span>{u.email}</span>
                      </p>
                      <p className="flex items-center space-x-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{u.phone}</span>
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'Super Admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : u.role === 'Kitchen Manager'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                          : u.role === 'Dispatcher'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : u.role === 'Driver'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-neutral-800 dark:text-neutral-200">
                    {u.ordersCount} orders
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(u.totalSpent, currency)}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleUserStatus(u.id, u.name)}
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                      }`}
                      title="Click to toggle status"
                    >
                      {u.status === 'active' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" />
                          <span>Suspended</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => setInspectingUser(u)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="View Profile Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(u.name)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Reset Password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-rose-500/10 text-rose-500"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span>{editingUser ? 'Edit User Information' : 'Add New Staff / User'}</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Amani Rashid Mushi"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="amani@zebradsm.com"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Phone Number (Tanzania +255)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+255 754 889 123"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    System Role *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Kitchen Manager">Kitchen Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Driver">Driver / Rider</option>
                    <option value="Customer">VIP Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                >
                  {editingUser ? 'Update User' : 'Create User Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect User Profile Drawer / Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">User Profile Details</h3>
              <button onClick={() => setInspectingUser(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <img src={inspectingUser.avatar} alt={inspectingUser.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h4 className="font-bold text-lg text-neutral-900 dark:text-white">{inspectingUser.name}</h4>
                <p className="text-xs text-neutral-400">{inspectingUser.role}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  inspectingUser.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {inspectingUser.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Email</p>
                <p className="font-semibold text-neutral-900 dark:text-white break-all">{inspectingUser.email}</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Phone</p>
                <p className="font-semibold font-mono text-neutral-900 dark:text-white">{inspectingUser.phone}</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Orders Placed</p>
                <p className="font-bold text-base text-neutral-900 dark:text-white">{inspectingUser.ordersCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Total Spent</p>
                <p className="font-bold text-base text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatPrice(inspectingUser.totalSpent, currency)}
                </p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setInspectingUser(null);
                  openEditModal(inspectingUser);
                }}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs"
              >
                Edit Details
              </button>
              <button
                onClick={() => handleResetPassword(inspectingUser.name)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
