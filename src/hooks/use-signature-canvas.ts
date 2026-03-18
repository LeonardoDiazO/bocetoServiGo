"use client"

import { useRef, useEffect, useCallback, RefObject } from "react"

export function useSignatureCanvas(
  canvasRef: RefObject<HTMLCanvasElement>
) {
  const isDrawingRef = useRef(false)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Adjust for device pixel ratio for crisper lines
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const context = canvas.getContext("2d")
    if (!context) return
    
    context.scale(dpr, dpr)
    context.lineCap = "round"
    context.strokeStyle = "black"
    context.lineWidth = 2
    contextRef.current = context
  }, [canvasRef])

  useEffect(() => {
    prepareCanvas()
    window.addEventListener("resize", prepareCanvas)
    return () => {
      window.removeEventListener("resize", prepareCanvas)
    }
  }, [prepareCanvas])

  const getEventPosition = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();

    if (event instanceof MouseEvent) {
        return { offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    } else if (event.touches && event.touches.length > 0) {
        return { offsetX: event.touches[0].clientX - rect.left, offsetY: event.touches[0].clientY - rect.top };
    }
    return { offsetX: 0, offsetY: 0 };
  };

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (!contextRef.current) return
    const { offsetX, offsetY } = getEventPosition(event);
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    isDrawingRef.current = true
  }, [])

  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (!isDrawingRef.current || !contextRef.current) return
    const { offsetX, offsetY } = getEventPosition(event);
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }, [])

  const stopDrawing = useCallback(() => {
    if (!contextRef.current) return
    contextRef.current.closePath()
    isDrawingRef.current = false
  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseleave", stopDrawing)

    canvas.addEventListener("touchstart", startDrawing, { passive: false })
    canvas.addEventListener("touchmove", draw, { passive: false })
    canvas.addEventListener("touchend", stopDrawing)

    return () => {
      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mousemove", draw)
      canvas.removeEventListener("mouseup", stopDrawing)
      canvas.removeEventListener("mouseleave", stopDrawing)

      canvas.removeEventListener("touchstart", startDrawing)
      canvas.removeEventListener("touchmove", draw)
      canvas.removeEventListener("touchend", stopDrawing)
    }
  }, [canvasRef, startDrawing, draw, stopDrawing])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      // Need to re-prepare to reset scaling after clear
      prepareCanvas();
    }
  }, [canvasRef, prepareCanvas])
  
  const getSignatureDataUrl = () => {
    const canvas = canvasRef.current
    if(canvas && !isCanvasBlank(canvas)) {
        return canvas.toDataURL("image/png");
    }
    return null;
  }

  const isCanvasBlank = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return true;
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
  }

  return { clearSignature, getSignatureDataUrl }
}
