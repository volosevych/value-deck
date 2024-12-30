import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray py-10 color-white'>
        <div className='container flex justify-between align-center'>
            {/* Quick Links */}
            <div>
                <h4 className='pb-2 text-lg'>Quick Links</h4>
                <ul>
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/featured" className="hover:underline">Featured Cards</a></li>
                    <li><a href="/pricing-trends" className="hover:underline">Pricing Trends</a></li>
                    <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                </ul>
            </div>

            {/* Contact Info */}
            <div>
                <h4 className="mb-2">Contact</h4>
                <p>Email: <a href="mailto:support@cardlookup.com" className="hover:underline">support@cardlookup.com</a></p>
                <p>Phone: (123) 456-7890</p>
            </div>

            {/* Branding */}
            <div className="text-center flex flex-col">
                <img src="/nav/logo.svg" alt="Card Lookup Logo" className="h-24 float-end" />
                <p className="mt-2 text-1xl">
                    Discover trading card values and trends with ease.
                </p>
            </div>
        </div>
    </footer>
  )
}

export default Footer
