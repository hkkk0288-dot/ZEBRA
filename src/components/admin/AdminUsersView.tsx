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
  Copy,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Lock,
  RefreshCw,
  UtensilsCrossed,
  ChefHat,
  Bike,
  ShieldAlert,
  Database
} from 'lucide-react';
import { INITIAL_USERS, AdminUserRecord } from './adminMockData';
import { RolePermissions, SystemRole } from '../../types';
import { formatPrice } from '../../utils/formatters';
import {
  fetchUsersFromFirestore,
  saveUserToFirestore,
  deleteUserFromFirestore
} from '../../services/firebaseDbService';

interface AdminUsersViewProps {
  currency: 'USD' | 'TZS';
}

const DEFAULT_ROLE_PERMISSIONS: Record<SystemRole, RolePermissions> = {
  'Super Admin': {
    canTakeOrders: true,
    canViewKitchen: true,
    canManageProducts: true,
    canDispatchRiders: true,
    canManageUsers: true,
    canViewFinancials: true,
    canManageSettings: true
  },
  'Kitchen Manager': {
    canTakeOrders: false,
    canViewKitchen: true,
    canManageProducts: true,
    canDispatchRiders: false,
    canManageUsers: false,
    canViewFinancials: false,
    canManageSettings: false
  },
  'Waiter': {
    canTakeOrders: true,
    canViewKitchen: true,
    canManageProducts: false,
    canDispatchRiders: false,
    canManageUsers: false,
    canViewFinancials: false,
    canManageSettings: false
  },
  'Dispatcher': {
    canTakeOrders: false,
    canViewKitchen: false,
    canManageProducts: false,
    canDispatchRiders: true,
    canManageUsers: false,
    canViewFinancials: false,
    canManageSettings: false
  },
  'Driver': {
    canTakeOrders: false,
    canViewKitchen: false,
    canManageProducts: false,
    canDispatchRiders: false,
    canManageUsers: false,
    canViewFinancials: false,
    canManageSettings: false
  },
  'Customer': {
    canTakeOrders: false,
    canViewKitchen: false,
    canManageProducts: false,
    canDispatchRiders: false,
    canManageUsers: false,
    canViewFinancials: false,
    canManageSettings: false
  }
};

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
  const [whatsappShareModal, setWhatsappShareModal] = useState<{
    user: AdminUserRecord;
    tempPassword: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+255 7');
  const [role, setRole] = useState<SystemRole>('Waiter');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [assignedBranch, setAssignedBranch] = useState('Zebra Central Masaki Kitchen');
  const [passwordMode, setPasswordMode] = useState<'auto' | 'manual'>('auto');
  const [customPassword, setCustomPassword] = useState('');
  const [permissions, setPermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS['Waiter']);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('zebra_admin_users', JSON.stringify(users));
  }, [users]);

  // Sync with Firebase Firestore on mount
  useEffect(() => {
    const initCloudUsers = async () => {
      try {
        const cloudUsers = await fetchUsersFromFirestore();
        if (cloudUsers && cloudUsers.length > 0) {
          setUsers(cloudUsers);
          setIsCloudSynced(true);
        } else {
          // Upload initial mock users to Firestore so Console has real data!
          for (const u of INITIAL_USERS) {
            await saveUserToFirestore(u);
          }
          setIsCloudSynced(true);
        }
      } catch (err) {
        console.warn('Firebase Users sync notice:', err);
      }
    };
    initCloudUsers();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleSelectChange = (newRole: SystemRole) => {
    setRole(newRole);
    // Automatically prefill suggested permissions for this role
    setPermissions(DEFAULT_ROLE_PERMISSIONS[newRole]);
  };

  const handlePermissionToggle = (key: keyof RolePermissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateRandomPassword = () => {
    const randNum = Math.floor(100000 + Math.random() * 900000);
    return `Zebra-${randNum}!`;
  };

  const openAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('+255 7');
    setRole('Waiter');
    setStatus('active');
    setAssignedBranch('Zebra Central Masaki Kitchen');
    setPasswordMode('auto');
    setCustomPassword('');
    setPermissions(DEFAULT_ROLE_PERMISSIONS['Waiter']);
    setShowAddUserModal(true);
  };

  const openEditModal = (u: AdminUserRecord) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
    setStatus(u.status);
    setAssignedBranch(u.assignedBranch || 'Zebra Central Masaki Kitchen');
    setPasswordMode('auto');
    setCustomPassword(u.tempPassword || '');
    setPermissions(
      u.permissions || DEFAULT_ROLE_PERMISSIONS[u.role] || DEFAULT_ROLE_PERMISSIONS['Customer']
    );
    setShowAddUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Tafadhali jaza Jina na Barua Pepe.');
      return;
    }

    const assignedPass =
      passwordMode === 'manual' && customPassword.trim()
        ? customPassword.trim()
        : generateRandomPassword();

    let updatedOrCreatedUser: AdminUserRecord;

    if (editingUser) {
      updatedOrCreatedUser = {
        ...editingUser,
        name,
        email,
        phone,
        role,
        status,
        assignedBranch,
        permissions,
        tempPassword: customPassword.trim() ? customPassword.trim() : editingUser.tempPassword
      };

      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? updatedOrCreatedUser : u))
      );
      showToast(`Mtumiaji ${name} amesasishwa kikamilifu!`);
    } else {
      updatedOrCreatedUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        role,
        status,
        assignedBranch,
        permissions,
        tempPassword: assignedPass,
        ordersCount: 0,
        totalSpent: 0,
        joinedDate: 'Hivi punde',
        avatar:
          role === 'Waiter'
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
            : role === 'Kitchen Manager'
            ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80'
            : role === 'Driver'
            ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };

      setUsers([updatedOrCreatedUser, ...users]);
      showToast(`Akaunti mpya ya ${role} (${name}) imefunguliwa na kuhifadhiwa Firebase!`);
    }

    // Save to Firebase Firestore
    await saveUserToFirestore(updatedOrCreatedUser);

    setShowAddUserModal(false);

    // Open WhatsApp Share Dialog so Admin can instantly send credentials to staff
    setWhatsappShareModal({
      user: updatedOrCreatedUser,
      tempPassword: assignedPass
    });
  };

  const toggleUserStatus = async (id: string, userName: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const nextStatus: 'active' | 'suspended' = target.status === 'active' ? 'suspended' : 'active';
    const updated: AdminUserRecord = { ...target, status: nextStatus };
    setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
    await saveUserToFirestore(updated);
    showToast(`Hali ya ${userName} sasa ni: ${nextStatus.toUpperCase()}`);
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (window.confirm(`Una uhakika unataka kumfuta mfanyakazi/mtumiaji "${userName}" kutoka kwenye mfumo na Firebase?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      await deleteUserFromFirestore(id);
      showToast(`Mtumiaji ${userName} amefutwa kabisa`);
      if (inspectingUser?.id === id) setInspectingUser(null);
    }
  };

  const handleResetPassword = async (userRecord: AdminUserRecord) => {
    const newPass = generateRandomPassword();
    const updated = { ...userRecord, tempPassword: newPass };
    setUsers(prev => prev.map(u => (u.id === userRecord.id ? updated : u)));
    await saveUserToFirestore(updated);
    setWhatsappShareModal({
      user: updated,
      tempPassword: newPass
    });
  };

  const buildWhatsAppMessage = (u: AdminUserRecord, pass: string) => {
    const appUrl = window.location.origin;
    return `Habari ${u.name},

Akaunti yako ya *Zebra Restaurant & Bar* imeundwa kikamilifu kwenye mfumo!

🔐 *Taarifa Zako za Kuingilia (Login Credentials):*
• *Nafasi / Cheo:* ${u.role}
• *Barua Pepe (Email):* ${u.email}
• *Nenosiri (Password):* ${pass}
• *Kituo (Branch):* ${u.assignedBranch || 'Zebra Masaki Main Kitchen'}
• *Kiungo cha Kuingia (Login Link):* ${appUrl}

Tafadhali ingia kwenye mfumo na ubadilishe nenosiri lako kwa usalama. Karibu sana kwenye timu ya Zebra! 🍽️🦓`;
  };

  const sendWhatsApp = (u: AdminUserRecord, pass: string) => {
    const cleanPhone = u.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(buildWhatsAppMessage(u, pass));
    const url = `https://wa.me/${cleanPhone}?text=${msg}`;
    window.open(url, '_blank');
  };

  const rolesList: ('all' | SystemRole)[] = [
    'all',
    'Super Admin',
    'Kitchen Manager',
    'Waiter',
    'Dispatcher',
    'Driver',
    'Customer'
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base sm:text-lg font-bold font-display text-neutral-900 dark:text-white">
              Users, Waiters & Role Permissions
            </h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              {users.length} Users
            </span>
            {isCloudSynced && (
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Database className="w-3 h-3" />
                <span>Firebase Synced</span>
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Ongeza wahudumu (Waiters), wasimamizi wa jikoni, madereva, na tuma nenosiri WhatsApp papo hapo
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add User / Fungua Akaunti</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
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
              {r === 'all' ? 'All Roles' : r === 'Waiter' ? '🍽️ Waiters (Wahudumu)' : r}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tafuta jina, email, simu..."
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
                <th className="py-3 px-4">Mtumiaji (User)</th>
                <th className="py-3 px-4">Mawasiliano</th>
                <th className="py-3 px-4">Nafasi / Cheo</th>
                <th className="py-3 px-4">Ruhusa Maalumu</th>
                <th className="py-3 px-4">Hali ya Akaunti</th>
                <th className="py-3 px-4 text-right">Vitendo (Actions)</th>
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
                          {u.role === 'Waiter' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                              Floor POS
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {u.assignedBranch || 'Central Masaki'} • Joined {u.joinedDate}
                        </p>
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
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'Super Admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : u.role === 'Kitchen Manager'
                          ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                          : u.role === 'Waiter'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : u.role === 'Dispatcher'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : u.role === 'Driver'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {u.role === 'Waiter' && <UtensilsCrossed className="w-3 h-3 text-amber-500" />}
                      <span>{u.role}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {u.permissions?.canTakeOrders && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                          Meza/POS
                        </span>
                      )}
                      {u.permissions?.canViewKitchen && (
                        <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded">
                          Jikoni (KDS)
                        </span>
                      )}
                      {u.permissions?.canManageProducts && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                          Vyakula
                        </span>
                      )}
                      {u.permissions?.canDispatchRiders && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                          Madereva
                        </span>
                      )}
                      {u.permissions?.canManageUsers && (
                        <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">
                          Watumiaji
                        </span>
                      )}
                      {!u.permissions && (
                        <span className="text-[10px] text-neutral-400">Standard Access</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleUserStatus(u.id, u.name)}
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
                      }`}
                      title="Bofya kubadili hali ya akaunti"
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
                      {/* Send Credentials to WhatsApp */}
                      <button
                        onClick={() =>
                          setWhatsappShareModal({
                            user: u,
                            tempPassword: u.tempPassword || generateRandomPassword()
                          })
                        }
                        className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                        title="Tuma Taarifa za Kuingia WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setInspectingUser(u)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Tazama Taarifa Kamili"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Hariri Mtumiaji na Ruhusa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResetPassword(u)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        title="Tengeneza Nenosiri Jipya"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-rose-500/10 text-rose-500"
                        title="Futa Mtumiaji"
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

      {/* MODAL 1: ADD OR EDIT USER WITH ROLE & PERMISSIONS & PASSWORD */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#18181b] rounded-3xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span>
                  {editingUser ? 'Badili Taarifa za Mtumiaji na Ruhusa' : 'Fungua Akaunti ya Mfanyakazi / User'}
                </span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Jina Kamili *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="mfano: Neema Mwamburi"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Barua Pepe (Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="neema@zebradsm.com"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Namba ya Simu (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+255 754 889 123"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
                  />
                  <p className="text-[10px] text-neutral-400 mt-0.5">Itawezesha kutuma taarifa zake WhatsApp moja kwa moja</p>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Tawi Alilopangiwa (Branch)
                  </label>
                  <select
                    value={assignedBranch}
                    onChange={e => setAssignedBranch(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="Zebra Central Masaki Kitchen">Zebra Central Masaki Kitchen</option>
                    <option value="Zebra Oysterbay Pizza & Grill">Zebra Oysterbay Pizza & Grill</option>
                    <option value="Zebra Mikocheni Delivery Hub">Zebra Mikocheni Delivery Hub</option>
                  </select>
                </div>
              </div>

              {/* System Role Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Nafasi / Cheo Kwenye Mfumo (Role) *
                  </label>
                  <select
                    value={role}
                    onChange={e => handleRoleSelectChange(e.target.value as SystemRole)}
                    className="w-full p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/40 text-neutral-900 dark:text-white font-bold outline-none"
                  >
                    <option value="Waiter">🍽️ Waiter (Mhudumu wa Meza)</option>
                    <option value="Kitchen Manager">👨‍🍳 Kitchen Manager (Mpishi Mkuu / Jikoni)</option>
                    <option value="Super Admin">👑 Super Admin (Mwenye Mamlaka Kamili)</option>
                    <option value="Dispatcher">🛵 Dispatcher (Mratibu wa Madereva)</option>
                    <option value="Driver">🚴 Driver / Rider (Mtoa Oda)</option>
                    <option value="Customer">👤 VIP Customer (Mteja)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Hali ya Akaunti (Status)
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="active">Active (Ruhusu Kuingia)</option>
                    <option value="suspended">Suspended (Zuia Kuingia)</option>
                  </select>
                </div>
              </div>

              {/* Password Setting: Auto vs Manual */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-orange-500" />
                    <span>Nenosiri (Password Settings)</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="passwordMode"
                        checked={passwordMode === 'auto'}
                        onChange={() => setPasswordMode('auto')}
                        className="text-orange-600"
                      />
                      <span>Auto-Generate (Kiotomatiki)</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer ml-2">
                      <input
                        type="radio"
                        name="passwordMode"
                        checked={passwordMode === 'manual'}
                        onChange={() => setPasswordMode('manual')}
                        className="text-orange-600"
                      />
                      <span>Weka Yako Mwenyewe</span>
                    </label>
                  </div>
                </div>

                {passwordMode === 'auto' ? (
                  <p className="text-[11px] text-neutral-500 italic">
                    Mfumo utatengeneza nenosiri imara kiotomatiki (mf. Zebra-849201!) na kuliweka tayari kutumwa WhatsApp.
                  </p>
                ) : (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={customPassword}
                      onChange={e => setCustomPassword(e.target.value)}
                      placeholder="Weka nenosiri la mtumiaji (mfano: Zebra@2025)"
                      className="w-full p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Granular Permissions Controls */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                    <span>Chagua Ruhusa za Kazi (Role Permissions)</span>
                  </h4>
                  <span className="text-[10px] text-neutral-400">Admin anaweza kurekebisha</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canTakeOrders}
                      onChange={() => handlePermissionToggle('canTakeOrders')}
                      className="mt-0.5 rounded text-orange-600 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Chukua Oda za Meza (Waiter POS)</p>
                      <p className="text-[10px] text-neutral-400">Anaweza kufungua meza na kuchukua oda za wateja</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canViewKitchen}
                      onChange={() => handlePermissionToggle('canViewKitchen')}
                      className="mt-0.5 rounded text-orange-600 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Tazama Jikoni (KDS Display)</p>
                      <p className="text-[10px] text-neutral-400">Anaona oda zinazopikwa na kubonyeza 'Tayari'</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canManageProducts}
                      onChange={() => handlePermissionToggle('canManageProducts')}
                      className="mt-0.5 rounded text-orange-600 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Simamia Vyakula na Bei</p>
                      <p className="text-[10px] text-neutral-400">Anaweza kuongeza chakula kipya au kubadili bei</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canDispatchRiders}
                      onChange={() => handlePermissionToggle('canDispatchRiders')}
                      className="mt-0.5 rounded text-orange-600 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Panga Oda kwa Madereva</p>
                      <p className="text-[10px] text-neutral-400">Anaweza kuwapa madereva mizigo ya delivery</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canManageUsers}
                      onChange={() => handlePermissionToggle('canManageUsers')}
                      className="mt-0.5 rounded text-orange-600 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Simamia Watumiaji na Roles</p>
                      <p className="text-[10px] text-neutral-400">Kufungua akaunti na kugawa majukumu</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canViewFinancials}
                      onChange={() => handlePermissionToggle('canViewFinancials')}
                      className="mt-0.5 rounded text-orange-600 focus:ring-0"
                    />
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Tazama Mapato na Malipo</p>
                      <p className="text-[10px] text-neutral-400">Mauzo ya jumla, benki na ripoti za kifedha</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Database className="w-4 h-4" />
                  <span>{editingUser ? 'Hifadhi Mabadiliko (Save & Sync)' : 'Fungua Akaunti & Hifadhi Firebase'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs cursor-pointer"
                >
                  Ghairi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WHATSAPP SHARE CREDENTIALS DIALOG */}
      {whatsappShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Tuma Taarifa WhatsApp
                </h3>
              </div>
              <button onClick={() => setWhatsappShareModal(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-2">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                Akaunti ya {whatsappShareModal.user.name} ({whatsappShareModal.user.role}) iko tayari!
              </p>
              <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono space-y-1 select-all">
                <p>👤 <strong>Jina:</strong> {whatsappShareModal.user.name}</p>
                <p>📧 <strong>Email:</strong> {whatsappShareModal.user.email}</p>
                <p>🔑 <strong>Password:</strong> <span className="text-orange-600 dark:text-orange-400 font-bold">{whatsappShareModal.tempPassword}</span></p>
                <p>🍽️ <strong>Cheo:</strong> {whatsappShareModal.user.role}</p>
                <p>📱 <strong>Simu:</strong> {whatsappShareModal.user.phone}</p>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Ujumbe umepangwa wenye maelekezo kamili ya Kiswahili, kiungo cha mfumo, na nenosiri lake la muda.
            </p>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    buildWhatsAppMessage(whatsappShareModal.user, whatsappShareModal.tempPassword)
                  );
                  showToast('Taarifa zote zimenakiliwa (Copied to Clipboard)!');
                }}
                className="px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsApp(whatsappShareModal.user, whatsappShareModal.tempPassword)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Fungua & Tuma WhatsApp ({whatsappShareModal.user.phone})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INSPECT USER PROFILE */}
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
                <span
                  className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inspectingUser.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                  }`}
                >
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
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Tawi (Branch)</p>
                <p className="font-bold text-neutral-900 dark:text-white">{inspectingUser.assignedBranch || 'Central Masaki'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="text-[10px] text-neutral-400 uppercase font-bold">Total Orders</p>
                <p className="font-bold text-base text-neutral-900 dark:text-white">{inspectingUser.ordersCount}</p>
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
                Hariri Taarifa
              </button>
              <button
                onClick={() => {
                  setInspectingUser(null);
                  handleResetPassword(inspectingUser);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Tuma WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
