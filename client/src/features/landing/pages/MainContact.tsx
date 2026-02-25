import React from 'react';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import ContactPage from "../components/Contact";

const MainContact = () => {
    return (
        <div>
            <Header />
            <ContactPage />
            <Footer />
        </div>
    );
};

export default MainContact;