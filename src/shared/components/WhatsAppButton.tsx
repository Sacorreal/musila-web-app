'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export const WhatsAppButton = () => {
  const phoneNumber = '573170604002'
  const message = encodeURIComponent('Hola, me gustaría recibir más información sobre Músila.')
  // Usamos api.whatsapp.com para poder incluir el parámetro de lenguaje (lang=es)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}&lang=es`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] transition-colors duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40" />
      
      <MessageCircle className="w-8 h-8 fill-current" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 px-4 py-2 bg-white text-gray-800 text-sm font-bold rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
        ¿Necesitas ayuda?
      </div>
    </motion.a>
  )
}
