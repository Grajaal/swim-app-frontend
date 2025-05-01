import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface TablePaginationProps {
  page: number
  totalPages: number
  onPreviousPage: () => void
  onNextPage: () => void
  onFirstPage: () => void
  onLastPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
}

export function TablePagination({
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  canPreviousPage,
  canNextPage
}: TablePaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!canPreviousPage}
            onClick={onPreviousPage}
            className={cn(
              !canPreviousPage && 'opacity-50 pointer-events-none cursor-not-allowed'
            )}
          />
        </PaginationItem>
        {page > 1 && (
          <PaginationItem>
            <PaginationLink onClick={onFirstPage}>1</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={onLastPage}>{totalPages}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={onNextPage}
            aria-disabled={!canNextPage}
            className={cn(
              !canNextPage && 'opacity-50 pointer-events-none cursor-not-allowed'
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>

  )
}