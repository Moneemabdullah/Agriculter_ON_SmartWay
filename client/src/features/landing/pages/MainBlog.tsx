import React from 'react';
import { Header } from "../components/Header";
import { Blog } from "../components/Blog";
import { Footer } from "../components/Footer";

const MainBlog = () => {
    return (
        <div>
            <Header />
            <Blog />
            <Footer />
        </div>
    );
};

export default MainBlog;