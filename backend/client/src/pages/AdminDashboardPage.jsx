import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Gift, Award, Search, RefreshCw, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { CardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const { showSuccess, showError } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [editAllowance, setEditAllowance] = useState(100);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get(`/admin/users?search=${encodeURIComponent(search)}&department=${selectedDept}&role=${selectedRole}`)
      ]);

      if (dashRes.data.success) setStats(dashRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search, selectedDept, selectedRole]);

  const handleManualReset = async () => {
    if (!window.confirm('Trigger monthly allowance reset for all employees now?')) return;

    setResetting(true);
    try {
      const res = await api.post('/admin/reset-allowance');
      if (res.data.success) {
        showSuccess(res.data.result?.message || 'Monthly allowance reset completed successfully!');
        fetchAdminData();
      }
    } catch (err) {
      showError('Failed to trigger monthly reset');
    } finally {
      setResetting(false);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await api.patch(`/admin/users/${editingUser._id}`, {
        role: editRole,
        givingAllowance: Number(editAllowance)
      });

      if (res.data.success) {
        showSuccess(`Updated ${editingUser.name}`);
        setEditingUser(null);
        fetchAdminData();
      }
    } catch (err) {
      showError('Failed to update employee details');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Platform governance, user management, and automated monthly reset triggers.
          </p>
        </div>

        <button
          onClick={handleManualReset}
          disabled={resetting}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting...' : 'Trigger Allowance Reset'}</span>
        </button>
      </div>

      {loading && !stats ? (
        <CardSkeleton />
      ) : (
        <>
          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Employees"
              value={stats?.totalEmployees || 0}
              subtitle="Registered team members"
              icon={Users}
              color="brand"
            />
            <StatCard
              title="Total Kudos Sent"
              value={stats?.totalKudosSent || 0}
              subtitle="Lifetime appreciations"
              icon={Gift}
              color="emerald"
            />
            <StatCard
              title="Points Distributed"
              value={`${stats?.totalPointsDistributed || 0} pts`}
              subtitle="Total points awarded"
              icon={Award}
              color="amber"
            />
          </div>

          {/* User Management Table Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-base font-bold text-slate-900">Employee Management</h2>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Giving Allowance</th>
                    <th className="px-4 py-3">Earned Points</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">{emp.name}</p>
                            <p className="text-[10px] text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{emp.department}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            emp.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-600 text-xs">{emp.givingAllowance} pts</td>
                      <td className="px-4 py-3 font-semibold text-amber-600 text-xs">{emp.earnedPoints} pts</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingUser(emp);
                            setEditRole(emp.role);
                            setEditAllowance(emp.givingAllowance);
                          }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                          title="Edit employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Edit Employee: {editingUser.name}</h3>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giving Allowance Points</label>
                <input
                  type="number"
                  min={0}
                  value={editAllowance}
                  onChange={(e) => setEditAllowance(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
