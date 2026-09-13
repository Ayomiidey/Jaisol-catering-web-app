'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { createCateringBooking } from '@/app/actions/catering'

import { BookingHeader } from '@/components/booking/BookingHeader'
import { EventTypeSelector } from '@/components/booking/EventTypeSelector'
import { GuestCountSelector } from '@/components/booking/GuestCountSelector'
import { EventDetailsForm } from '@/components/booking/EventDetailsForm'
import { DietarySelector } from '@/components/booking/DietarySelector'
import { BookingNotes } from '@/components/booking/BookingNotes'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { BookingSubmit } from '@/components/booking/BookingSubmit'
import { BookingSuccess } from '@/components/booking/BookingSuccess'

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

interface FormErrors {
  eventType?: string
  guestCount?: string
  date?: string
  time?: string
  location?: string
  phone?: string
}

export function Book() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [submitError, setSubmitError] = useState('')

  const [formData, setFormData] = useState({
    eventType: 'Wedding',
    guestCount: 50,
    date: '',
    time: '',
    location: '',
    phone: '',
    dietaryNeeds: [] as string[],
    notes: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const userName = session?.user?.name || ''
  const userEmail = session?.user?.email || ''

  const combinedDateTime = useMemo(() => {
    if (!formData.date || !formData.time) {
      return ''
    }

    return `${formData.date}T${formData.time}`
  }, [formData.date, formData.time])

  function validate(): boolean {
    const nextErrors: FormErrors = {}

    if (!formData.eventType) {
      nextErrors.eventType = 'Please select an event type.'
    }

    if (
      !Number.isInteger(formData.guestCount) ||
      formData.guestCount < 20 ||
      formData.guestCount > 500
    ) {
      nextErrors.guestCount =
        'Guest count must be between 20 and 500.'
    }

    if (!formData.date) {
      nextErrors.date = 'Please select your event date.'
    }

    if (!formData.time) {
      nextErrors.time = 'Please select your event time.'
    }

    if (
      !formData.location.trim() ||
      formData.location.trim().length < 3
    ) {
      nextErrors.location =
        'Please enter a valid event location.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (formData.phone.trim().length < 7) {
      nextErrors.phone =
        'Please enter a valid phone number.'
    }

    if (formData.date && formData.time) {
      const eventDate = new Date(combinedDateTime)

      if (
        Number.isNaN(eventDate.getTime()) ||
        eventDate.getTime() <= Date.now()
      ) {
        nextErrors.date =
          'Please choose a future date and time.'
      }
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function buildWhatsAppMessage(
    createdBookingId: string
  ) {
    const dietary =
      formData.dietaryNeeds.length > 0
        ? formData.dietaryNeeds.join(', ')
        : 'None specified'

    const message = [
      'Hello Jaisol Catering 👋',
      '',
      'I would like to enquire about catering for an event.',
      '',
      `Booking Reference: ${createdBookingId}`,
      '',
      'EVENT DETAILS',
      `Event: ${formData.eventType}`,
      `Guests: ${formData.guestCount}`,
      `Date: ${formData.date}`,
      `Time: ${formData.time}`,
      `Location: ${formData.location}`,
      '',
      'DIETARY REQUIREMENTS',
      dietary,
      '',
      'ADDITIONAL NOTES',
      formData.notes.trim() || 'None',
      '',
      'CUSTOMER DETAILS',
      `Name: ${userName || 'Not provided'}`,
      `Email: ${userEmail || 'Not provided'}`,
      `Phone: ${formData.phone}`,
      '',
      'I would like to discuss the menu, catering options,',
      'allergies, final requirements and pricing.',
    ].join('\n')

    return message
  }

  async function handleSubmit() {
    setSubmitError('')

    if (status === 'loading') {
      return
    }

    if (!session?.user?.id) {
      router.push(
        `/sign-in?callbackUrl=${encodeURIComponent('/book')}`
      )

      return
    }

    if (!validate()) {
      return
    }

    if (!WHATSAPP_NUMBER) {
      setSubmitError(
        'WhatsApp is not configured. Please contact the administrator.'
      )

      return
    }

    try {
      setIsSubmitting(true)

      const booking = await createCateringBooking({
        eventType: formData.eventType,
        guestCount: formData.guestCount,
        date: combinedDateTime,
        location: formData.location,
        phone: formData.phone,
        dietaryNeeds: formData.dietaryNeeds,
        notes: formData.notes,
      })

      setBookingId(booking.id)

      const message = buildWhatsAppMessage(booking.id)

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(message)}`

      window.open(
        whatsappUrl,
        '_blank',
        'noopener,noreferrer'
      )

      setSubmitted(true)
    } catch (error) {
      console.error(error)

      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <BookingSuccess bookingId={bookingId} />
  }

  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <BookingHeader />

        {submitError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <p className="font-semibold text-destructive">
                We couldn&apos;t submit your request
              </p>

              <p className="mt-1 text-foreground/80">
                {submitError}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <EventTypeSelector
              value={formData.eventType}
              onChange={(value) => {
                setFormData((current) => ({
                  ...current,
                  eventType: value,
                }))

                setErrors((current) => ({
                  ...current,
                  eventType: undefined,
                }))
              }}
              error={errors.eventType}
            />

            <GuestCountSelector
              value={formData.guestCount}
              onChange={(value) => {
                setFormData((current) => ({
                  ...current,
                  guestCount: value,
                }))

                setErrors((current) => ({
                  ...current,
                  guestCount: undefined,
                }))
              }}
              error={errors.guestCount}
            />

            <EventDetailsForm
              date={formData.date}
              time={formData.time}
              location={formData.location}
              onDateChange={(value) => {
                setFormData((current) => ({
                  ...current,
                  date: value,
                }))

                setErrors((current) => ({
                  ...current,
                  date: undefined,
                }))
              }}
              onTimeChange={(value) => {
                setFormData((current) => ({
                  ...current,
                  time: value,
                }))

                setErrors((current) => ({
                  ...current,
                  time: undefined,
                }))
              }}
              onLocationChange={(value) => {
                setFormData((current) => ({
                  ...current,
                  location: value,
                }))

                setErrors((current) => ({
                  ...current,
                  location: undefined,
                }))
              }}
              errors={{
                date: errors.date,
                location: errors.location,
              }}
            />

            <DietarySelector
              value={formData.dietaryNeeds}
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  dietaryNeeds: value,
                }))
              }
            />

            <BookingNotes
              value={formData.notes}
              onChange={(value) =>
                setFormData((current) => ({
                  ...current,
                  notes: value,
                }))
              }
            />

            <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Contact details
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  How can we reach you?
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your account details are already filled in.
                  Please provide your phone number so we can
                  continue the conversation on WhatsApp.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>

                  <Input
                    value={userName}
                    disabled
                    className="bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>

                  <Input
                    value={userEmail}
                    disabled
                    className="bg-secondary"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="booking-phone">
                    Phone number{' '}
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="booking-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => {
                      setFormData((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))

                      setErrors((current) => ({
                        ...current,
                        phone: undefined,
                      }))
                    }}
                    placeholder="+44 7XXX XXXXXX"
                  />

                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="lg:hidden">
              <BookingSummary
                eventType={formData.eventType}
                guestCount={formData.guestCount}
                date={formData.date}
                time={formData.time}
                location={formData.location}
                dietaryNeeds={formData.dietaryNeeds}
              />
            </div>

            <div className="hidden lg:block">
              <BookingSubmit
                isSubmitting={isSubmitting}
                onClick={handleSubmit}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <BookingSummary
              eventType={formData.eventType}
              guestCount={formData.guestCount}
              date={formData.date}
              time={formData.time}
              location={formData.location}
              dietaryNeeds={formData.dietaryNeeds}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl">
          <BookingSubmit
            isSubmitting={isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </main>
  )
}