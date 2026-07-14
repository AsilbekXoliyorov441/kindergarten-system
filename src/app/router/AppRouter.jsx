import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BOGCHA_ROUTES } from '@/shared/config/bogcha'
import { RequireAuth } from '@/app/router/RequireAuth'
import { RequireStaff } from '@/app/router/RequireStaff'
import { RequireSuperAdmin } from '@/app/router/RequireSuperAdmin'
import { HomeRoute } from '@/app/router/HomeRoute'
import { AppLayout } from '@/app/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { BogchaGroupsPage } from '@/pages/BogchaGroupsPage/BogchaGroupsPage'
import { BogchaGroupDetailPage } from '@/pages/BogchaGroupDetailPage/BogchaGroupDetailPage'
import { BogchaStaffPage } from '@/pages/BogchaStaffPage/BogchaStaffPage'
import { BogchaChildProfilePage } from '@/pages/BogchaChildProfilePage/BogchaChildProfilePage'
import { BogchaSettingsPage } from '@/pages/BogchaSettingsPage/BogchaSettingsPage'
import { BogchaThreadsPage } from '@/pages/BogchaThreadsPage/BogchaThreadsPage'
import { BogchaCorrespondencePage } from '@/pages/BogchaCorrespondencePage/BogchaCorrespondencePage'
import { BogchaStatisticsPage } from '@/pages/BogchaStatisticsPage/BogchaStatisticsPage'
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage'

export function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path={BOGCHA_ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<HomeRoute />} />
          <Route
            path="guruhlar"
            element={
              <RequireSuperAdmin>
                <BogchaGroupsPage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="guruhlar/:groupId"
            element={
              <RequireStaff>
                <BogchaGroupDetailPage />
              </RequireStaff>
            }
          />
          <Route path="bola/:childId" element={<BogchaChildProfilePage />} />
          <Route
            path="xodimlar"
            element={
              <RequireSuperAdmin>
                <BogchaStaffPage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="sozlamalar"
            element={
              <RequireSuperAdmin>
                <BogchaSettingsPage />
              </RequireSuperAdmin>
            }
          />
          <Route path="murojaatlar" element={<BogchaThreadsPage />} />
          <Route
            path="yozishmalar"
            element={
              <RequireSuperAdmin>
                <BogchaCorrespondencePage />
              </RequireSuperAdmin>
            }
          />
          <Route
            path="statistika"
            element={
              <RequireSuperAdmin>
                <BogchaStatisticsPage />
              </RequireSuperAdmin>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}
