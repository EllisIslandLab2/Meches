'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface CustomOrderFormData {
  name: string;
  email: string;
  phone: string;
  itemDescription: string;
  colorPreference: string;
  sizePreference: string;
  quantityNeeded: string;
  budgetRange: string;
  timelineNeeded: string;
  additionalRequests: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [customOrderData, setCustomOrderData] = useState<CustomOrderFormData>({
    name: '',
    email: '',
    phone: '',
    itemDescription: '',
    colorPreference: '',
    sizePreference: '',
    quantityNeeded: '1',
    budgetRange: '',
    timelineNeeded: '',
    additionalRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const submitToAirtable = async (formType: string, fields: any) => {
    const response = await fetch('/api/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        formType,
        data: { fields }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit form');
    }

    return response.json();
  };

  const handleGeneralContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitToAirtable('general-contact-form', {
        Name: formData.name,
        Email: formData.email,
        Subject: 'General Inquiry',
        Message: formData.message,
        Type: 'general',
        Timestamp: new Date().toISOString()
      });

      setFormData({ name: '', email: '', message: '' });
      showMessage('success', 'Thank you for your message! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting general contact form:', error);
      showMessage('error', 'There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitToAirtable('custom-order-form', {
        Name: customOrderData.name,
        Email: customOrderData.email,
        Phone: customOrderData.phone,
        'Product Type': customOrderData.itemDescription, // Maps to Product Type field
        Colors: customOrderData.colorPreference,
        Size: customOrderData.sizePreference,
        Quantity: parseInt(customOrderData.quantityNeeded),
        Budget: customOrderData.budgetRange,
        Deadline: customOrderData.timelineNeeded,
        Description: customOrderData.itemDescription,
        Inspiration: customOrderData.additionalRequests,
        Type: 'custom-order',
        Timestamp: new Date().toISOString()
      });

      setCustomOrderData({
        name: '',
        email: '',
        phone: '',
        itemDescription: '',
        colorPreference: '',
        sizePreference: '',
        quantityNeeded: '1',
        budgetRange: '',
        timelineNeeded: '',
        additionalRequests: ''
      });

      showMessage('success', 'Thank you for your custom order request! We will contact you within 24 hours to discuss your project.');
    } catch (error) {
      console.error('Error submitting custom order form:', error);
      showMessage('error', 'There was an error submitting your custom order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Message Display */}
      {message && (
        <div className={`fixed top-24 right-5 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
          message.type === 'success' ? 'bg-stone-700' : 'bg-stone-700'
        } text-white`}>
          {message.text}
        </div>
      )}

      {/* Header Section with Heart-Shaped Wood Background */}
      <section
        className="relative py-20 px-4 min-h-[400px] flex items-center"
        style={{
          backgroundImage: 'url(/Meches Wood Heart-Shaped Shavings on a Desk.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Very soft overlay with warm tones */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-stone-50/25 to-stone-50/35"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-stone-200/70">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-900 mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl text-stone-700 max-w-3xl mx-auto leading-relaxed">
              We&apos;d love to hear from you! Whether you have questions about our existing products,
              want to place a custom order, or just want to say hello, we&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="h-12 bg-gradient-to-b from-transparent via-stone-100 to-stone-50"></div>

      {/* Contact Form Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-lg border-2 border-amber-700">
              <h2 className="text-xl font-semibold text-amber-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">Email</h4>
                  <p className="text-gray-600">meche@handmadecrafts.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">Phone</h4>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">Response Time</h4>
                  <p className="text-gray-600">Usually within 24 hours</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-amber-700 mb-3">Custom Order Options</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">✓</span>
                    <span className="text-gray-600">Custom color combinations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">✓</span>
                    <span className="text-gray-600">Personalized sizing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">✓</span>
                    <span className="text-gray-600">Bulk orders for events</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">✓</span>
                    <span className="text-gray-600">Special occasion pieces</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Forms */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* General Contact Form */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-lg border-2 border-amber-700">
                <h3 className="text-xl font-semibold text-amber-800 mb-6">General Inquiry</h3>
                <form onSubmit={handleGeneralContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Custom Order Form */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 shadow-lg border-2 border-amber-700">
                <h3 className="text-xl font-semibold text-amber-800 mb-6">Custom Order Request</h3>
                <form onSubmit={handleCustomOrderSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={customOrderData.name}
                        onChange={(e) => setCustomOrderData({...customOrderData, name: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={customOrderData.email}
                        onChange={(e) => setCustomOrderData({...customOrderData, email: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={customOrderData.phone}
                      onChange={(e) => setCustomOrderData({...customOrderData, phone: e.target.value})}
                      className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Item Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what you'd like us to create..."
                      value={customOrderData.itemDescription}
                      onChange={(e) => setCustomOrderData({...customOrderData, itemDescription: e.target.value})}
                      className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Color Preference</label>
                      <input
                        type="text"
                        value={customOrderData.colorPreference}
                        onChange={(e) => setCustomOrderData({...customOrderData, colorPreference: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Size Preference</label>
                      <input
                        type="text"
                        value={customOrderData.sizePreference}
                        onChange={(e) => setCustomOrderData({...customOrderData, sizePreference: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity Needed</label>
                      <select
                        value={customOrderData.quantityNeeded}
                        onChange={(e) => setCustomOrderData({...customOrderData, quantityNeeded: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        {[1,2,3,4,5,10,15,20,25,30,50].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <select
                        value={customOrderData.budgetRange}
                        onChange={(e) => setCustomOrderData({...customOrderData, budgetRange: e.target.value})}
                        className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="">Select budget range</option>
                        <option value="Under $25">Under $25</option>
                        <option value="$25-$50">$25-$50</option>
                        <option value="$50-$100">$50-$100</option>
                        <option value="$100-$200">$100-$200</option>
                        <option value="Over $200">Over $200</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timeline Needed</label>
                    <select
                      value={customOrderData.timelineNeeded}
                      onChange={(e) => setCustomOrderData({...customOrderData, timelineNeeded: e.target.value})}
                      className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="1 week">Within 1 week</option>
                      <option value="2 weeks">Within 2 weeks</option>
                      <option value="1 month">Within 1 month</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Requests</label>
                    <textarea
                      rows={3}
                      placeholder="Any additional details or special requests..."
                      value={customOrderData.additionalRequests}
                      onChange={(e) => setCustomOrderData({...customOrderData, additionalRequests: e.target.value})}
                      className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Custom Order Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}