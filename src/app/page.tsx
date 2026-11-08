'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Method } from '@/components/Method';
import { About } from '@/components/About';
import { Testimonials } from '@/components/Testimonials';
import { VideoSection } from '@/components/VideoSection';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-transparent text-slate-900">
      {/* Sticky Header com seleção de idioma e autenticação */}
      <Header onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Hero Section com CTA Gigante */}
      <Hero onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Seção Método de Ensino (3 cards brancos) */}
      <Method />

      {/* Seção Sobre o Professor (2 colunas) */}
      <About onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Seção Depoimentos com bandeiras por ISO */}
      <Testimonials />

      {/* Degustação de Vídeos exclusivos */}
      <VideoSection />

      {/* Rodapé institucional com CTA */}
      <Footer onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Modal Wizard de Agendamento em 3 Passos */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tipoAula="experimental"
      />
    </main>
  );
}
