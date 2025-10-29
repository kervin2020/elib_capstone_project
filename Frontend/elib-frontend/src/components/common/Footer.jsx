import React from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Facebook,
    Twitter,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 w-full">
            <div className="w-full px-6 sm:px-12 lg:px-20 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="h-8 w-8 text-white" />
                            <span className="text-2xl font-bold text-white">E-Lib</span>
                        </div>
                        <p className="text-gray-400 max-w-md mb-6">
                            Your digital library for reading online or loaning physical books.
                            Access thousands of titles from anywhere, anytime.
                        </p>
                        <div className="flex space-x-5">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/books"
                                    className="hover:text-white transition-colors"
                                >
                                    Browse Books
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Contact Info
                        </h3>
                        <div className="space-y-3 text-gray-400">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                                <span>
                                    Rue Panamericaine <br /> Port-au-Prince, Haiti
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <span>+509 3665 3787</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <span>info@elib.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div>© {new Date().getFullYear()} E-Lib. All rights reserved.</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link
                            to="/privacy"
                            className="hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/contact"
                            className="hover:text-white transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
