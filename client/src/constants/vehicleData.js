export const vehicleTypes = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Crossover",
  "Coupe",
  "Convertible",
  "Pickup",
  "Van",
  "Minivan",
  "Station Wagon",
  "MPV",
  "Microcar",
  "Roadster",
  "Cabrio",
  "Fastback",
  "Liftback",
  "Limousine",
  "Targa",
  "Shooting Brake",
  "Hardtop",
  "Other"
];

export const vehicleBrands = [
  "Diğer",
  "Abarth",
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Pagani",
  "Peugeot",
  "Porsche",
  "Ram",
  "Renault",
  "Rolls-Royce",
  "Saab",
  "Seat",
  "Skoda",
  "Smart",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo"
];

// Her marka için mevcut tipler
export const vehicleBrandTypes = {
  "Diğer": ["Diğer"],
  "Abarth": ["Hatchback", "Coupe", "Diğer"],
  "Acura": ["Sedan", "SUV", "Crossover", "Diğer"],
  "Alfa Romeo": ["Sedan", "SUV", "Coupe", "Diğer"],
  "Aston Martin": ["Coupe", "Convertible", "SUV", "Diğer"],
  "Audi": ["Sedan", "SUV", "Coupe", "Convertible", "Station Wagon", "Hatchback", "Diğer"],
  "Bentley": ["Sedan", "SUV", "Coupe", "Convertible", "Diğer"],
  "BMW": ["Sedan", "SUV", "Coupe", "Convertible", "Station Wagon", "Hatchback", "Diğer"],
  "Bugatti": ["Coupe", "Convertible", "Diğer"],
  "Buick": ["Sedan", "SUV", "Crossover", "Diğer"],
  "Cadillac": ["Sedan", "SUV", "Coupe", "Diğer"],
  "Chevrolet": ["Sedan", "SUV", "Pickup", "Coupe", "Convertible", "Diğer"],
  "Chrysler": ["Sedan", "Minivan", "Diğer"],
  "Citroën": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Dacia": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Dodge": ["Sedan", "SUV", "Pickup", "Coupe", "Diğer"],
  "Ferrari": ["Coupe", "Convertible", "SUV", "Diğer"],
  "Fiat": ["Sedan", "Hatchback", "MPV", "Van", "Diğer"],
  "Ford": ["Sedan", "SUV", "Pickup", "Coupe", "Hatchback", "Diğer"],
  "Genesis": ["Sedan", "SUV", "Coupe", "Diğer"],
  "GMC": ["SUV", "Pickup", "Diğer"],
  "Honda": ["Sedan", "SUV", "Hatchback", "MPV", "Diğer"],
  "Hyundai": ["Sedan", "SUV", "Hatchback", "Coupe", "Diğer"],
  "Infiniti": ["Sedan", "SUV", "Coupe", "Diğer"],
  "Jaguar": ["Sedan", "SUV", "Coupe", "Convertible", "Diğer"],
  "Jeep": ["SUV", "Pickup", "Diğer"],
  "Kia": ["Sedan", "SUV", "Hatchback", "MPV", "Diğer"],
  "Lamborghini": ["Coupe", "Convertible", "SUV", "Diğer"],
  "Land Rover": ["SUV", "Diğer"],
  "Lexus": ["Sedan", "SUV", "Coupe", "Convertible", "Diğer"],
  "Lincoln": ["Sedan", "SUV", "Diğer"],
  "Lotus": ["Coupe", "Convertible", "Diğer"],
  "Maserati": ["Sedan", "SUV", "Coupe", "Convertible", "Diğer"],
  "Mazda": ["Sedan", "SUV", "Hatchback", "Coupe", "Diğer"],
  "McLaren": ["Coupe", "Convertible", "Diğer"],
  "Mercedes-Benz": ["Sedan", "SUV", "Coupe", "Convertible", "Station Wagon", "Hatchback", "Diğer"],
  "Mini": ["Hatchback", "Coupe", "Convertible", "SUV", "Diğer"],
  "Mitsubishi": ["Sedan", "SUV", "Hatchback", "Diğer"],
  "Nissan": ["Sedan", "SUV", "Hatchback", "Pickup", "Diğer"],
  "Opel": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Pagani": ["Coupe", "Convertible", "Diğer"],
  "Peugeot": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Porsche": ["Coupe", "Convertible", "SUV", "Sedan", "Diğer"],
  "Ram": ["Pickup", "Van", "Diğer"],
  "Renault": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Rolls-Royce": ["Sedan", "SUV", "Coupe", "Convertible", "Diğer"],
  "Saab": ["Sedan", "Station Wagon", "Diğer"],
  "Seat": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Skoda": ["Sedan", "Hatchback", "SUV", "MPV", "Diğer"],
  "Smart": ["Hatchback", "Coupe", "Diğer"],
  "Subaru": ["Sedan", "SUV", "Station Wagon", "Diğer"],
  "Suzuki": ["Sedan", "SUV", "Hatchback", "Diğer"],
  "Tesla": ["Sedan", "SUV", "Coupe", "Diğer"],
  "Toyota": ["Sedan", "SUV", "Hatchback", "Pickup", "MPV", "Diğer"],
  "Volkswagen": ["Sedan", "SUV", "Hatchback", "MPV", "Station Wagon", "Diğer"],
  "Volvo": ["Sedan", "SUV", "Station Wagon", "Diğer"]
};

// Marka + Tip -> Model
export const vehicleModels = {
  "Diğer": {
    "Diğer": ["Diğer"]
  },
  "Abarth": {
    "Hatchback": ["500", "595", "695", "Diğer"],
    "Coupe": ["124 Spider", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Acura": {
    "Sedan": ["ILX", "TLX", "RLX", "Diğer"],
    "SUV": ["MDX", "RDX", "Diğer"],
    "Crossover": ["CDX", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Alfa Romeo": {
    "Sedan": ["Giulia", "Diğer"],
    "SUV": ["Stelvio", "Tonale", "Diğer"],
    "Coupe": ["4C", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Aston Martin": {
    "Coupe": ["DB11", "Vantage", "DBS Superleggera", "Diğer"],
    "Convertible": ["DB11 Volante", "Vantage Roadster", "Diğer"],
    "SUV": ["DBX", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Audi": {
    "Sedan": ["A3", "A4", "A6", "A8", "S3", "S4", "S6", "S8", "RS3", "RS4", "RS6", "RS7", "Diğer"],
    "SUV": ["Q3", "Q5", "Q7", "Q8", "SQ5", "SQ7", "SQ8", "RS Q3", "RS Q8", "Diğer"],
    "Coupe": ["A5", "A7", "S5", "S7", "RS5", "RS7", "Diğer"],
    "Convertible": ["A5 Cabriolet", "TT Roadster", "R8 Spyder", "Diğer"],
    "Station Wagon": ["A4 Avant", "A6 Avant", "RS4 Avant", "RS6 Avant", "Diğer"],
    "Hatchback": ["A3 Sportback", "RS3 Sportback", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Bentley": {
    "Sedan": ["Flying Spur", "Diğer"],
    "SUV": ["Bentayga", "Diğer"],
    "Coupe": ["Continental GT", "Diğer"],
    "Convertible": ["Continental GTC", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "BMW": {
    "Sedan": ["3 Series", "5 Series", "7 Series", "M3", "M5", "Diğer"],
    "SUV": ["X1", "X3", "X5", "X7", "XM", "Diğer"],
    "Coupe": ["4 Series", "8 Series", "M4", "M8", "Diğer"],
    "Convertible": ["4 Series Convertible", "8 Series Convertible", "Z4", "Diğer"],
    "Station Wagon": ["3 Series Touring", "5 Series Touring", "Diğer"],
    "Hatchback": ["1 Series", "2 Series Gran Coupe", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Bugatti": {
    "Coupe": ["Chiron", "Diğer"],
    "Convertible": ["Chiron Roadster", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Buick": {
    "Sedan": ["Regal", "LaCrosse", "Diğer"],
    "SUV": ["Enclave", "Envision", "Diğer"],
    "Crossover": ["Encore", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Cadillac": {
    "Sedan": ["CT4", "CT5", "CT6", "Diğer"],
    "SUV": ["XT4", "XT5", "XT6", "Escalade", "Diğer"],
    "Coupe": ["CT4-V", "CT5-V", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Chevrolet": {
    "Sedan": ["Malibu", "Impala", "Camaro", "Diğer"],
    "SUV": ["Tahoe", "Suburban", "Traverse", "Equinox", "Trax", "Diğer"],
    "Pickup": ["Silverado", "Colorado", "Diğer"],
    "Coupe": ["Corvette", "Diğer"],
    "Convertible": ["Camaro Convertible", "Corvette Convertible", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Chrysler": {
    "Sedan": ["300", "Diğer"],
    "Minivan": ["Pacifica", "Voyager", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Citroën": {
    "Sedan": ["C5", "Diğer"],
    "Hatchback": ["C3", "C4", "Diğer"],
    "SUV": ["C3 Aircross", "C5 Aircross", "Diğer"],
    "MPV": ["Berlingo", "C4 Picasso", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Dacia": {
    "Sedan": ["Logan", "Diğer"],
    "Hatchback": ["Sandero", "Diğer"],
    "SUV": ["Duster", "Jogger", "Diğer"],
    "MPV": ["Lodgy", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Dodge": {
    "Sedan": ["Charger", "Diğer"],
    "SUV": ["Durango", "Diğer"],
    "Pickup": ["Ram", "Diğer"],
    "Coupe": ["Challenger", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Ferrari": {
    "Coupe": ["F8 Tributo", "SF90 Stradale", "296 GTB", "Diğer"],
    "Convertible": ["F8 Spider", "SF90 Spider", "296 GTS", "Diğer"],
    "SUV": ["Purosangue", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Fiat": {
    "Sedan": ["Egea", "Linea", "Diğer"],
    "Hatchback": ["500", "Punto", "Diğer"],
    "MPV": ["Doblo", "Qubo", "Diğer"],
    "Van": ["Fiorino", "Ducato", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Ford": {
    "Sedan": ["Focus", "Fiesta", "Mondeo", "Diğer"],
    "SUV": ["Explorer", "Escape", "Bronco", "Diğer"],
    "Pickup": ["F-150", "Ranger", "Diğer"],
    "Coupe": ["Mustang", "Diğer"],
    "Hatchback": ["Focus", "Fiesta", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Genesis": {
    "Sedan": ["G70", "G80", "G90", "Diğer"],
    "SUV": ["GV70", "GV80", "Diğer"],
    "Coupe": ["G70", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "GMC": {
    "SUV": ["Yukon", "Acadia", "Terrain", "Diğer"],
    "Pickup": ["Sierra", "Canyon", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Honda": {
    "Sedan": ["Civic", "Accord", "Insight", "Diğer"],
    "SUV": ["CR-V", "Pilot", "Passport", "Diğer"],
    "Hatchback": ["Civic Hatchback", "Diğer"],
    "MPV": ["Odyssey", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Hyundai": {
    "Sedan": ["Elantra", "Sonata", "Accent", "Diğer"],
    "SUV": ["Tucson", "Santa Fe", "Palisade", "Diğer"],
    "Hatchback": ["i20", "i30", "Diğer"],
    "Coupe": ["Veloster", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Infiniti": {
    "Sedan": ["Q50", "Q60", "Diğer"],
    "SUV": ["QX50", "QX60", "QX80", "Diğer"],
    "Coupe": ["Q60", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Jaguar": {
    "Sedan": ["XE", "XF", "Diğer"],
    "SUV": ["E-Pace", "F-Pace", "I-Pace", "Diğer"],
    "Coupe": ["F-Type", "Diğer"],
    "Convertible": ["F-Type Convertible", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Jeep": {
    "SUV": ["Cherokee", "Grand Cherokee", "Compass", "Renegade", "Diğer"],
    "Pickup": ["Gladiator", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Kia": {
    "Sedan": ["Rio", "Cerato", "Stinger", "Diğer"],
    "SUV": ["Sportage", "Sorento", "Telluride", "Diğer"],
    "Hatchback": ["Rio", "Ceed", "Diğer"],
    "MPV": ["Carnival", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Lamborghini": {
    "Coupe": ["Huracan", "Aventador", "Diğer"],
    "Convertible": ["Huracan Spyder", "Aventador Roadster", "Diğer"],
    "SUV": ["Urus", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Land Rover": {
    "SUV": ["Defender", "Discovery", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Lexus": {
    "Sedan": ["IS", "ES", "LS", "Diğer"],
    "SUV": ["NX", "RX", "GX", "LX", "Diğer"],
    "Coupe": ["RC", "LC", "Diğer"],
    "Convertible": ["LC Convertible", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Lincoln": {
    "Sedan": ["Continental", "MKZ", "Diğer"],
    "SUV": ["Aviator", "Navigator", "Corsair", "Nautilus", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Lotus": {
    "Coupe": ["Emira", "Evora", "Diğer"],
    "Convertible": ["Elise", "Exige", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Maserati": {
    "Sedan": ["Ghibli", "Quattroporte", "Diğer"],
    "SUV": ["Levante", "Grecale", "Diğer"],
    "Coupe": ["MC20", "Diğer"],
    "Convertible": ["GranCabrio", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Mazda": {
    "Sedan": ["Mazda3", "Mazda6", "Diğer"],
    "SUV": ["CX-3", "CX-5", "CX-9", "CX-30", "Diğer"],
    "Hatchback": ["Mazda3", "Diğer"],
    "Coupe": ["MX-5", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "McLaren": {
    "Coupe": ["720S", "765LT", "Artura", "Diğer"],
    "Convertible": ["720S Spider", "765LT Spider", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Mercedes-Benz": {
    "Sedan": ["A-Class", "C-Class", "E-Class", "S-Class", "Diğer"],
    "SUV": ["GLA", "GLC", "GLE", "GLS", "G-Class", "Diğer"],
    "Coupe": ["CLA", "CLS", "AMG GT", "Diğer"],
    "Convertible": ["C-Class Cabriolet", "E-Class Cabriolet", "S-Class Cabriolet", "Diğer"],
    "Station Wagon": ["C-Class Estate", "E-Class Estate", "Diğer"],
    "Hatchback": ["A-Class", "CLA", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Mini": {
    "Hatchback": ["Cooper", "Cooper S", "Diğer"],
    "Coupe": ["Cooper Coupe", "Diğer"],
    "Convertible": ["Cooper Convertible", "Diğer"],
    "SUV": ["Countryman", "Paceman", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Mitsubishi": {
    "Sedan": ["Lancer", "Mirage", "Diğer"],
    "SUV": ["Outlander", "Eclipse Cross", "ASX", "Diğer"],
    "Hatchback": ["Space Star", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Nissan": {
    "Sedan": ["Altima", "Maxima", "Sentra", "Diğer"],
    "SUV": ["Rogue", "Murano", "Pathfinder", "Armada", "Diğer"],
    "Hatchback": ["Versa", "Leaf", "Diğer"],
    "Pickup": ["Frontier", "Titan", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Opel": {
    "Sedan": ["Insignia", "Diğer"],
    "Hatchback": ["Corsa", "Astra", "Diğer"],
    "SUV": ["Mokka", "Crossland", "Grandland", "Diğer"],
    "MPV": ["Zafira", "Combo", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Pagani": {
    "Coupe": ["Huayra", "Utopia", "Diğer"],
    "Convertible": ["Huayra Roadster", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Peugeot": {
    "Sedan": ["508", "Diğer"],
    "Hatchback": ["208", "308", "Diğer"],
    "SUV": ["2008", "3008", "5008", "Diğer"],
    "MPV": ["Rifter", "Traveller", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Porsche": {
    "Coupe": ["911", "Cayman", "Panamera", "Diğer"],
    "Convertible": ["911 Cabriolet", "Boxster", "Diğer"],
    "SUV": ["Cayenne", "Macan", "Diğer"],
    "Sedan": ["Taycan", "Panamera", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Ram": {
    "Pickup": ["1500", "2500", "3500", "Diğer"],
    "Van": ["ProMaster", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Renault": {
    "Sedan": ["Megane", "Talisman", "Diğer"],
    "Hatchback": ["Clio", "Megane", "Diğer"],
    "SUV": ["Captur", "Kadjar", "Arkana", "Diğer"],
    "MPV": ["Espace", "Scenic", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Rolls-Royce": {
    "Sedan": ["Ghost", "Phantom", "Diğer"],
    "SUV": ["Cullinan", "Diğer"],
    "Coupe": ["Wraith", "Diğer"],
    "Convertible": ["Dawn", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Saab": {
    "Sedan": ["9-3", "9-5", "Diğer"],
    "Station Wagon": ["9-3 SportCombi", "9-5 SportCombi", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Seat": {
    "Sedan": ["Leon", "Toledo", "Diğer"],
    "Hatchback": ["Ibiza", "Leon", "Diğer"],
    "SUV": ["Arona", "Ateca", "Tarraco", "Diğer"],
    "MPV": ["Alhambra", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Skoda": {
    "Sedan": ["Octavia", "Superb", "Diğer"],
    "Hatchback": ["Fabia", "Octavia", "Diğer"],
    "SUV": ["Kodiaq", "Karoq", "Kamiq", "Diğer"],
    "MPV": ["Roomster", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Smart": {
    "Hatchback": ["ForTwo", "ForFour", "Diğer"],
    "Coupe": ["ForTwo Coupe", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Subaru": {
    "Sedan": ["Impreza", "Legacy", "Diğer"],
    "SUV": ["Forester", "Outback", "Crosstrek", "Diğer"],
    "Station Wagon": ["Levorg", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Suzuki": {
    "Sedan": ["Ciaz", "Diğer"],
    "SUV": ["Vitara", "Jimny", "S-Cross", "Diğer"],
    "Hatchback": ["Swift", "Baleno", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Tesla": {
    "Sedan": ["Model 3", "Model S", "Diğer"],
    "SUV": ["Model Y", "Model X", "Diğer"],
    "Coupe": ["Roadster", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Toyota": {
    "Sedan": ["Corolla", "Camry", "Avalon", "Diğer"],
    "SUV": ["RAV4", "Highlander", "4Runner", "Land Cruiser", "Diğer"],
    "Hatchback": ["Corolla Hatchback", "Yaris", "Diğer"],
    "Pickup": ["Tacoma", "Tundra", "Diğer"],
    "MPV": ["Sienna", "Alphard", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Volkswagen": {
    "Sedan": ["Jetta", "Passat", "Arteon", "Diğer"],
    "SUV": ["Tiguan", "Atlas", "T-Roc", "Taos", "Diğer"],
    "Hatchback": ["Golf", "Polo", "Diğer"],
    "MPV": ["Touran", "Sharan", "Diğer"],
    "Station Wagon": ["Golf Variant", "Passat Variant", "Diğer"],
    "Diğer": ["Diğer"]
  },
  "Volvo": {
    "Sedan": ["S60", "S90", "Diğer"],
    "SUV": ["XC40", "XC60", "XC90", "Diğer"],
    "Station Wagon": ["V60", "V90", "Diğer"],
    "Diğer": ["Diğer"]
  }
}; 