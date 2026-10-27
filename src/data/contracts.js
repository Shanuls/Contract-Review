import CONTRACT_DOCUMENTS from './contractDocuments.json';

const BASE_CONTRACTS = [
  {
    id: "C-1002",
    supplier: "Godrej Material Handling Ltd",
    category: "Supply Chain & Warehousing",
    title: "High-Density Logistics Pallets & Automated Racks",
    value: 3800000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    sla: "Delivery within 14 business days of PO issue",
    paymentTerms: "Net 45 days after dock inspection",
    terminationClause: "30 days mutual written notice",
    compliance: "IS:4987 Racking Standards",
    lineItems: [
      { id: "li-1", desc: "Reinforced Poly Heavy-Duty Euro Pallets", unitRate: 3200, qty: 800 },
      { id: "li-2", desc: "Multi-Tier Heavy Pallet Rack Bays (5T capacity)", unitRate: 124000, qty: 10 }
    ],
    audit: [
      { id: "aud-1", action: "Contract Draft Ingested via SAP ERP", by: "Automated Ingestion", timestamp: "2026-10-12 09:30" },
      { id: "aud-2", action: "Compliance Checklist Cleared", by: "Suresh K (Procurement Ops)", timestamp: "2026-10-13 14:15" }
    ]
  },
  {
    id: "C-1042",
    supplier: "Apex Cloud Solutions Pvt Ltd",
    category: "Information Technology",
    title: "Enterprise ERP SaaS License & Support Extension",
    value: 6200000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    sla: "99.95% uptime with Tier-1 15-min response",
    paymentTerms: "Quarterly in advance against GST invoice",
    terminationClause: "60 days written notice with export of DB",
    compliance: "ISO 27001 / SOC 2 Type II",
    lineItems: [
      { id: "li-3", desc: "ERP Core Cloud User Seats (Annual)", unitRate: 45000, qty: 120 },
      { id: "li-4", desc: "Dedicated DB Instance & Disaster Recovery", unitRate: 800000, qty: 1 }
    ],
    audit: [
      { id: "aud-3", action: "Submitted for Review", by: "Kavitha R (IT Lead)", timestamp: "2026-10-14 11:00" },
      { id: "aud-4", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-15 10:20" }
    ]
  },
  {
    id: "C-1003",
    supplier: "Suraksha Safety Gear Ltd",
    category: "Safety & Facilities",
    title: "Industrial Safety PPE & Fire Protection Gear",
    value: 1250000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    sla: "Immediate dispatch within 48 hours for plant emergency stock",
    paymentTerms: "Net 30 days after store delivery",
    terminationClause: "15 days notice on quality deviation",
    compliance: "EN 388 / IS:2925 Industrial Safety Standard",
    lineItems: [
      { id: "li-5", desc: "Heat-Resistant Kevlar Welder Gloves (pairs)", unitRate: 650, qty: 1000 },
      { id: "li-6", desc: "Industrial Safety Helmets with Chin Straps", unitRate: 400, qty: 1500 }
    ],
    audit: [
      { id: "aud-5", action: "PO Created", by: "Vendor Portal", timestamp: "2026-10-15 14:00" }
    ]
  },
  {
    id: "C-1019",
    supplier: "Schneider Electric India",
    category: "Electrical & Plant Infrastructure",
    title: "Factory Substation Electrical Transformer Overhaul",
    value: 4200000,
    status: "Blocked",
    priority: "HIGH",
    // dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    sla: "On-site intervention within 2 hours of plant trip",
    paymentTerms: "30% advance, 70% post-commissioning testing",
    terminationClause: "Immediate termination for safety code violations",
    compliance: "CEA Safety Regulations 2023",
    lineItems: [
      { id: "li-7", desc: "11kV Oil-Cooled Step-down Transformer Service", unitRate: 2100000, qty: 2 }
    ],
    audit: [
      { id: "aud-6", action: "Blocked by Priya Raman", by: "Priya Raman", timestamp: "2026-10-16 16:30", note: "Pending electrical inspector signed certificate" }
    ]
  },
  {
    id: "C-1001",
    supplier: "Kirloskar Power Systems Ltd",
    category: "Machinery & Power",
    title: "Heavy Industrial Diesel Generators & Power Backup",
    value: 7450000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    sla: "Turnaround within 4 hours, uptime 99.8%",
    paymentTerms: "Net 60 days post commissioning",
    terminationClause: "30 days cure period for performance shortfall",
    compliance: "CPCB-IV+ Emission Norms",
    lineItems: [
      { id: "li-8", desc: "500 kVA DG Set with Acoustic Enclosure", unitRate: 3725000, qty: 2 }
    ],
    audit: [
      { id: "aud-7", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-17 09:10" }
    ]
  },
  {
    id: "C-1014",
    supplier: "LexPartners Law Associates",
    category: "Corporate & Legal",
    title: "Corporate Legal Advisory & Litigation Retainer 2026",
    value: 2400000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    sla: "Response to formal legal notices within 24 hours",
    paymentTerms: "Monthly retainer on the 1st of each calendar month",
    terminationClause: "60 days written notice by either party",
    compliance: "Bar Council of India Regulations",
    lineItems: [
      { id: "li-9", desc: "Monthly Corporate Advisory Services", unitRate: 200000, qty: 12 }
    ],
    audit: [
      { id: "aud-8", action: "Submitted for Legal Head Review", by: "Anand M (Legal Ops)", timestamp: "2026-10-16 12:00" }
    ]
  },
  {
    id: "C-1008",
    supplier: "BlueDart Express Freight",
    category: "Logistics",
    title: "Pan-India Surface & Express Air Cargo Retainer",
    value: 5800000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    sla: "Metros 24hr delivery, Non-metros 72hr delivery",
    paymentTerms: "Net 30 days bi-weekly consolidation invoice",
    terminationClause: "45 days mutual written notice",
    compliance: "Carriage by Road Act 2007",
    lineItems: [
      { id: "li-10", desc: "Standard Freight Retainer / Estimated Tonnage", unitRate: 5800000, qty: 1 }
    ],
    audit: [
      { id: "aud-9", action: "Draft Created", by: "Logistics Mgr", timestamp: "2026-10-18 10:00" }
    ]
  },
  {
    id: "C-1012",
    supplier: "Tata Consultancy Services",
    category: "Professional Services",
    title: "SAP S/4 HANA Migration Specialist Consultant Band",
    value: 8000000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    sla: "Dedicated on-site senior architect + 4 consultants",
    paymentTerms: "Monthly time & material milestone approval",
    terminationClause: "30 days written notice",
    compliance: "Information Technology Act 2000",
    lineItems: [
      { id: "li-11", desc: "Enterprise Architect (12 person-months)", unitRate: 400000, qty: 12 },
      { id: "li-12", desc: "Functional Senior Consultants (32 person-months)", unitRate: 100000, qty: 32 }
    ],
    audit: [
      { id: "aud-10", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-18 15:30" }
    ]
  },
  {
    id: "C-1025",
    supplier: "Siemens Healthcare India",
    category: "Medical & Health",
    title: "Occupational Health Center Diagnostic Imaging Setup",
    value: 5200000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    sla: "99.5% uptime with annual comprehensive maintenance",
    paymentTerms: "50% delivery, 50% installation and signoff",
    terminationClause: "Breach of warranty allows immediate return",
    compliance: "AERB Safety Radiation Protocols",
    lineItems: [
      { id: "li-13", desc: "Digital Radiography X-Ray Mobile System", unitRate: 5200000, qty: 1 }
    ],
    audit: [
      { id: "aud-11", action: "Draft Ingested", by: "ERP Portal", timestamp: "2026-10-18 11:20" }
    ]
  },
  {
    id: "C-1033",
    supplier: "Wipro Technologies Ltd",
    category: "Security & Infosec",
    title: "Managed Security Operations Center (SOC) 24x7 Coverage",
    value: 3600000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    sla: "Critical incident MTTR under 30 minutes",
    paymentTerms: "Quarterly billing post service SLA review",
    terminationClause: "90 days written notice",
    compliance: "CERT-In Directives 2022",
    lineItems: [
      { id: "li-14", desc: "24x7 SOC Coverage & Incident Response", unitRate: 900000, qty: 4 }
    ],
    audit: [
      { id: "aud-12", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-19 09:00" }
    ]
  },
    {
    id: "C-1005",
    supplier: "Honeywell Automation India",
    category: "HVAC & Energy",
    title: "Building Management System Smart Sensors",
    value: 1850000,
    status: "Open",
    priority: "LOW",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    sla: "10-day replacement on faulty sensors",
    paymentTerms: "Net 30 days against tax invoice",
    terminationClause: "30 days written notice",
    compliance: "BEE 5-Star Energy Norms",
    lineItems: [
      { id: "li-15", desc: "IoT Chilled Water Temperature Flow Sensors", unitRate: 18500, qty: 100 }
    ],
    audit: [
      { id: "aud-13", action: "Created in ERP", by: "Facilities Head", timestamp: "2026-10-17 18:00" }
    ]
  },
  {
    id: "C-1007",
    supplier: "CleanWork Industrial Solutions",
    category: "Facilities & Sanitation",
    title: "Annual Plant Housekeeping & Hazardous Waste Removal",
    value: 85000,
    status: "Approved",
    priority: "LOW",
    dueDate: new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0],
    sla: "Daily morning and night shift sanitation routines",
    paymentTerms: "Net 15 days monthly against attendance sheet",
    terminationClause: "15 days default notice",
    compliance: "Pollution Control Board Hazardous Waste Rules",
    lineItems: [
      { id: "li-16", desc: "Bio & Chemical Waste Disposal Service", unitRate: 21250, qty: 4 }
    ],
    audit: [
      { id: "aud-14", action: "Approved by Priya Raman", by: "Priya Raman", timestamp: "2026-10-10 11:20" }
    ]
  },
  {
    id: "C-1011",
    supplier: "Delta Hardware Supplies",
    category: "Fasteners & Tools",
    title: "High-Tensile Fasteners & Bolt Assortment Kit",
    value: 52000,
    status: "Rejected",
    priority: "LOW",
    dueDate: new Date(Date.now() - 12 * 86400000).toISOString().split("T")[0],
    sla: "Replacement of defective batch within 24 hours",
    paymentTerms: "Immediate upon delivery",
    terminationClause: "Cancellation before dispatch",
    compliance: "DIN 933 Standard",
    lineItems: [
      { id: "li-17", desc: "M16 Grade 8.8 Galvanized Hex Bolts", unitRate: 2600, qty: 20 }
    ],
    audit: [
      { id: "aud-15", action: "Rejected by Priya Raman", by: "Priya Raman", timestamp: "2026-10-08 14:40", note: "Supplier failed ASTM tensile certification criteria" }
    ]
  },
  {
    id: "C-1016",
    supplier: "Larsen & Toubro Heavy Civil",
    category: "Civil Construction",
    title: "Plant Unit-3 Warehouse Floor Extension",
    value: 6800000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    sla: "Completion within 60 calendar days of site handover",
    paymentTerms: "Progressive milestone billing",
    terminationClause: "15 days default notice with penalty clause",
    compliance: "IS:456 Reinforced Concrete Code",
    lineItems: [
      { id: "li-18", desc: "M30 Ready-Mix Reinforced Concrete Floor Laying", unitRate: 3400, qty: 2000 }
    ],
    audit: [
      { id: "aud-16", action: "Civil Engineering BOQ Uploaded", by: "Civil Team", timestamp: "2026-10-18 17:00" }
    ]
  },
  {
    id: "C-1018",
    supplier: "Thermax Limited",
    category: "Plant Utilities",
    title: "Industrial Steam Boiler Maintenance",
    value: 3400000,
    status: "Blocked",
    priority: "HIGH",
    // dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    sla: "Emergency engineer mobilization within 4 hours",
    paymentTerms: "Net 30 days with quarterly billing",
    terminationClause: "30 days notice for SLA shortfall",
    compliance: "Indian Boiler Regulations 1950",
    lineItems: [
      { id: "li-19", desc: "Annual Boiler Maintenance Package", unitRate: 850000, qty: 4 }
    ],
    audit: [
      { id: "aud-17", action: "Blocked by Priya Raman", by: "Priya Raman", timestamp: "2026-10-17 11:30", note: "Vendor fitness renewal certificate missing" }
    ]
  },
  {
    id: "C-1020",
    supplier: "Carrier Airconditioning & Refrigeration",
    category: "HVAC & Cooling",
    title: "Data Center Precision Air Conditioning Units",
    value: 4800000,
    status: "Open",
    priority: "HIGH",
    // dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    sla: "Operating temperature maintained at 21°C ± 1°C",
    paymentTerms: "40% dispatch, 60% commissioning sign-off",
    terminationClause: "Mutual consent within 30 days",
    compliance: "ASHRAE Standard 90.4",
    lineItems: [
      { id: "li-20", desc: "30 TR Precision Chiller Units", unitRate: 2400000, qty: 2 }
    ],
    audit: [
      { id: "aud-18", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-19 10:15" }
    ]
  },
  {
    id: "C-1022",
    supplier: "ABB India Limited",
    category: "Electrical & Plant Infrastructure",
    title: "Motor Control Centers and VFD Upgrade",
    value: 5400000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    sla: "Delivery in 3 weeks with factory acceptance testing",
    paymentTerms: "Net 45 days after installation",
    terminationClause: "30 days mutual written notice",
    compliance: "IEC 61439 Low-voltage Switchgear",
    lineItems: [
      { id: "li-21", desc: "ACS880 Industrial Variable Frequency Drive Panels", unitRate: 900000, qty: 6 }
    ],
    audit: [
      { id: "aud-19", action: "Procurement Ingestion", by: "ERP Syncer", timestamp: "2026-10-19 12:00" }
    ]
  },
  {
    id: "C-1024",
    supplier: "Honeywell Process Solutions",
    category: "Instrumentation & Automation",
    title: "Distributed Control System Safety Controllers",
    value: 7100000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    sla: "SIL-3 functional safety certification required",
    paymentTerms: "Quarterly milestone release against testing certificate",
    terminationClause: "Immediate termination for safety compliance failure",
    compliance: "IEC 61508 / IEC 61511",
    lineItems: [
      { id: "li-22", desc: "Safety Manager Redundant Controller Rack", unitRate: 3550000, qty: 2 }
    ],
    audit: [
      { id: "aud-20", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-19 14:00" }
    ]
  },
  {
    id: "C-1026",
    supplier: "Cisco Systems India",
    category: "Information Technology",
    title: "Enterprise Routing Switches and Firewall Hardware",
    value: 6400000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    sla: "24x7 support with 4-hour hardware replacement",
    paymentTerms: "Net 30 days after delivery and serial number verification",
    terminationClause: "30 days default notice",
    compliance: "TEC Mandatory Testing Compliance",
    lineItems: [
      { id: "li-23", desc: "Catalyst 9500 48-Port Core Switches", unitRate: 1600000, qty: 4 }
    ],
    audit: [
      { id: "aud-21", action: "Ingested via IT PO Workflow", by: "IT Procurement", timestamp: "2026-10-19 15:30" }
    ]
  },
  {
    id: "C-1028",
    supplier: "Bharat Petroleum Corporation Ltd",
    category: "Raw Fuel & Petroleum",
    title: "Bulk High-Speed Diesel Annual Supply Agreement",
    value: 7800000,
    status: "Open",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 6 * 86400000).toISOString().split("T")[0],
    sla: "Delivery within 24 hours of requisition",
    paymentTerms: "Weekly billing based on agreed pricing",
    terminationClause: "60 days written notice",
    compliance: "Petroleum Act 1934 and PESO Safety Guidelines",
    lineItems: [
      { id: "li-24", desc: "Bulk HSD Tanker Dispatches", unitRate: 91764, qty: 85 }
    ],
    audit: [
      { id: "aud-22", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-19 16:10" }
    ]
  },
    {
    id: "C-1035",
    supplier: "TeamLease Staffing Solutions",
    category: "Human Resources",
    title: "Contractual Plant Floor Operators and Assemblers",
    value: 2800000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    sla: "Candidate replacement within 48 hours",
    paymentTerms: "Monthly reimbursement plus 8% management fee",
    terminationClause: "30 days written notice",
    compliance: "Contract Labour Act 1970",
    lineItems: [
      { id: "li-25", desc: "Semi-Skilled Assembly Technicians", unitRate: 28000, qty: 100 }
    ],
    audit: [
      { id: "aud-23", action: "Requisition Generated", by: "HR Operations", timestamp: "2026-10-17 14:00" }
    ]
  },
  {
    id: "C-1037",
    supplier: "G4S Secure Solutions India",
    category: "Security & Guarding",
    title: "Industrial Facility Security and Guarding Services",
    value: 1950000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    sla: "Continuous security coverage at all gates",
    paymentTerms: "Net 15 days after attendance verification",
    terminationClause: "30 days written notice",
    compliance: "PSARA 2005",
    lineItems: [
      { id: "li-26", desc: "24-Hour Gate and Patrol Security", unitRate: 162500, qty: 12 }
    ],
    audit: [
      { id: "aud-24", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-19 11:45" }
    ]
  },
  {
    id: "C-1039",
    supplier: "Pidilite Industrial Adhesives",
    category: "Chemicals & Adhesives",
    title: "Industrial Bonding Adhesives and Epoxy Sealants",
    value: 980000,
    status: "Blocked",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 6 * 86400000).toISOString().split("T")[0],
    sla: "Minimum 12-month shelf-life guarantee",
    paymentTerms: "Net 45 days against invoice",
    terminationClause: "Cancellation for defective materials",
    compliance: "RoHS / REACH Chemical Safety Standards",
    lineItems: [
      { id: "li-27", desc: "Industrial PU Structural Sealant", unitRate: 24500, qty: 40 }
    ],
    audit: [
      { id: "aud-25", action: "Blocked by Priya Raman", by: "Priya Raman", timestamp: "2026-10-18 16:50", note: "Material Safety Data Sheet revision missing" }
    ]
  },
  {
    id: "C-1041",
    supplier: "Sodexo India Facility Services",
    category: "Catering & Welfare",
    title: "Factory Cafeteria and Employee Meal Services",
    value: 2100000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    sla: "Monthly hygiene audit and FSSAI compliance",
    paymentTerms: "Net 30 days based on verified meal count",
    terminationClause: "45 days termination notice for cause",
    compliance: "FSSAI Food Safety Act 2006",
    lineItems: [
      { id: "li-28", desc: "Monthly Staff Meal Service", unitRate: 175000, qty: 12 }
    ],
    audit: [
      { id: "aud-26", action: "Draft PO Created", by: "Plant Admin", timestamp: "2026-10-18 10:30" }
    ]
  },
  {
    id: "C-1044",
    supplier: "BOC Gases (Linde India)",
    category: "Industrial Gases",
    title: "Liquid Nitrogen and Oxygen Supply Agreement",
    value: 1650000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 8 * 86400000).toISOString().split("T")[0],
    sla: "Refill cryogenic tanks when levels reach 25%",
    paymentTerms: "Net 30 days after meter verification",
    terminationClause: "60 days written notice",
    compliance: "Gas Cylinders Rules 2016",
    lineItems: [
      { id: "li-29", desc: "Industrial Liquid Nitrogen Refills", unitRate: 55000, qty: 30 }
    ],
    audit: [
      { id: "aud-27", action: "Review Started", by: "Priya Raman", timestamp: "2026-10-19 14:15" }
    ]
  },
  {
    id: "C-1046",
    supplier: "Otis Elevator Company India",
    category: "Facilities & Elevators",
    title: "Passenger and Cargo Elevator Maintenance Contract",
    value: 780000,
    status: "Open",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 9 * 86400000).toISOString().split("T")[0],
    sla: "Emergency passenger rescue response within 30 minutes",
    paymentTerms: "Quarterly payments in advance",
    terminationClause: "30 days cure notice",
    compliance: "Lift and Escalator Act / IS:14665",
    lineItems: [
      { id: "li-30", desc: "Annual Elevator Service for Four Freight Lifts", unitRate: 195000, qty: 4 }
    ],
    audit: [
      { id: "aud-28", action: "Uploaded via Maintenance Portal", by: "Facilities Ops", timestamp: "2026-10-17 15:20" }
    ]
  },
  {
    id: "C-1048",
    supplier: "Godrej & Boyce Mfg Co Ltd",
    category: "Office Infrastructure",
    title: "Ergonomic Workstations and Conference Furniture",
    value: 460000,
    status: "Open",
    priority: "LOW",
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
    sla: "Assembly and installation within 10 days",
    paymentTerms: "Net 30 days after inspection",
    terminationClause: "Cancellation before factory dispatch",
    compliance: "BIFMA Standards Certification",
    lineItems: [
      { id: "li-31", desc: "High-Back Ergonomic Mesh Chairs", unitRate: 11500, qty: 40 }
    ],
    audit: [
      { id: "aud-29", action: "Draft PO Created", by: "Admin Dept", timestamp: "2026-10-18 12:40" }
    ]
  },
  {
    id: "C-1050",
    supplier: "HP India Sales Pvt Ltd",
    category: "Office IT",
    title: "Network Laser Printers and Multifunction Devices",
    value: 320000,
    status: "Open",
    priority: "LOW",
    dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0],
    sla: "Next-business-day onsite support",
    paymentTerms: "Net 30 days after delivery and setup",
    terminationClause: "30 days written notice",
    compliance: "BEE Star Energy Rating",
    lineItems: [
      { id: "li-32", desc: "Enterprise Multifunction Laser Printers", unitRate: 160000, qty: 2 }
    ],
    audit: [
      { id: "aud-30", action: "Requisition Approved by Admin", by: "IT Support", timestamp: "2026-10-19 13:00" }
    ]
  },
  {
    id: "C-1052",
    supplier: "Asian Paints Industrial Coating",
    category: "Consumables & Paint",
    title: "Epoxy Floor Coating and Anti-Rust Primer Supply",
    value: 185000,
    status: "Open",
    priority: "LOW",
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    sla: "Replacement of damaged drum seals within 24 hours",
    paymentTerms: "Payment upon warehouse gate pass",
    terminationClause: "Returns permitted for viscosity defects",
    compliance: "IS:101 Paint Testing Compliance",
    lineItems: [
      { id: "li-33", desc: "Industrial Grey Epoxy Floor Coating", unitRate: 9250, qty: 20 }
    ],
    audit: [
      { id: "aud-31", action: "Stores Requisition Ingested", by: "Stores Incharge", timestamp: "2026-10-18 16:30" }
    ]
  },
  {
    id: "C-1054",
    supplier: "Shree Stationery Mart",
    category: "Office Supplies",
    title: "Annual Copier Paper and Stationery Supply",
    value: 75000,
    status: "Open",
    priority: "LOW",
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    sla: "Next-day delivery for reorder bundles",
    paymentTerms: "Net 15 days consolidated billing",
    terminationClause: "Immediate cancellation permitted",
    compliance: "FSC Certified Recycled Paper",
    lineItems: [
      { id: "li-34", desc: "75 GSM A4 Copier Paper Bundles", unitRate: 1500, qty: 50 }
    ],
    audit: [
      { id: "aud-32", action: "Created via Petty Ops", by: "Store Admin", timestamp: "2026-10-19 14:45" }
    ]
  }
];


export const INITIAL_CONTRACTS = BASE_CONTRACTS.map(contract => ({...contract, documents: contract.documents?.length ? contract.documents : (CONTRACT_DOCUMENTS[contract.id] || [])}));

// Document metadata lives in JSON; existing contract fixtures remain unchanged.
import documentCatalog from './contractDocuments.json';
INITIAL_CONTRACTS.forEach((contract) => {
  contract.documents = documentCatalog[contract.id] || [];
});

