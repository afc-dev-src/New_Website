import { useEffect, useState } from 'react'

const moneyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const MIN_LOAN_AMOUNT = 100000
const MAX_LOAN_AMOUNT = 50000000
const MIN_TERM_MONTHS = 1
const MAX_TERM_MONTHS = 150

const formatMoney = (value) => {
  return moneyFormatter.format(Number(value) || 0)
}

const computeMonthlyPayment = (principal, months, monthlyRate) => {
  if (principal <= 0 || months <= 0 || monthlyRate < 0) return 0
  if (monthlyRate === 0) return principal / months

  const factor = (1 + monthlyRate) ** months
  return (principal * monthlyRate * factor) / (factor - 1)
}

export default function Calculator() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [monthlyRatePercent, setMonthlyRatePercent] = useState(0.5)
  const [termMonths, setTermMonths] = useState(60)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const boundedLoanAmount = Math.min(Math.max(Number(loanAmount) || 0, MIN_LOAN_AMOUNT), MAX_LOAN_AMOUNT)
    const totalMonths = Math.min(Math.max(parseInt(termMonths || 0, 10), MIN_TERM_MONTHS), MAX_TERM_MONTHS)
    const monthlyRate = Number(monthlyRatePercent) / 100

    if (boundedLoanAmount <= 0 || monthlyRate < 0 || totalMonths <= 0) {
      setResult(null)
      return
    }

    const monthlyPayment = computeMonthlyPayment(boundedLoanAmount, totalMonths, monthlyRate)
    const totalRepayment = monthlyPayment * totalMonths

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
    })
  }, [loanAmount, monthlyRatePercent, termMonths])

  return (
    <div>
      <section className="relative overflow-hidden py-12 md:py-16 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(130deg,#0d143d_0%,#1a1f4e_45%,#304a9b_100%)]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Loan Calculator</h1>
          <p className="text-xl text-white/85">Estimate your monthly payments and total repayment</p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded shadow-lg p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (PHP)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value)
                    if (Number.isNaN(value)) {
                      setLoanAmount(MIN_LOAN_AMOUNT)
                      return
                    }
                    setLoanAmount(Math.min(Math.max(value, MIN_LOAN_AMOUNT), MAX_LOAN_AMOUNT))
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  min={MIN_LOAN_AMOUNT}
                  max={MAX_LOAN_AMOUNT}
                  step="10000"
                />
                <input
                  type="range"
                  min={MIN_LOAN_AMOUNT}
                  max={MAX_LOAN_AMOUNT}
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value) || MIN_LOAN_AMOUNT)}
                  className="w-full mt-3 accent-red-600"
                />
                <p className="text-xs text-gray-500 mt-2">{formatMoney(loanAmount)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={monthlyRatePercent}
                  onChange={(e) => setMonthlyRatePercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  min="0"
                  max="10"
                  step="0.1"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={monthlyRatePercent}
                  onChange={(e) => setMonthlyRatePercent(parseFloat(e.target.value) || 0)}
                  className="w-full mt-3 accent-red-600"
                />
                <p className="text-xs text-gray-500 mt-2">{monthlyRatePercent}% per month</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Months)</label>
                <input
                  type="number"
                  value={termMonths}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10)
                    if (Number.isNaN(value)) {
                      setTermMonths(MIN_TERM_MONTHS)
                      return
                    }
                    setTermMonths(Math.min(Math.max(value, MIN_TERM_MONTHS), MAX_TERM_MONTHS))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  min={MIN_TERM_MONTHS}
                  max={MAX_TERM_MONTHS}
                />
                <input
                  type="range"
                  min={MIN_TERM_MONTHS}
                  max={MAX_TERM_MONTHS}
                  step="1"
                  value={termMonths}
                  onChange={(e) => setTermMonths(parseInt(e.target.value, 10) || MIN_TERM_MONTHS)}
                  className="w-full mt-3 accent-red-600"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {termMonths} month{termMonths !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {result && (
              <div className="bg-gradient-to-r from-navy to-blue-900 text-white p-8 rounded mb-10 text-center">
                <p className="text-sm font-medium text-gray-300 mb-2">MONTHLY PAYMENT</p>
                <h2 className="text-5xl font-bold mb-4">{formatMoney(result.monthlyPayment)}</h2>
                <p className="text-gray-300">
                  Term: {termMonths} month{termMonths !== 1 ? 's' : ''} ({(termMonths / 12).toFixed(1)} years)
                </p>
              </div>
            )}

            {result && (
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Loan Term (Months)</p>
                  <p className="text-3xl font-bold text-red-500">
                    {termMonths} month{termMonths !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">PNV</p>
                  <p className="text-3xl font-bold text-navy">{formatMoney(result.totalRepayment)}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Loan Amount</p>
                  <p className="text-3xl font-bold text-charcoal">{formatMoney(loanAmount)}</p>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-8">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> These estimates are for informational purposes only. Actual payments may vary based on final loan terms, processing fees, and approval conditions. Subject to approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Use this calculator to explore options, then apply with us for competitive terms.
          </p>
          <a
            href="/#inquiry-form"
            className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
          >
            Start Your Application
          </a>
        </div>
      </section>
    </div>
  )
}
