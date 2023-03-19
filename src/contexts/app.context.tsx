import { createContext, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchases.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLs } from 'src/utils/auth'

interface AppContextInterface {
  isAuthen: boolean
  setIsAuthen: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthen: Boolean(getAccessTokenFromLS()),
  setIsAuthen: () => null,
  profile: getProfileFromLs(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvide = ({ children }: { children: React.ReactNode }) => {
  const [isAuthen, setIsAuthen] = useState<boolean>(initialAppContext.isAuthen)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchases)
  const reset = () => {
    setIsAuthen(false), setProfile(null), setExtendedPurchases([])
  }
  return (
    <AppContext.Provider
      value={{ isAuthen, setIsAuthen, profile, setProfile, extendedPurchases, setExtendedPurchases, reset }}
    >
      {children}
    </AppContext.Provider>
  )
}
