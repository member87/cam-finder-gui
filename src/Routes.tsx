import { Router, Route } from 'electron-router-dom'

import { HomePage } from './pages/HomePage'
import { GeneratePage } from './pages/GeneratePage'

export function Routes() {
  return (
    <>
      <Router
        main={
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/view/:camera" element={<HomePage />} />
            <Route path="/view/:camera/:subpage" element={<HomePage />} />
            <Route path="/generate" element={<GeneratePage />} />
          </>
        }
      />
    </>
  )
}
