export interface IClient {
    id: string;
    name: string;
    nit: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    sites: { id: string; name: string; address: string }[];
}

export const clients: IClient[] = [
    { 
        id: "cliente-1", 
        name: "Grand Hotel Plaza", 
        nit: "900.123.456-7",
        phone: "3001234567",
        email: "contacto@grandhotelplaza.com",
        address: "Av. Siempre Viva 123",
        city: "Bogotá",
        sites: [
            { id: "sede-1-1", name: "Sede Principal", address: "Av. Siempre Viva 123" },
            { id: "sede-1-2", name: "Centro de Convenciones", address: "Calle Falsa 456" },
        ]
    },
    { 
        id: "cliente-2", 
        name: "Torres Corporativas Capital",
        nit: "800.987.654-3",
        phone: "3109876543",
        email: "admin@torrescapital.co",
        address: "Cra 7 # 71-21",
        city: "Bogotá",
        sites: [
            { id: "sede-2-1", name: "Torre A", address: "Cra 7 # 71-21, Piso 10" },
            { id: "sede-2-2", name: "Torre B", address: "Cra 7 # 71-21, Piso 20" },
        ]
    },
    { 
        id: "cliente-3", 
        name: "Centro Comercial Oasis",
        nit: "901.234.567-8",
        phone: "3202345678",
        email: "gerencia@ccoasis.com",
        address: "Autopista Norte Km 19",
        city: "Chía",
        sites: [
             { id: "sede-3-1", name: "Principal", address: "Autopista Norte Km 19" }
        ]
    },
];

export type EquipmentStatus = "ok" | "critico";
export type EquipmentHealth = "Crítico" | "Preventivo" | "OK";

export interface IEquipment {
    id: string;
    name: string;
    location: string;
    clientId: string;
    status: EquipmentStatus;
}

export const equipment: IEquipment[] = [
    { id: "eq-1", name: "Unidad A/C Central 1", location: "Planta Baja", clientId: "cliente-1", status: "ok" },
    { id: "eq-2", name: "Unidad A/C Central 2", location: "Piso 10", clientId: "cliente-1", status: "critico" },
    { id: "eq-3", name: "Sistema de Ventilación Torre A", location: "Sótano 1", clientId: "cliente-2", status: "ok" },
    { id: "eq-4", name: "Chiller Principal", location: "Feria de Comida", clientId: "cliente-3", status: "critico" },
    { id: "eq-5", name: "Bomba de Agua Torre B", location: "Sala de Bombas", clientId: "cliente-2", status: "ok" },
];

export const technicians = [
    { id: "tech-admin", name: "Mario Rossi" },
    { id: "tech-1", name: "Carlos Mappale" },
    { id: "tech-2", name: "Luis Fernandez" },
    { id: "tech-3", name: "Ana Torres" },
];

export type ServiceOrderStatus = "Pendiente" | "En Proceso" | "Completado";

export interface IServiceOrder {
    id: string;
    time: string;
    clientName: string;
    address: string;
    equipmentName: string;
    equipmentHealth: EquipmentHealth;
    status: ServiceOrderStatus;
    technicianId: string;
    technicianName: string;
    value?: number;
}

export const serviceOrders: IServiceOrder[] = [
    {
        id: "os-1",
        time: "09:00 AM",
        clientName: "Grand Hotel Plaza",
        address: "Av. Siempre Viva 123, Bogotá",
        equipmentName: "Unidad A/C Central 2",
        equipmentHealth: "Crítico",
        status: "Pendiente",
        technicianId: "tech-1",
        technicianName: "Carlos Mappale",
        value: 350,
    },
    {
        id: "os-2",
        time: "11:30 AM",
        clientName: "Torres Corporativas Capital",
        address: "Cra 7 # 71-21, Bogotá",
        equipmentName: "Bomba de Agua Torre B",
        equipmentHealth: "OK",
        status: "Pendiente",
        technicianId: "tech-1",
        technicianName: "Carlos Mappale",
        value: 120,
    },
    {
        id: "os-3",
        time: "02:00 PM",
        clientName: "Centro Comercial Oasis",
        address: "Autopista Norte Km 19, Chía",
        equipmentName: "Chiller Principal",
        equipmentHealth: "Preventivo",
        status: "Completado",
        technicianId: "tech-1",
        technicianName: "Carlos Mappale",
        value: 800,
    },
    {
        id: "os-4",
        time: "10:00 AM",
        clientName: "Grand Hotel Plaza",
        address: "Av. Siempre Viva 123, Bogotá",
        equipmentName: "Unidad A/C Central 1",
        equipmentHealth: "OK",
        status: "Completado",
        technicianId: "tech-2",
        technicianName: "Luis Fernandez",
        value: 150,
    },
     {
        id: "os-5",
        time: "Ayer",
        clientName: "Torres Corporativas Capital",
        address: "Cra 7 # 71-21, Bogotá",
        equipmentName: "Sistema de Ventilación Torre A",
        equipmentHealth: "OK",
        status: "Completado",
        technicianId: "tech-2",
        technicianName: "Luis Fernandez",
        value: 200,
    },
    {
        id: "os-6",
        time: "Ayer",
        clientName: "Grand Hotel Plaza",
        address: "Av. Siempre Viva 123, Bogotá",
        equipmentName: "Unidad A/C Central 1",
        equipmentHealth: "Preventivo",
        status: "Completado",
        technicianId: "tech-3",
        technicianName: "Ana Torres",
        value: 220,
    },
    {
        id: "os-7",
        time: "Ayer",
        clientName: "Centro Comercial Oasis",
        address: "Autopista Norte Km 19, Chía",
        equipmentName: "Chiller Principal",
        equipmentHealth: "OK",
        status: "Completado",
        technicianId: "tech-3",
        technicianName: "Ana Torres",
        value: 180,
    }
];

export type InventoryItemType = 'generic' | 'serialized';

export interface IInventoryItem {
    id: string;
    name: string;
    type: InventoryItemType;
    stock: number; // For generic: quantity. For serialized: count of serial numbers.
    criticalStockLevel: number;
    serials?: string[];
    location: string; // e.g., 'Bodega Principal', 'Técnico Carlos'
}

export const inventory: IInventoryItem[] = [
    { id: "inv-1", name: "Filtro de Aire 20x20", type: 'generic', stock: 50, criticalStockLevel: 10, location: "Bodega Principal" },
    { id: "inv-2", name: "Compresor Rotativo 5 Ton", type: 'serialized', stock: 5, criticalStockLevel: 2, serials: ["COMP-001", "COMP-002", "COMP-003", "COMP-004", "COMP-005"], location: "Bodega Principal" },
    { id: "inv-3", name: "Refrigerante R410A (Cilindro)", type: 'generic', stock: 3, criticalStockLevel: 5, location: "Bodega Principal" },
    { id: "inv-4", name: "Termostato Digital Programable", type: 'generic', stock: 25, criticalStockLevel: 10, location: "Carlos Mappale" },
    { id: "inv-5", name: "Tarjeta Controladora Universal", type: 'serialized', stock: 1, criticalStockLevel: 2, serials: ["CTRL-A-1001"], location: "Luis Fernandez" },
];

export interface KpiCardProps {
  title: string
  metric: string
  icon: keyof import('lucide-react').icons
  color: 'magenta' | 'cyan' | 'default'
  description: string
  compliance?: number
}

export const kpiData: KpiCardProps[] = [
    {
        title: "OS Hoy",
        metric: "12",
        icon: "ClipboardList",
        color: "cyan",
        description: "Órdenes de servicio para hoy.",
    },
    {
        title: "Equipos Críticos",
        metric: "2",
        icon: "ShieldAlert",
        color: "magenta",
        description: "Equipos que requieren atención.",
    },
    {
        title: "Técnicos Activos",
        metric: "3",
        icon: "Users",
        color: "cyan",
        description: "Técnicos actualmente en servicio.",
    },
    {
        title: "% Cumplimiento SLA",
        metric: "85%",
        icon: "CheckCircle2",
        color: "cyan",
        description: "+5% vs la semana pasada",
        compliance: 85,
    }
];
