"use client";
import React, { useState } from "react";
import LoginPage from "../login/LoginPage";
import CreateAccountPage from "../createAccount/CreateAccountPage";
import { PageType } from "./auth.interface";

const AuthPage = () => {
  const [authMode, setAuthMode] = useState<PageType>("signin");

  const handlePageChange = (pageType: PageType) => {
    setAuthMode(pageType);
  };

  if (authMode === "signin") {
    return <LoginPage handlePageChange={handlePageChange} />;
  } else {
    return <CreateAccountPage handlePageChange={handlePageChange} />;
  }
};

export default AuthPage;
