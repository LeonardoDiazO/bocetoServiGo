"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IEquipment } from "@/lib/data"
import { MapPin } from "lucide-react"

interface CriticalEquipment extends IEquipment {
  clientName: string;
  address: string;
}

interface EquipmentMapProps {
  criticalEquipment: CriticalEquipment[]
}

// Hardcoded positions for demo purposes, as we don't have real lat/lng
const markerPositions = [
  { top: '25%', left: '30%' },
  { top: '60%', left: '75%' },
  { top: '40%', left: '15%' },
  { top: '75%', left: '50%' },
  { top: '15%', left: '60%' },
]


const ServiGoIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 drop-shadow-lg">
        <path d="M50 12 L56 12 L58 20 C62 22 66 25 69 29 L77 27 L80 33 L73 38 C74 42 74 47 73 51 L80 56 L77 62 L69 60 C66 64 62 67 58 69 L56 77 L50 77 L48 69 C44 67 40 64 37 60 L29 62 L26 56 L33 51 C32 47 32 42 33 38 L26 33 L29 27 L37 29 C40 25 44 22 48 20 L50 12 Z" fill="#2563EB" />
        <circle cx="50" cy="45" r="20" fill="white" />
        <g transform="rotate(-45 50 45)">
            <path d="M50 12 L60 45 L50 45 Z" fill="#1E3A8A" />
            <path d="M50 12 L40 45 L50 45 Z" fill="#3B82F6" />
            <path d="M50 78 L60 45 L50 45 Z" fill="#C2410C" />
            <path d="M50 78 L40 45 L50 45 Z" fill="#F97316" />
            <circle cx="50" cy="45" r="5" fill="white" />
        </g>
    </svg>
)

export function EquipmentMap({ criticalEquipment }: EquipmentMapProps) {
  if (criticalEquipment.length === 0) {
    return (
        <Card className="card-sg h-full">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación de Equipos Críticos
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-80">
                <p className="text-muted-foreground">No hay equipos en estado crítico.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="card-sg h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación de Equipos Críticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div 
                className="relative h-[400px] w-full rounded-md overflow-hidden bg-muted"
            >
                <Image 
                    src="https://images.unsplash.com/photo-1594924284493-541e21952328?q=80&w=1200&h=400&fit=crop"
                    alt="Mapa de la ciudad con puntos de geolocalización"
                    fill
                    className="object-cover brightness-90"
                    data-ai-hint="city map"
                />
                {criticalEquipment.map((eq, index) => {
                    const position = markerPositions[index % markerPositions.length];
                    return (
                        <Tooltip key={eq.id}>
                            <TooltipTrigger asChild>
                                <div 
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-10"
                                    style={{ top: position.top, left: position.left }}
                                >
                                    <ServiGoIcon />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-bold">{eq.name}</p>
                                <p className="text-sm text-muted-foreground">{eq.clientName}</p>
                                <p className="text-xs text-muted-foreground">{eq.address}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
