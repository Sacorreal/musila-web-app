import { render, screen, fireEvent } from '@testing-library/react'
import { FollowButton } from '@domains/artists/components/FollowButton'
import { MusicRole } from '@domains/users/types/user.types'
import { AuthorResponse } from '@domains/artists/types/artist.types'
import { useAuthStore } from '@domains/auth/store/use-auth-store'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

const followMutate = jest.fn()
const unfollowMutate = jest.fn()
jest.mock('@domains/follows/hooks/use-follow.hooks', () => ({
  useFollowArtist: () => ({
    followMutation: { mutate: followMutate, isPending: false },
    unfollowMutation: { mutate: unfollowMutate, isPending: false },
  }),
}))

function buildArtist(overrides: Partial<AuthorResponse> = {}): AuthorResponse {
  return {
    id: 'artist-1',
    name: 'Ana',
    lastName: 'Ríos',
    email: 'ana@musila.com',
    countryCode: '+57',
    phone: '3000000000',
    planType: 'plan_autor',
    role: MusicRole.COMPOSITOR,
    avatar: null,
    isVerified: true,
    biography: null,
    tracks: [],
    preferredGenres: [],
    guests: [],
    requestSent: [],
    isUserFree: false,
    createdAt: '',
    updatedAt: '',
    deletedAt: null,
    playlists: [],
    followersCount: 10,
    isFollowingByViewer: false,
    ...overrides,
  }
}

describe('FollowButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useAuthStore.setState({ user: { id: 'viewer-1' } as any, token: 'token-123', isAuthenticated: true })
  })

  it('no renderiza si el rol del artista no es seguible', () => {
    const { container } = render(<FollowButton artist={buildArtist({ role: MusicRole.PRODUCTOR })} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('no renderiza en el perfil propio', () => {
    const { container } = render(<FollowButton artist={buildArtist({ id: 'viewer-1' })} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza "Seguir" cuando el usuario aún no sigue al artista', () => {
    render(<FollowButton artist={buildArtist({ isFollowingByViewer: false })} />)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/seguir/i)
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('llama a followMutation al hacer click cuando no sigue al artista', () => {
    render(<FollowButton artist={buildArtist({ isFollowingByViewer: false })} />)
    fireEvent.click(screen.getByRole('button'))

    expect(followMutate).toHaveBeenCalledTimes(1)
    expect(unfollowMutate).not.toHaveBeenCalled()
  })

  it('llama a unfollowMutation al hacer click cuando ya sigue al artista', () => {
    render(<FollowButton artist={buildArtist({ isFollowingByViewer: true })} />)
    fireEvent.click(screen.getByRole('button'))

    expect(unfollowMutate).toHaveBeenCalledTimes(1)
    expect(followMutate).not.toHaveBeenCalled()
  })

  it('redirige a /login en lugar de mutar si no hay sesión', () => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
    render(<FollowButton artist={buildArtist()} />)
    fireEvent.click(screen.getByRole('button'))

    expect(pushMock).toHaveBeenCalledWith('/login')
    expect(followMutate).not.toHaveBeenCalled()
  })
})
