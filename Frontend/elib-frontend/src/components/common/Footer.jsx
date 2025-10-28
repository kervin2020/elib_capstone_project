import React from 'react';

import {
    Link
}
    from 'react-router-dom';

import {
    BookOpen, Facebook, Twitter, Linkedin, Mail, Phone, MapPin
}
    from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary-900 text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {

                        /* Logo and Description */

                    }
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4"> <BookOpen className="h-8 w-8 text-black" /> <span className="text-2xl font-bold">E-Lib</span> </div> <p className="text-gray-800 mb-6 max-w-md"> Your digital library for reading online or loaning physical books. Access thousands of books from anywhere, anytime. </p> <div className="flex space-x-4"> <a href="#" className="text-gray-8
                        00 hover:text-gray-800 transition-colors" aria-label="Facebook" > <Facebook className="h-6 w-6" /> </a> <a href="#" className="text-gray-800 hover:text-black transition-colors" aria-label="Twitter" > <Twitter className="h-6 w-6" /> </a> <a href="#" className="text-gray-800 hover:text-black transition-colors" aria-label="LinkedIn" > <Linkedin className="h-6 w-6" /> </a> </div> </div> {

                        /* Quick Links */

                    }
                    <div> <h3 className="text-lg font-semibold mb-4">Quick Links</h3> <ul className="space-y-2"> <li> <Link to="/" className="text-gray-800 hover:text-black transition-colors" > Home </Link> </li> <li> <Link to="/books" className="text-gray-800 hover:text-black transition-colors" > Browse Books </Link> </li> <li> <Link to="/about" className="text-gray-800 hover:text-black transition-colors" > About Us </Link> </li> <li> <Link to="/contact" className="text-gray-8
                    00 hover:text-black transition-colors" > Contact </Link> </li> </ul> </div> {

                        /* Contact Info */

                    }
                    <div> <h3 className="text-lg font-semibold mb-4">Contact Info</h3> <div className="space-y-3"> <div className="flex items-center space-x-3"> <MapPin className="h-5 w-5 text-gray-800" /> <span className="text-gray-800"> 123 Library Street<br /> Book City, BC 12345 </span> </div> <div className="flex items-center space-x-3"> <Phone className="h-5 w-5 text-gray-800" /> <span className="text-gray-800">+1 (555)
                        123-4567</span> </div> <div className="flex items-center space-x-3"> <Mail className="h-5 w-5 text-gray-800" /> <span className="text-gray-800">info@elib.com</span> </div> </div> </div> </div> {

                    /* Bottom Section */

                }
                <div className="border-t border-gray-700 mt-8 pt-8"> <div className="flex flex-col md:flex-row justify-between items-center"> <div className="text-gray-8
                00 text-sm"> © 2024 E-Lib. All rights reserved. </div> <div className="flex space-x-6 mt-4 md:mt-0"> <Link to="/privacy" className="text-gray-800 hover:text-white text-sm transition-colors" > Privacy Policy </Link> <Link to="/terms" className="text-gray-800 hover:text-black text-sm transition-colors" > Terms of Service </Link> <Link to="/contact" className="text-gray-800 hover:text-black text-sm transition-colors" > Contact Us </Link> </div> </div> </div> </div> </footer>)
        ;

}
    ;

export default Footer;
