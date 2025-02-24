// src/components/ContactPage.jsx
import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-black  pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Contact Us</h1>
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="md:w-1/2">
          <form className="bg-white p-6 rounded-lg shadow-md ">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Subject"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                className="w-full border border-gray-300 p-2 rounded"
                rows="4"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
             // onSubmit= {()=>handleSumit()}
             onClick={()=>alert("The message hasn't been sent besause the function hasn't been implemented yet")}
            >
              Send Message
              
            </button>
          </form>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 ">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Contact Information</h2>
            <p className="mb-2"><strong>Address:</strong> Ki tuc xa khu B, Ho Chi Minh, VietNam</p>
            <p className="mb-2"><strong>Phone:</strong> IDK</p>
            <p className="mb-4"><strong>Email:</strong> 22520663@gm.uit.edu.vn</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage