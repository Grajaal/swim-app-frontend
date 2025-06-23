'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// User, Team, TeamSwimmer, TeamCoach types are assumed to be globally available
// from frontend/lib/types/db.d.ts

interface UserDetailsModalProps {
  user: User // The full user object, with populated team details
  triggerText?: string // Optional text for a simple text trigger
}

export function UserDetailsModal({ user, triggerText = "View Details" }: UserDetailsModalProps) {
  if (!user || (user.role !== 'SWIMMER' && user.role !== 'COACH')) {
    return null
  }

  const renderSwimmerDetails = () => {
    if (!user.swimmer?.team) return <p>No team details available.</p>
    const { team } = user.swimmer
    const coachName = team.coach ? `${team.coach.firstName} ${team.coach.lastName || ''}`.trim() : 'N/A'

    return (
      <>
        <p><strong>Team Code:</strong> {team.teamCode}</p>
        <p><strong>Coach:</strong> {coachName}</p>
        <h4 className="font-semibold mt-2">Teammates:</h4>
        {team.swimmers && team.swimmers.length > 0 ? (
          <ul className="list-disc pl-5">
            {team.swimmers
              .filter(sw => sw.id !== user.swimmer?.id)
              .map((sw: TeamSwimmer) => (
                <li key={sw.id}>{`${sw.firstName} ${sw.lastName || ''}`.trim()}</li>
              ))}
          </ul>
        ) : (
          <p>No other swimmers in this team.</p>
        )}
      </>
    )
  }

  const renderCoachDetails = () => {
    if (!user.coach?.team) return <p>No team details available.</p>
    const { team } = user.coach

    return (
      <>
        <p><strong>Team Code:</strong> {team.teamCode}</p>
        <h4 className="font-semibold mt-2">Swimmers in Team:</h4>
        {team.swimmers && team.swimmers.length > 0 ? (
          <ul className="list-disc pl-5">
            {team.swimmers.map((sw: TeamSwimmer) => (
              <li key={sw.id}>{`${sw.firstName} ${sw.lastName || ''}`.trim()}</li>
            ))}
          </ul>
        ) : (
          <p>No swimmers in this team.</p>
        )}
      </>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-blue-600 hover:underline cursor-pointer text-sm">
          {triggerText}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            User Details: {user.role === 'SWIMMER' ? `${user.swimmer?.firstName} ${user.swimmer?.lastName || ''}`.trim() : `${user.coach?.firstName} ${user.coach?.lastName || ''}`.trim()}
          </DialogTitle>
          <DialogDescription>
            Detailed information for {user.email}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {user.role === 'SWIMMER' && renderSwimmerDetails()}
          {user.role === 'COACH' && renderCoachDetails()}
        </div>
      </DialogContent>
    </Dialog>
  )
} 