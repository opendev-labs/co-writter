
import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UserType } from '../types';
import UserDashboardContent from '../components/Dashboard/UserDashboardContent';
import { SellerDashboardContent } from '../components/Dashboard/SellerDashboardContent';
import * as ReactRouterDOM from 'react-router-dom';

const { useNavigate } = ReactRouterDOM as any;

const DashboardPage: React.FC = () => {
  const { currentUser, userType } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
      if (userType === UserType.GUEST || !currentUser) {
          navigate('/login');
      }
  }, [userType, currentUser, navigate]);

  if (userType === UserType.GUEST || !currentUser) {
    return null;
  }

  return (
    <>
      {/* 
        Layout is now handled entirely by the child components 
        to ensure perfect 100vh fit without scroll conflicts.
      */}
      {userType === UserType.USER ? <UserDashboardContent /> : <SellerDashboardContent />}
    </>
  );
};

export default DashboardPage;
