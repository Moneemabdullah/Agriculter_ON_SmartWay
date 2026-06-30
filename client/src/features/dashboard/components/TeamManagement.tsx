import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-sm text-gray-500">Manage your team members and their responsibilities</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
          <UserPlus className="mr-2 h-5 w-5" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            className="shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-green-200">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
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

                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    member.status === "active"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-amber-100 text-amber-700 border-amber-200"
                  }`}
                >
                  {member.status === "active" ? "Active" : "Away"}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-green-600" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>{member.responsibility}</span>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Team Activity</CardTitle>
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
              name: "Rayhan",
              action: "resolved critical alert in Field A",
              time: "8 hours ago",
            },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 text-sm">
              <Avatar className="h-9 w-9 ring-2 ring-green-200">
                <AvatarFallback className="bg-green-100 text-green-700 font-medium">
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
