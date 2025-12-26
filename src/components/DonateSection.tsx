"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Heart, Loader2 } from "lucide-react";

const presetAmounts = [5, 10, 25, 50, 100];

export function DonateSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (customAmount) {
      return parseFloat(customAmount);
    }
    return selectedAmount || 0;
  };

  const handleDonate = async () => {
    const amount = getFinalAmount();

    if (amount < 1) {
      setError("Minimum donatie is €1");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toString(),
          name,
          email,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || "Er is een fout opgetreden");
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het verwerken van uw donatie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="doneren" className="bg-gradient-to-b from-gold/10 to-white section-padding">
      <div ref={ref} className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="badge mb-6 inline-block"
            >
              Steun ons
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="heading-section mb-6"
            >
              Verlicht Ramadan
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-body"
            >
              Elke bijdrage helpt om de straten van Gent te verlichten tijdens de Ramadan.
            </motion.p>
          </div>

          {/* Donation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="card"
          >
            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3">
                Kies een bedrag
              </label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 px-2 rounded-xl font-semibold transition-all ${
                      selectedAmount === amount
                        ? "bg-teal text-white"
                        : "bg-soft text-text-primary hover:bg-teal/10"
                    }`}
                  >
                    €{amount}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">€</span>
                <input
                  type="number"
                  placeholder="Ander bedrag"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  min="1"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Optional fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Naam <span className="text-text-muted">(optioneel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Uw naam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  E-mail <span className="text-text-muted">(optioneel)</span>
                </label>
                <input
                  type="email"
                  placeholder="Uw e-mailadres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Donate button */}
            <button
              onClick={handleDonate}
              disabled={isLoading || getFinalAmount() < 1}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Bezig met verwerken...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  #LightUpRamadan - €{getFinalAmount() || 0}
                </>
              )}
            </button>

            <p className="text-center text-text-muted text-xs mt-4">
              Veilig betalen via Mollie. U wordt doorgestuurd naar een beveiligde betaalpagina.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
