'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate', 'Naming', 'Other']
const DIETARY_OPTIONS = ['Halal', 'Vegan', 'Gluten-free']

export function Book() {
  const [formData, setFormData] = useState({
    eventType: 'Wedding',
    guestCount: 50,
    date: '',
    location: '',
    dietaryNeeds: [] as string[],
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.date || formData.date.trim().length === 0) {
      newErrors.date = 'Event date is required'
    }

    if (!formData.location || formData.location.trim().length === 0) {
      newErrors.location = 'Location is required'
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Please enter a valid location'
    }

    if (formData.guestCount < 20) {
      newErrors.guests = 'Minimum 20 guests required'
    } else if (formData.guestCount > 500) {
      newErrors.guests = 'Maximum 500 guests allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Send to WhatsApp
    const message = `
🎉 *New Catering Booking Request*

*Event Type:* ${formData.eventType}
*Guest Count:* ${formData.guestCount} guests
*Date:* ${formData.date}
*Location:* ${formData.location}
*Estimated Cost:* £${(formData.guestCount * 15).toFixed(2)}
*Dietary Needs:* ${formData.dietaryNeeds.length > 0 ? formData.dietaryNeeds.join(', ') : 'None'}
*Additional Notes:* ${formData.notes || 'None'}

Please confirm availability and send full quote.
    `.trim()

    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        eventType: 'Wedding',
        guestCount: 50,
        date: '',
        location: '',
        dietaryNeeds: [],
        notes: '',
      })
    }, 2000)
  }

  const toggleDietary = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryNeeds: prev.dietaryNeeds.includes(option)
        ? prev.dietaryNeeds.filter((d) => d !== option)
        : [...prev.dietaryNeeds, option],
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold">Booking Request Sent!</h2>
          <p className="text-muted-foreground">We&apos;ll review your request and get back to you within 24 hours.</p>
          <Link href="/">
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-secondary rounded-lg transition -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Book Catering</h1>
            <p className="text-xs text-muted-foreground">Available across the UK</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Event Type */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Event Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, eventType: type }))}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  formData.eventType === type
                    ? 'bg-orange-500 text-white'
                    : 'bg-secondary border border-border hover:border-orange-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Guest Count */}
        <div className="space-y-2">
          <Label htmlFor="guests">Number of Guests (20-500)</Label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              id="guests"
              min="20"
              max="500"
              value={formData.guestCount}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, guestCount: parseInt(e.target.value) }))
                if (errors.guests) setErrors({ ...errors, guests: '' })
              }}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <span className="text-lg font-bold text-orange-500 w-16 text-right">
              {formData.guestCount}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Estimated cost: £{(formData.guestCount * 15).toFixed(2)}
          </p>
          {errors.guests && <p className="text-red-400 text-sm">{errors.guests}</p>}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Event Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, date: e.target.value }))
              if (errors.date) setErrors({ ...errors, date: '' })
            }}
            className={`bg-secondary border-border ${errors.date ? 'border-red-500 border-2' : ''}`}
          />
          {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location / Venue *</Label>
          <Input
            id="location"
            type="text"
            placeholder="Manchester, London, Birmingham, etc."
            value={formData.location}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, location: e.target.value }))
              if (errors.location) setErrors({ ...errors, location: '' })
            }}
            className={`bg-secondary border-border ${errors.location ? 'border-red-500 border-2' : ''}`}
          />
          {errors.location && <p className="text-red-400 text-sm">{errors.location}</p>}
        </div>

        {/* Dietary Requirements */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Dietary Requirements</Label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleDietary(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  formData.dietaryNeeds.includes(option)
                    ? 'bg-orange-500 text-white'
                    : 'bg-secondary border border-border hover:border-orange-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Information (Optional)</Label>
          <textarea
            id="notes"
            placeholder="Tell us about your vision, menu preferences, or any special requests..."
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-background border-t border-border">
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6"
          >
            Book Catering
          </Button>
        </div>
      </form>

      <div className="h-20" />
    </div>
  )
}
