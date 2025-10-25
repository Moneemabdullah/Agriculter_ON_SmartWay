import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Mail, Shield, UserPlus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  responsibility: string;
  status: "active" | "away";
  avatar?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Abdullah Al Moneem",
    role: "Project Manager",
    email: "abdullah@smartagri.com",
    responsibility: "Backend & Hardware Lead",
    status: "active",
  },
  {
    id: "2",
    name: "Md. Rifat Hossain",
    role: "Technical Project Manager",
    email: "rifat@smartagri.com",
    responsibility: "Management & Integration Lead",
    status: "active",
  },
  {
    id: "3",
    name: "Mustafizur Rahman",
    role: "Software Engineer",
    email: "mustafiz@smartagri.com",
    responsibility: "Frontend & Codebase Lead",
    status: "active",
  },
  {
    id: "4",
    name: "Rayhan Islam Prome",
    role: "Software Engineer",
    email: "rayhan@smartagri.com",
    responsibility: "UI/UX & Database Lead",
    status: "active",
  },
];

export function TeamManagement() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-10 p-6 md:p-10 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-emerald-700 tracking-tight">
          {/* 👥 Team Management */}
        </h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md">
          <UserPlus className="mr-2 h-5 w-5" />
          Invite Member
        </Button>
      </div>

      {/* Team Member Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="rounded-3xl border-none bg-white/60 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                {/* Avatar + Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-emerald-500/20">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>

                {/* Status */}
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    member.status === "active"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                  }`}
                >
                  {member.status === "active" ? "Active" : "Away"}
                </Badge>
              </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-sky-500" />
                <span>{member.responsibility}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-sky-300 text-sky-700 hover:bg-sky-50 rounded-lg"
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <Card className="rounded-3xl border-none bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-emerald-700">
            🌿 Team Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              name: "Abdullah",
              action: "updated Field A irrigation schedule",
              time: "2 hours ago",
            },
            {
              name: "Rifat",
              action: "added new crop to Field C",
              time: "5 hours ago",
            },
            {
              name: "Mustafiz",
              action: "resolved critical alert in Field A",
              time: "8 hours ago",
            },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 text-sm">
              <Avatar className="h-9 w-9 ring-2 ring-emerald-400/20">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
                  {activity.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p>
                  <span className="font-semibold text-gray-800">
                    {activity.name}
                  </span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
