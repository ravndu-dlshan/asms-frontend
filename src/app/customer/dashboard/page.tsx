'use client';
import React from 'react';
import Navbar from '../components/navbar';
import CustomerDashboardHero from './components/heroSection';
import CusDashboardStat from './components/cusStat';
import ServiceSection from './components/serviceCard';
import FooterSection from '../components/footer';
import ContactSection from './components/contactSection';
import ChatBot from '../components/ChatBot';

const CustomerDashBoard = () => {
    return (
        <>
            <Navbar />
            <CustomerDashboardHero />
            <ServiceSection />
            <CusDashboardStat />
            <ContactSection />
            <FooterSection />
            <ChatBot />
        </>
    );
};

export default CustomerDashBoard;