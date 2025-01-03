'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    date: '',
    time: '',
    guests: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("here")
    if (formData.date) {
      fetch(`http://localhost:8080/api/bookings?date=${formData.date}`)
        .then((res) => res.json())
        .then((data) => setAvailableSlots(data.availableSlots));
    }
  }, [formData.date]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name) errors.name = 'Name is required';
    if (!/^[0-9]{10}$/.test(formData.contact)) errors.contact = 'Contact must be a 10-digit number';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Select a valid time slot';
    if (!formData.guests || parseInt(formData.guests) <= 0) errors.guests = 'Guests must be a positive number';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSlotClick = (slot) => {
    setFormData({ ...formData, time: slot });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.success) {
      setBookingSummary(data.booking);
      setFormData({ name: '', contact: '', date: '', time: '', guests: '' });
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Restaurant Table Booking</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <div
                  key={slot}
                  onClick={() => handleTimeSlotClick(slot)}
                  className={`p-2 border rounded text-center cursor-pointer ${
                    formData.time === slot ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {slot}
                </div>
              ))}
            </div>
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Guests</label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${errors.guests ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.guests && <p className="text-red-500 text-sm">{errors.guests}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Book Now
          </button>
        </form>

        {bookingSummary && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <h3 className="text-lg font-bold">Booking Summary</h3>
            <p>Name: {bookingSummary.name}</p>
            <p>Contact: {bookingSummary.contact}</p>
            <p>Date: {bookingSummary.date}</p>
            <p>Time: {bookingSummary.time}</p>
            <p>Guests: {bookingSummary.guests}</p>
          </div>
        )}
      </div>
    </div>
  );
}