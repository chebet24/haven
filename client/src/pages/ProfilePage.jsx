import React, { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/style";

import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import CircularProgress from "@mui/material/CircularProgress";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(1);

  // Simulate loading delay with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <CircularProgress/>
      ) : (
        <>
          <Header />
          <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
            <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
              <ProfileSideBar active={active} setActive={setActive} />
            </div>
            <ProfileContent active={active} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
