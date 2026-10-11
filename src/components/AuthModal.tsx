import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CocoaCycleLogo } from './CocoaCycleLogo';
import { Eye, EyeOff, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'farmer',
}) => {
  const { login, registerUser, users } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@cocoacycle.id');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regRole, setRegRole] = useState<'farmer' | 'buyer'>(
    initialRole === 'buyer' ? 'buyer' : 'farmer'
  );
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Farmer specific
  const [farmName, setFarmName] = useState('');
  const [farmerRegency, setFarmerRegency] = useState('');
  const [farmerVolumeKg, setFarmerVolumeKg] = useState('500');
  const [farmerMethod, setFarmerMethod] = useState<'diantar' | 'penjemputan'>('diantar');

  // Buyer specific
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerBusinessType, setBuyerBusinessType] = useState<
    'Produsen Kompos' | 'Pupuk Organik' | 'Media Tanam' | 'Pengolah Biomassa'
  >('Pupuk Organik');
  const [buyerRegency, setBuyerRegency] = useState('');
  const [buyerNeedsKg, setBuyerNeedsKg] = useState('3000');
  const [buyerTargetGrades, setBuyerTargetGrades] = useState<('Grade A' | 'Grade B' | 'Grade C')[]>([
    'Grade A',
    'Grade B',
  ]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail) {
      setErrorMessage('Harap masukkan alamat email.');
      return;
    }
    const success = login(loginEmail);
    if (success) {
      onClose();
    } else {
      setErrorMessage('Email tidak ditemukan dalam sistem demo CocoaCycle.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui syarat & ketentuan CocoaCycle.');
      return;
    }

    if (regRole === 'farmer') {
      registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
        role: 'farmer',
        farmerProfile: {
          farmName: farmName || `Kebun ${regName}`,
          regency: farmerRegency || 'Kabupaten Kakao',
          province: 'Indonesia',
          weeklyVolumeEstimateKg: Number(farmerVolumeKg) || 300,
          preferredMethod: farmerMethod,
          address: farmerRegency,
        },
      });
    } else {
      registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
        role: 'buyer',
        buyerProfile: {
          companyName: buyerCompany || regName,
          businessType: buyerBusinessType,
          regency: buyerRegency || 'Kota Industri',
          monthlyNeedsEstimateKg: Number(buyerNeedsKg) || 1000,
          targetGrades: buyerTargetGrades,
          address: buyerRegency,
        },
      });
    }

    setSuccessMessage('Pendaftaran berhasil! Akun Anda sedang dalam verifikasi.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const quickLoginAs = (email: string) => {
    login(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#EAE3D6] shadow-2xl overflow-hidden flex flex-col md:flex-row my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Left Side: Visual & Brand Narrative */}
        <div className="md:w-5/12 bg-[#234A38] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src="/images/plantation_farmers.jpg"
              alt="Perkebunan Kakao"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10">
            <CocoaCycleLogo variant="horizontal" size="md" inverted={true} showTagline={true} />
            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-[#F7F4ED]">
                {mode === 'login'
                  ? 'Konektivitas Pasokan & Bahan Baku Terukur'
                  : 'Bergabung dalam Rantai Nilai Ekonomi Sirkular'}
              </h2>
              <p className="text-sm text-[#EAE3D6]/90 leading-relaxed">
                Platform digital yang mentransformasi limbah kulit buah kakao segar menjadi komoditas
                organik kering berstandar industri dengan kadar air terverifikasi.
              </p>
            </div>
          </div>

          {/* Quick Persona Fill */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
            <div className="text-xs text-[#EAE3D6]/80 font-medium mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#84936A]" />
              Akses Cepat Demo Pengguna:
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => quickLoginAs('admin@cocoacycle.id')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between"
              >
                <span>Administrator (Budi Santoso)</span>
                <span className="text-[10px] text-white/70 font-mono">admin@cocoacycle.id</span>
              </button>
              <button
                type="button"
                onClick={() => quickLoginAs('slamet.riyadi@gmail.com')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between"
              >
                <span>Petani Kakao (Pak Slamet - Blitar)</span>
                <span className="text-[10px] text-white/70 font-mono">slamet@gmail.com</span>
              </button>
              <button
                type="button"
                onClick={() => quickLoginAs('buyer@pupukagrojatim.co.id')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-between"
              >
                <span>Pembeli B2B (PT Pupuk Agro Jatim)</span>
                <span className="text-[10px] text-white/70 font-mono">buyer@pupuk...</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form View */}
        <div className="md:w-7/12 p-6 sm:p-8 md:p-10 bg-white flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#38251F]">
                  {mode === 'login' ? 'Selamat Datang Kembali' : 'Pendaftaran Mitra CocoaCycle'}
                </h3>
                <p className="text-xs text-[#282A27]/60 mt-1">
                  {mode === 'login'
                    ? 'Masukkan kredensial akun terdaftar Anda untuk masuk.'
                    : 'Pilih jenis akun sesuai dengan peran usaha Anda.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[#282A27]/50 hover:text-[#282A27] rounded-lg hover:bg-[#F7F4ED] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error or Success Notice */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4" />
                {successMessage}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#38251F] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3D6] text-xs focus:outline-none focus:border-[#234A38] focus:ring-1 focus:ring-[#234A38]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#38251F]">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('Gunakan password demo: password123 atau pilih akun demo di samping.');
                      }}
                      className="text-xs text-[#234A38] hover:underline cursor-pointer"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3D6] text-xs focus:outline-none focus:border-[#234A38] focus:ring-1 focus:ring-[#234A38] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#282A27]/40 hover:text-[#282A27]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-xs text-[#282A27]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#EAE3D6] text-[#234A38] focus:ring-[#234A38]"
                    />
                    Ingat saya pada perangkat ini
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1a382b] transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  Masuk ke Platform
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                {/* Role Selector Tabs */}
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1.5">
                    Daftar Sebagai
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6]">
                    <button
                      type="button"
                      onClick={() => setRegRole('farmer')}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        regRole === 'farmer'
                          ? 'bg-white text-[#234A38] shadow-xs'
                          : 'text-[#282A27]/70 hover:text-[#282A27]'
                      }`}
                    >
                      Petani Kakao (Pemasok)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('buyer')}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        regRole === 'buyer'
                          ? 'bg-white text-[#234A38] shadow-xs'
                          : 'text-[#282A27]/70 hover:text-[#282A27]'
                      }`}
                    >
                      Pembeli B2B (Industri)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#38251F] mb-1">
                      Nama Lengkap / PIC
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      placeholder="e.g. Wayan Sudarma"
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] focus:border-[#234A38] focus:ring-1 focus:ring-[#234A38]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#38251F] mb-1">
                      Nomor Telepon / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] focus:border-[#234A38] focus:ring-1 focus:ring-[#234A38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="nama@perusahaan.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] focus:border-[#234A38] focus:ring-1 focus:ring-[#234A38]"
                  />
                </div>

                {/* Conditional Fields: Petani */}
                {regRole === 'farmer' && (
                  <div className="p-3 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] space-y-2.5">
                    <div className="font-semibold text-[#234A38] text-[11px] uppercase tracking-wider">
                      Informasi Kebun & Pasokan
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Nama Kebun</label>
                        <input
                          type="text"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          placeholder="e.g. Kebun Pupuan Asri"
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Kabupaten / Kota</label>
                        <input
                          type="text"
                          value={farmerRegency}
                          onChange={(e) => setFarmerRegency(e.target.value)}
                          placeholder="e.g. Tabanan, Bali"
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Estimasi Kulit Segar / Pekan (kg)</label>
                        <input
                          type="number"
                          value={farmerVolumeKg}
                          onChange={(e) => setFarmerVolumeKg(e.target.value)}
                          placeholder="500"
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Metode Penyerahan</label>
                        <select
                          value={farmerMethod}
                          onChange={(e) => setFarmerMethod(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        >
                          <option value="diantar">Diantar ke Pos CocoaCycle</option>
                          <option value="penjemputan">Minta Dijemput Armada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Fields: Pembeli B2B */}
                {regRole === 'buyer' && (
                  <div className="p-3 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] space-y-2.5">
                    <div className="font-semibold text-[#234A38] text-[11px] uppercase tracking-wider">
                      Informasi Industri & Kebutuhan Bahan Baku
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Nama Usaha / PT / CV</label>
                        <input
                          type="text"
                          value={buyerCompany}
                          onChange={(e) => setBuyerCompany(e.target.value)}
                          placeholder="e.g. PT Pupuk Alam Jaya"
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Jenis Usaha</label>
                        <select
                          value={buyerBusinessType}
                          onChange={(e) => setBuyerBusinessType(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        >
                          <option value="Pupuk Organik">Pupuk Organik</option>
                          <option value="Produsen Kompos">Produsen Kompos</option>
                          <option value="Media Tanam">Media Tanam Hortikultura</option>
                          <option value="Pengolah Biomassa">Pengolah Biomassa / Energi</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Kebutuhan Kering / Bulan (kg)</label>
                        <input
                          type="number"
                          value={buyerNeedsKg}
                          onChange={(e) => setBuyerNeedsKg(e.target.value)}
                          placeholder="3000"
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#282A27]/80 mb-0.5">Kota / Lokasi Pabrik</label>
                        <input
                          type="text"
                          value={buyerRegency}
                          onChange={(e) => setBuyerRegency(e.target.value)}
                          placeholder="e.g. Surabaya, Jawa Timur"
                          className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#EAE3D6]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#38251F] mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#38251F] mb-1">Konfirmasi Password</label>
                    <input
                      type="password"
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 text-[11px] text-[#282A27]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-[#EAE3D6] text-[#234A38] focus:ring-[#234A38]"
                    />
                    <span>
                      Saya menyetujui Syarat Layanan & Kebijakan Verifikasi Mutu CocoaCycle.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#234A38] text-white rounded-xl font-semibold hover:bg-[#1a382b] transition-colors shadow-xs"
                >
                  Kirim Pendaftaran Mitra
                </button>
              </form>
            )}
          </div>

          {/* Toggle between Login and Register */}
          <div className="pt-6 border-t border-[#EAE3D6] text-center text-xs text-[#282A27]/70">
            {mode === 'login' ? (
              <p>
                Belum memiliki akun mitra?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="text-[#234A38] font-bold hover:underline"
                >
                  Daftar Petani / Pembeli
                </button>
              </p>
            ) : (
              <p>
                Sudah memiliki akun terdaftar?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-[#234A38] font-bold hover:underline"
                >
                  Masuk di Sini
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
