export const kpiData = [
  {
    title: "Employee Headcount",
    metric: "1,204",
    change: "+12.5%",
    changeType: "increase",
    description: "Total active employees in the organization.",
    chartData: [
      { name: "Current", value: 1204, fill: "hsl(var(--chart-1))" },
      { name: "Previous", value: 1070, fill: "hsl(var(--muted))" },
    ],
  },
  {
    title: "Turnover Rate",
    metric: "8.2%",
    change: "-1.8%",
    changeType: "decrease",
    description: "Rate of employees leaving the company.",
    chartData: [
      { name: "Current", value: 8.2, fill: "hsl(var(--chart-2))" },
      { name: "Goal", value: 10, fill: "hsl(var(--muted))" },
    ],
  },
  {
    title: "Avg. Tenure",
    metric: "4.1 yrs",
    change: "+0.2 yrs",
    changeType: "increase",
    description: "Average length of employment.",
    chartData: [
      { name: "Current", value: 4.1, fill: "hsl(var(--chart-4))" },
      { name: "Previous", value: 3.9, fill: "hsl(var(--muted))" },
    ],
  },
  {
    title: "Hiring Cost",
    metric: "$4,129",
    change: "+$250",
    changeType: "increase",
    description: "Average cost to hire a new employee.",
    chartData: [
      { name: "Current", value: 4129, fill: "hsl(var(--chart-5))" },
      { name: "Budget", value: 4500, fill: "hsl(var(--muted))" },
    ],
  },
]

export const departmentPerformanceData = [
  { department: "Engineering", headcount: 350, turnover: 5.8 },
  { department: "Sales", headcount: 220, turnover: 12.1 },
  { department: "Marketing", headcount: 150, turnover: 9.5 },
  { department: "Product", headcount: 180, turnover: 4.2 },
  { department: "HR", headcount: 80, turnover: 7.0 },
  { department: "Support", headcount: 224, turnover: 10.5 },
]

export const clients = [
    { id: "cliente-1", name: "Grand Hotel Plaza" },
    { id: "cliente-2", name: "Torres Corporativas Capital" },
    { id: "cliente-3", name: "Centro Comercial Oasis" },
];

export const equipment = [
    { id: "eq-1", name: "Unidad A/C Central 1", location: "Grand Hotel Plaza", clientId: "cliente-1" },
    { id: "eq-2", name: "Unidad A/C Central 2", location: "Grand Hotel Plaza", clientId: "cliente-1" },
    { id: "eq-3", name: "Sistema de Ventilación Torre A", location: "Torres Corporativas Capital", clientId: "cliente-2" },
    { id: "eq-4", name: "Chiller Principal", location: "Centro Comercial Oasis", clientId: "cliente-3" },
    { id: "eq-5", name: "Bomba de Agua Torre B", location: "Torres Corporativas Capital", clientId: "cliente-2" },
];

export const technicians = [
    { id: "tech-1", name: "Carlos Mendoza" },
    { id: "tech-2", name: "Luis Fernandez" },
    { id: "tech-3", name: "Ana Torres" },
];

export const inventory = [
    { id: "inv-1", name: "Filtro de Aire 20x20", stock: 50 },
    { id: "inv-2", name: "Compresor Rotativo 5 Ton", stock: 12 },
    { id: "inv-3", name: "Refrigerante R410A (Cilindro)", stock: 5 },
    { id: "inv-4", name: "Termostato Digital Programable", stock: 25 },
];
