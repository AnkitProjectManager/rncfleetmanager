"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Mail, Shield, Trash2 } from "lucide-react"

export default function TeamPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [team, setTeam] = useState<any[]>([])
  const [newMember, setNewMember] = useState({ name: "", role: "user", email: "" })

  useEffect(() => {
    const userData = localStorage.getItem("fleet_user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load team members from localStorage
    const users = JSON.parse(localStorage.getItem("fleet_users") || "[]")
    const orgUsers = users.filter((u: any) => u.orgId === parsedUser.orgId)
    setTeam(orgUsers)
  }, [router])

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return

    const users = JSON.parse(localStorage.getItem("fleet_users") || "[]")
    const newUser = {
      id: `user-${Date.now()}`,
      email: newMember.email,
      password: "temp-password-123",
      orgId: user.orgId,
      role: newMember.role,
      name: newMember.name,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    localStorage.setItem("fleet_users", JSON.stringify(users))
    setTeam([...team, newUser])
    setNewMember({ name: "", role: "user", email: "" })
  }

  const handleRemoveMember = (memberId: string) => {
    const users = JSON.parse(localStorage.getItem("fleet_users") || "[]")
    const filtered = users.filter((u: any) => u.id !== memberId)
    localStorage.setItem("fleet_users", JSON.stringify(filtered))
    setTeam(team.filter((m) => m.id !== memberId))
  }

  if (!user) return null

  return (
    <main className="flex-1 overflow-auto bg-slate-950">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-3xl font-bold text-white">Team Management</h1>
              <p className="text-slate-400">Manage team members and permissions</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Team Member</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Invite a new member to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-200">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-slate-200">
                    Role
                  </Label>
                  <select
                    id="role"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <Button onClick={handleAddMember} className="w-full bg-green-600 hover:bg-green-700">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <Card key={member.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{member.name}</CardTitle>
                    <CardDescription className="text-slate-400 capitalize">{member.role}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 rounded text-xs">
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400">{member.role}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                </div>
                {member.id !== user.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
