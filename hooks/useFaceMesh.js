import { useEffect, useRef, useState } from 'react'
import { FaceMesh } from '@mediapipe/face_mesh'
import { Camera } from '@mediapipe/camera_utils'

export function useFaceMesh(videoRef) {
  const [landmarks, setLandmarks] = useState(null)
  const meshRef = useRef(null)
  const camRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    })

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    })

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks?.[0]) {
        setLandmarks(results.multiFaceLandmarks[0])
      }
    })

    let isMounted = true;

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (!isMounted || !videoRef.current || videoRef.current.readyState < 2) return;
        try {
          await faceMesh.send({ image: videoRef.current });
        } catch (e) {
          console.error("FaceMesh Send Error:", e);
        }
      },
      width: 640,
      height: 480
    })

    camera.start()
    meshRef.current = faceMesh
    camRef.current = camera

    return () => {
      isMounted = false;
      camera.stop()
      faceMesh.close()
    }
  }, [videoRef])

  return landmarks
}
