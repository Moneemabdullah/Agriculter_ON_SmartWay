import React from 'react';
import { Header } from './Header';
import { Blog } from './Blog';
import { Footer } from './Footer';

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