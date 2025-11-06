'use client';
import React from 'react';
import CustomerDashboardHero from './components/heroSection';
import CusDashboardStat from './components/cusStat';
import ServiceSection from './components/serviceCard';
import ContactSection from './components/contactSection';
import ChatBot from '../components/ChatBot';

const CustomerDashBoard = () => {
    return (
        <>
            <CustomerDashboardHero />
            <ServiceSection />
            <CusDashboardStat />
            <ContactSection />
        </>
    );
};

export default CustomerDashBoard;