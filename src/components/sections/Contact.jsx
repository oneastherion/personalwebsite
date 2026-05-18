import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import GlowButton from '../ui/GlowButton'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const mailtoLink = `mailto:your.email@example.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`
    window.location.href = mailtoLink
  }

  return (
    <section id="contact" className="relative py-32 md:py-40 px-6">
      <div className="max-w-2xl mx-auto">
        <SectionLabel numeral="VI" title="Send a Raven" accentColor="#7c4dff" />

        <motion.p
          className="font-inter text-sm md:text-base opacity-60 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          For collaborations, inquiries, or aligned ventures.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              name="name"
              label="Name"
              value={form.name}
              onChange={handleChange}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <InputField
            name="subject"
            label="Subject"
            value={form.subject}
            onChange={handleChange}
          />
          <div>
            <label className="block font-mono text-xs tracking-wider uppercase text-white/40 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
              className="w-full bg-transparent border border-white/10 px-4 py-3 font-inter text-sm text-white/90 focus:border-space-accent/50 focus:outline-none transition-colors duration-300 resize-none"
              style={{ boxShadow: 'none' }}
            />
          </div>
          <div className="pt-4">
            <GlowButton color="#7c4dff" className="w-full md:w-auto">
              Dispatch &rarr;
            </GlowButton>
          </div>
        </motion.form>

        {/* Social links */}
        <motion.div
          className="mt-16 flex justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-wider text-white/30 hover:text-space-accent transition-colors duration-300">
            LinkedIn
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-wider text-white/30 hover:text-space-accent transition-colors duration-300">
            GitHub
          </a>
          <a href="mailto:your.email@example.com" className="font-mono text-xs tracking-wider text-white/30 hover:text-space-accent transition-colors duration-300">
            Email
          </a>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-24 text-center border-t border-white/5 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-inter text-xs text-white/20">
            &copy; 2026 Juan Gonzalez Flores
          </p>
          <p className="font-inter text-xs text-white/10 mt-1">
            Built with discipline. Designed with vision.
          </p>
        </motion.footer>
      </div>
    </section>
  )
}

function InputField({ name, label, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block font-mono text-xs tracking-wider uppercase text-white/40 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-transparent border border-white/10 px-4 py-3 font-inter text-sm text-white/90 focus:border-space-accent/50 focus:outline-none transition-colors duration-300"
      />
    </div>
  )
}
