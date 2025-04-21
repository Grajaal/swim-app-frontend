import { Button } from '@/components/ui/button'
import { Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface TeamCodeButtonProps {
  teamCode: string | undefined
  isLoading: boolean
  error: Error | undefined
}

export function TeamCodeButton({ teamCode, isLoading, error }: TeamCodeButtonProps) {

  const copyTeamCode = () => {
    if (teamCode) {
      navigator.clipboard.writeText(teamCode)
      toast.success('Código de equipo copiado correctamente')
    } else {
      toast.error('No hay código de equipo')
    }
  }

  return (
    <Button
      className='bg-primary cursor-pointer'
      onClick={copyTeamCode}
    >
      {isLoading ? (
        <>
          <Loader2 className='size-4 mr-2 animate-spin' />
        </>
      ) : error ? (
        'Error al cargar'
      ) : teamCode ? (
        <>
          <Copy className='size-4' />
          {teamCode}
        </>
      ) : (
        'No hay equipo'
      )}
    </Button>
  )
}