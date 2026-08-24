'use client';

import { useState } from 'react';
import { Mail, User, Shield, Users, UserPlus, X } from 'lucide-react';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useTeamMembers } from '@/lib/api/business/hooks/useTeamMembers';
import { useForm } from 'react-hook-form';
import type { TeamRole } from '@/types/business';
import MagneticButton from '@/components/MagneticButton';
import Card from '@/components/Card';

export default function AccountPage() {
  const { session } = useSession();
  const { members, inviteMember, removeMember } = useTeamMembers(session?.businessId);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('editor');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !session?.businessId) return;
    await inviteMember(session.businessId, inviteEmail, inviteRole);
    setInviteEmail('');
  };

  if (!session) return null;

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
          Account Settings
        </h1>
        <p className="text-muted-foreground">Manage your personal info and team.</p>
      </header>

      <Card className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><User size={20}/> Profile</h2>
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-xl uppercase">
            {session.user.name[0]}
          </div>
          <div>
            <div className="text-foreground font-medium">{session.user.name}</div>
            <div className="text-muted-foreground text-sm">{session.user.email}</div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">Change Password</h3>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input type="password" placeholder="Current password" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
            <input type="password" placeholder="New password" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
            <MagneticButton type="button" variant="outline" className="py-2 px-4 text-sm">Update Password</MagneticButton>
          </form>
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Users size={20}/> Team Members</h2>
        
        <div className="space-y-4 border-b border-border pb-6">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
              <div>
                <div className="text-sm font-bold text-foreground">{member.name} {member.id === session.user.id && '(You)'}</div>
                <div className="text-xs text-muted-foreground">{member.email} • <span className="capitalize">{member.role}</span> • {member.status}</div>
              </div>
              {member.id !== session.user.id && (
                <button onClick={() => removeMember(member.id)} className="text-destructive hover:text-red-400 p-2">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleInvite} className="space-y-4">
          <h3 className="text-sm font-bold text-foreground">Invite a team member</h3>
          <div className="flex gap-4">
            <input 
              type="email" 
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com" 
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent text-sm" 
              required
            />
            <select 
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as TeamRole)}
              className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent text-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <MagneticButton type="submit" variant="primary" className="py-2 px-4 text-sm flex items-center gap-2">
              <UserPlus size={16} /> Invite
            </MagneticButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
