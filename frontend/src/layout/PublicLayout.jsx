import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const { token, userRole, logoutUser } = useAuth();
  
  function handleLogout() {
    logoutUser();
    navigate("/");
  };

  return (
    <>
      <div className="flex item-center justify-between p-4 z-[100] w-full absolute">
        <Link to="/">
            <h1 className="text-emerald-600 text-4xl font-bold cursor-pointer">
            MOVIEVAULT
          </h1>
        </Link>
        <div><Link to="/movies">
          <button className="text-[#FFFDE3] pr-6">Movies</button>
        </Link>
          {token ? (
            <>

              <Link to="/favourites">
                <button className="text-[#F8FAFC] pr-6">My List</button>
              </Link>
              <Link to="/profile">
                <button className="text-[#F8FAFC] pr-6">Account</button>
              </Link>
              {userRole == 'admin' &&
                <Link to="/admin">
                  <button className="text-[#FFFDE3] pr-6">Admin Panel</button>
                </Link>
              }
              <button
                onClick={handleLogout}
                className="text-[#F8FAFC] px-6 py-2 rounded cursor-pointer bg-emerald-600 "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="text-[#F8FAFC] pr-4">Login</button>
              </Link>
              <Link to="/register">
                <button className="text-[#F8FAFC] px-6 py-2 rounded cursor-pointer bg-emerald-600 ">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {children}
    </>
  );
};

export default PublicLayout;
