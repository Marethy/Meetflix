import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import facebookLogo from "../../assets/icons/facebook-logo.png";
import instagramLogo from "../../assets/icons/instagram-logo.png";
import footerBackground from "../../assets/images/footer-bg.jpg"; // Import ảnh nền
import UserProfileButton from "../../components/UserProfileButton"; // Import UserProfileButton
import { HomeOutlined } from '@ant-design/icons'; 

const Footer = () => {
    const { xs } = Grid.useBreakpoint(); // Kiểm tra kích thước màn hình mobile
    const navigate = useNavigate();

    return (
        <footer
            className="relative bg-gray-800 text-white py-40 mt-20"
            style={{
                backgroundImage: `url(${footerBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
             <div className="hidden md:block container mx-auto text-center">
                <div className="mb-4">
                    <p className="mb-2">&copy; {new Date().getFullYear()} Movie Trailer Web.</p>
                    <ul className="list-none flex justify-center gap-4 mb-4">
                        <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>
                <div className="flex justify-center gap-4 mb-4">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <img src={facebookLogo} alt="Facebook Logo" className="w-8 h-8" />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <img src={instagramLogo} alt="Instagram Logo" className="w-8 h-8" />
                    </a>
                </div>

                {/* Hiển thị các nút chỉ trên mobile */}
               
            </div>
            {xs && (
                    <div className="flex justify-around items-center mt-4 ">
                        <Button
                            type="link"
                            icon={<HomeOutlined />} // Thêm icon HomeOutlined
                            onClick={() => navigate('/')}
                            className="text-white"
                        >
                            Home
                        </Button>
                        <UserProfileButton />
                    </div>
                )}
        </footer>
    );
};

Footer.propTypes = {
    setSearchData: PropTypes.func,
};

export default Footer;
