import { Mail, User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
          Profile
        </h1>
        <p className="text-[#888]">Your account details.</p>
      </header>

      <section className="bg-[#111] border border-[#222] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#222] flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <div className="text-white font-medium">Alex Smith</div>
            <div className="text-[#888] text-sm">Organizer</div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-[#222]">
          <div className="flex items-center gap-3 text-[#888] pt-4">
            <User size={18} className="text-[#ccc]" />
            <span>Alex Smith</span>
          </div>
          <div className="flex items-center gap-3 text-[#888]">
            <Mail size={18} className="text-[#ccc]" />
            <span>alex@example.com</span>
          </div>
        </div>
      </section>
    </div>
  );
}
