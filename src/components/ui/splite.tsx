'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="loader" style={{ 
            width: '48px', 
            height: '48px', 
            border: '3px solid #0071E3', 
            borderBottomColor: 'transparent', 
            borderRadius: '50%', 
            display: 'inline-block', 
            animation: 'spin 1s linear infinite' 
          }}></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}
