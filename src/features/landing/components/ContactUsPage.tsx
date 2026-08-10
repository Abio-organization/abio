import { motion, type Variants } from 'framer-motion'
import { Globe, Heart, Mail, MessageCircle, Send, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'

import { Footer } from './Footer'
import { NavBar } from './NavBar'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, when: 'beforeChildren', staggerChildren: 0.1, ease: [0.25, 0.1, 0.25, 1] } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const buttonVariants: Variants = {
  hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeInOut' } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
}

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20, duration: 0.5 } },
}

const featureCardVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }),
  hover: { y: -4, transition: { duration: 0.2, ease: 'easeInOut' } },
}

const features = [
  { icon: MessageCircle, title: 'Quick Support', desc: 'Average response time under 2 hours' },
  { icon: Users, title: 'Community', desc: 'Join 10,000+ creators worldwide' },
  { icon: Globe, title: 'Global Reach', desc: 'Available in 50+ countries' },
  { icon: Heart, title: 'Made with Love', desc: 'Dedicated support team' },
]

export function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulated submit — no contact-form endpoint exists yet.
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Message sent successfully!', {
      description: "We'll get back to you within 24 hours.",
    })

    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
  }

  return (
    <motion.section initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen overflow-x-hidden bg-[#FEF4EA]">
      <NavBar />

      <main className="flex flex-col items-center justify-center px-5 pt-32 pb-20">
        {/* Hero */}
        <motion.div variants={itemVariants} className="mb-16 max-w-3xl text-center">
          <motion.div variants={iconVariants} className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center bg-[#FED45C] shadow-md">
              <Mail className="h-8 w-8 text-[#331400]" />
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="mb-4 text-4xl font-bold tracking-tight text-[#331400] md:text-5xl lg:text-6xl">
            Let's Talk
          </motion.h1>

          <motion.div variants={itemVariants} className="mx-auto mb-6 h-0.5 w-20 bg-[#FED45C]" />

          <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Whether you're curious about features, need support, or want to share feedback — we're here to help. Drop us a message and we'll respond within 24 hours.
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants} className="mb-16 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={featureCardVariants}
              whileHover="hover"
              className="border border-[#E0D5C8] bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <motion.div whileHover={{ scale: 1.05, rotate: 5 }} transition={{ duration: 0.2 }} className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-[#FED45C]/10">
                <feature.icon className="h-6 w-6 text-[#331400]" />
              </motion.div>
              <h3 className="mb-2 font-semibold text-[#331400]">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={cardVariants} className="w-full max-w-2xl border border-[#E0D5C8] bg-white p-8 shadow-lg md:p-12">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-[#331400]">Send a Message</h2>
            <p className="text-sm text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleContactSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12 rounded-none border-2 border-[#E0D5C8] px-4 text-base transition-all duration-200 focus:border-[#331400] focus:ring-0"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 rounded-none border-2 border-[#E0D5C8] px-4 text-base transition-all duration-200 focus:border-[#331400] focus:ring-0"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                required
                className="resize-none rounded-none border-2 border-[#E0D5C8] px-4 py-3 text-base transition-all duration-200 focus:border-[#331400] focus:ring-0"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button type="submit" disabled={isSubmitting} className="group h-12 w-full rounded-none bg-[#FED45C] font-semibold text-[#331400] transition-all duration-300 hover:bg-[#FECB33]">
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-5 w-5 rounded-full border-2 border-[#331400] border-t-transparent"
                    />
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Trust indicators */}
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4 text-[#FED45C]" />
            <span>Trusted by 10,000+ creators</span>
            <Sparkles className="h-4 w-4 text-[#FED45C]" />
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </motion.section>
  )
}
