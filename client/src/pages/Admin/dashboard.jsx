import React from "react";
// import AdminHeader from "../../components/Admin/Layout/Header";
import AdminSideBar from "../../components/Admin/Layout/Sidebar";
import AdminDashboard from "../../components/Admin/dashboard";
import AdminHeader from "../../components/Admin/Layout/Header";

const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader/>
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={1} />
          </div>
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
