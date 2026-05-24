import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Calculator, Car, CreditCard, Wallet, ReceiptText } from "lucide-react";
import "./index.css";

const WORK_CONTRACT_VALUES = {
  "4h": 180,
  "8h": 360,
};

const RENTAL_CAR_COST = 400;

function App() {
  return (
    <BrowserRouter basename="/bolt-uber-salariu">
      <Routes>
        <Route path="/" element={<CalculatorPage mode="salary" />} />
        <Route path="/desfasurator" element={<CalculatorPage mode="details" />} />
      </Routes>
    </BrowserRouter>
  );
}

function CalculatorPage({ mode }) {
  const [form, setForm] = useState({
    boltNet: "",
    boltCash: "",
    uberNet: "",
    uberCash: "",
    workContract: "4h",
    rentalCar: "nu",
  });

  const [result, setResult] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toNumber = (value) => {
    const number = Number(String(value).replace(",", "."));
    return Number.isFinite(number) ? number : 0;
  };

  const calculate = () => {
    const boltNet = toNumber(form.boltNet);
    const uberNet = toNumber(form.uberNet);
    const boltCash = toNumber(form.boltCash);
    const uberCash = toNumber(form.uberCash);

    const totalNet = boltNet + uberNet;
    const commission8Percent = totalNet * 0.08;
    const afterCommission = totalNet - commission8Percent;

    const totalCash = boltCash + uberCash;
    const workContractCost = WORK_CONTRACT_VALUES[form.workContract];
    const rentalCost = form.rentalCar === "da" ? RENTAL_CAR_COST : 0;

    const netApplicationsMinusCash = totalNet - totalCash;

    const finalSalary =
      afterCommission - totalCash - workContractCost - rentalCost;

    const salaryWithoutRental = finalSalary + rentalCost;

    const taxesBase =
      rentalCost > 0 ? salaryWithoutRental : finalSalary;

    const cas = taxesBase * 0.25;
    const cass = taxesBase * 0.1;
    const incomeTax = (taxesBase - cas - cass) * 0.1;

    const totalTaxes = cas + cass + incomeTax;

    setResult({
      finalSalary,
      commission8Percent,
      workContractCost,
      netApplicationsMinusCash,
      totalNet,
      totalCash,
      rentalCost,
      salaryWithoutRental,
      totalTaxes,
    });
  };

  const isDetailsPage = mode === "details";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
          {/* <nav className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-2xl px-5 py-3 text-sm font-bold transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-white/10 text-white/70 hover:bg-white/15"
                }`
              }
            >
              Calculator salariu
            </NavLink>

            <NavLink
              to="/desfasurator"
              className={({ isActive }) =>
                `rounded-2xl px-5 py-3 text-sm font-bold transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-white/10 text-white/70 hover:bg-white/15"
                }`
              }
            >
              Desfășurător
            </NavLink>
          </nav> */}

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <section className="hidden flex-col justify-between bg-white/10 p-10 lg:flex">
              <div>
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                  {isDetailsPage ? <ReceiptText size={28} /> : <Calculator size={28} />}
                </div>

                <h1 className="text-4xl font-bold tracking-tight">
                  {isDetailsPage ? "Desfășurător șofer" : "Calculator salariu șoferi"}
                </h1>

                <p className="mt-5 text-lg leading-relaxed text-white/70">
                  {isDetailsPage
                    ? "Introdu datele șoferului și vezi separat sumele reținute și diferența dintre NET-ul din aplicații și cash-ul luat în mână."
                    : "Introdu veniturile NET din Bolt și Uber, cash-ul încasat și costurile aferente. Platforma calculează automat suma finală."}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Formula
                </p>
                <p className="mt-3 text-white/80">
                  NET total - 8% - cash - carte de muncă - chirie mașină
                </p>
              </div>
            </section>

            <section className="p-6 sm:p-8 lg:p-10">
              <div className="mb-8 lg:hidden">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                  {isDetailsPage ? <ReceiptText size={24} /> : <Calculator size={24} />}
                </div>
                <h1 className="text-3xl font-bold">
                  {isDetailsPage ? "Desfășurător" : "Calculator salariu"}
                </h1>
                <p className="mt-3 text-white/65">
                  Completează câmpurile și apasă pe butonul de calcul.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputCard
                  icon={<CreditCard size={20} />}
                  label="Suma NET Bolt"
                  value={form.boltNet}
                  onChange={(value) => updateField("boltNet", value)}
                />

                <InputCard
                  icon={<Wallet size={20} />}
                  label="Cash încasat Bolt"
                  value={form.boltCash}
                  onChange={(value) => updateField("boltCash", value)}
                />

                <InputCard
                  icon={<CreditCard size={20} />}
                  label="Suma NET Uber"
                  value={form.uberNet}
                  onChange={(value) => updateField("uberNet", value)}
                />

                <InputCard
                  icon={<Wallet size={20} />}
                  label="Cash încasat Uber"
                  value={form.uberCash}
                  onChange={(value) => updateField("uberCash", value)}
                />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <RadioGroup
                  title="Carte de muncă"
                  options={[
                    { label: "4 ore", value: "4h" },
                    { label: "8 ore", value: "8h" },
                  ]}
                  value={form.workContract}
                  onChange={(value) => updateField("workContract", value)}
                />

                <RadioGroup
                  title="Mașină la chirie"
                  options={[
                    { label: "Da", value: "da" },
                    { label: "Nu", value: "nu" },
                  ]}
                  value={form.rentalCar}
                  onChange={(value) => updateField("rentalCar", value)}
                  icon={<Car size={20} />}
                />
              </div>

              <button
                onClick={calculate}
                className="mt-8 w-full rounded-2xl bg-emerald-400 px-6 py-4 text-base font-bold text-slate-950 transition duration-300 ease-in-out hover:bg-emerald-300 active:scale-[0.99]"
              >
                {isDetailsPage ? "Generează desfășurător" : "Calculează salariul"}
              </button>

              {result && !isDetailsPage && (
                <div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
                  <p className="text-sm uppercase tracking-[0.18em] text-emerald-200">
                    Salariu final
                  </p>
                  <p className="mt-3 text-4xl font-black text-emerald-300">
                    {result.finalSalary.toFixed(2)} lei
                  </p>
                </div>
              )}

              {result && isDetailsPage && (
                <div className="mt-6 space-y-4 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                  <p className="text-center text-sm uppercase tracking-[0.18em] text-emerald-200">
                    Desfășurător calcul
                  </p>

                  <DetailRow
                    label="8% oprit din NET total"
                    value={result.commission8Percent}
                  />

                  <DetailRow
                    label="Carte de muncă"
                    value={result.workContractCost}
                  />

                  <DetailRow
                    label="NET aplicații - cash luat în mână"
                    value={result.netApplicationsMinusCash}
                  />

                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <DetailRow
                      label="Total rețineri principale"
                      value={result.commission8Percent + result.workContractCost}
                      highlight
                    />
                    <DetailRow
                      label="Taxe aferente"
                      value={result.totalTaxes}
                      highlight
                    />
                    <DetailRow
                      label="Salariu final"
                      value={result.finalSalary}
                      highlight
                    />

                    {result.rentalCost > 0 && (
                      <DetailRow
                        label="Salariu fără chiria mașinii"
                        value={result.finalSalary + result.rentalCost}
                        highlight
                      />
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function InputCard({ icon, label, value, onChange }) {
  return (
    <label className="block rounded-3xl border border-white/10 bg-white/[0.07] p-4">
      <div className="mb-3 flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <input
        type="number"
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-none bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/25"
      />
    </label>
  );
}

function RadioGroup({ title, options, value, onChange, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-4">
      <div className="mb-4 flex items-center gap-2 text-white/70">
        {icon}
        <p className="text-sm font-medium">{title}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ease-in-out ${value === option.value
              ? "bg-emerald-400 text-slate-950"
              : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-4">
      <span className="text-sm text-white/70">{label}</span>
      <span
        className={`text-lg font-black ${highlight ? "text-emerald-300" : "text-white"
          }`}
      >
        {value.toFixed(2)} lei
      </span>
    </div>
  );
}

export default App;