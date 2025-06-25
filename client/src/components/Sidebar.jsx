import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#0F172A] text-white min-h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="space-y-2">
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/users">User Management</Link></li>
        <li><Link to="/admin/courses">Course Management</Link></li>
        <li><Link to="/admin/institutions">Institution Management</Link></li>
      </ul>
    </div>
  );
}
